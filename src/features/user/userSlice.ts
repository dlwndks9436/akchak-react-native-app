import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../redux/store';
import * as SecureStore from 'expo-secure-store';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {API_URL} from '../../utils/constants';
import Api from '../../libs/api';

interface LoginForm {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string | null;
  refreshToken: string | null;
}

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  id: number;
  email: string | null;
  username: string;
  authorized: boolean;
  bannedUntil: Date | null;
}

interface UserState {
  id: number | null;
  email: string | null;
  username: string | null;
  tokens: Tokens;
  loggedIn: boolean | null;
  authorized: boolean;
  lastTimeAuthenticated: number | null;
  bannedUntil: Date | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  loginError: string | null;
  initializeError: string | null;
  authorizeUserError: string | null;
  accountDeletionResult: string | null;
}

const initialState: UserState = {
  id: null,
  email: null,
  username: null,
  tokens: {accessToken: null, refreshToken: null},
  loggedIn: null,
  authorized: false,
  bannedUntil: null,
  lastTimeAuthenticated: null,
  status: 'idle',
  loginError: null,
  initializeError: null,
  authorizeUserError: null,
  accountDeletionResult: null,
};

export const initializeUser = createAsyncThunk(
  'user/initializeUser',
  async () => {
    console.log('initializing user');

    const tokens = await SecureStore.getItemAsync('tokens');
    const lastTimeAuthenticated = await SecureStore.getItemAsync(
      'lastTimeAuthenticated',
    );

    if (tokens && lastTimeAuthenticated) {
      console.log('access token is stored in storage');

      const {accessToken} = JSON.parse(tokens);
      const user = await Api.get('player/info', {
        headers: {Authorization: 'Bearer ' + accessToken},
      });

      if (user) {
        console.log('접속한 유저 정보 : ', user.data);
        return {
          tokens: JSON.parse(tokens),
          lastTimeAuthenticated: Number.parseInt(lastTimeAuthenticated, 10),
          authorized: user.data.authorized,
          bannedUntil: user.data.banned_until,
          email: user.data.email,
          username: user.data.username,
          id: user.data.id,
        };
      }
    }
    console.log('not able to find access token');

    return null;
  },
);

export const login = createAsyncThunk(
  'user/login',
  async (input: LoginForm) => {
    const {email, password} = input;
    console.log('start login');

    const result = {
      tokens: {accessToken: '', refreshToken: ''} as Tokens,
      id: 0,
      authorized: false,
      bannedUntil: null as Date | null,
      email: '',
      username: '',
      lastTimeAuthenticated: 0,
      statusCode: 0,
    };

    await axios
      .post(API_URL + 'player/login', {
        email,
        password,
      })
      .then(async (response: AxiosResponse<LoginResult>) => {
        const tokens = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        } as Tokens;
        const id = response.data.id;
        const authorized = response.data.authorized;
        const bannedUntil = response.data.bannedUntil;
        const username = response.data.username;
        const lastTimeAuthenticated = new Date(Date.now()).getTime();
        await SecureStore.setItemAsync('tokens', JSON.stringify(tokens));
        await SecureStore.setItemAsync(
          'lastTimeAuthenticated',
          lastTimeAuthenticated.toString(),
        );
        console.log('success');
        result.tokens = tokens;
        result.lastTimeAuthenticated = lastTimeAuthenticated;
        result.id = id;
        result.authorized = authorized;
        result.bannedUntil = bannedUntil;
        result.email = email;
        result.username = username;
      })
      .catch((err: AxiosError) => {
        console.log(err.response?.data);
        console.log(err.response?.status);
        if (err.response?.status) {
          result.statusCode = err.response?.status;
        }
      });
    return result;
  },
);

export const logout = createAsyncThunk('user/logout', async () => {
  const tokens = await SecureStore.getItemAsync('tokens');
  if (!tokens) {
    return null;
  }
  const {refreshToken} = JSON.parse(tokens);
  console.log(`refresh token: ${refreshToken}`);

  await axios
    .delete(API_URL + 'token', {
      headers: {Authorization: 'Bearer ' + refreshToken},
    })
    .catch(err => console.log(err));
  await SecureStore.deleteItemAsync('tokens');
  await SecureStore.deleteItemAsync('lastTimeAuthenticated');
  return null;
});

export const reissueToken = createAsyncThunk('user/reissueToken', async () => {
  const tokenStr = await SecureStore.getItemAsync('tokens');
  if (tokenStr === null) {
    return null;
  }
  const {refreshToken} = JSON.parse(tokenStr);
  const result = await axios.patch(API_URL + 'token', null, {
    headers: {Authorization: 'Bearer ' + refreshToken},
  });
  if (result.status === 200) {
    const tokens = result.data;
    const lastTimeAuthenticated = new Date(Date.now()).getTime();
    await SecureStore.setItemAsync('tokens', JSON.stringify(tokens));
    await SecureStore.setItemAsync(
      'lastTimeAuthenticated',
      lastTimeAuthenticated.toString(),
    );
    return {tokens, lastTimeAuthenticated};
  }
  return null;
});

export const authorizeUser = createAsyncThunk(
  'user/authorizeUser',
  async (code: string) => {
    const tokens = await SecureStore.getItemAsync('tokens');
    if (!tokens) {
      return null;
    }
    const {accessToken} = JSON.parse(tokens);
    const result = await Api.patch(
      'player/authorized',
      {code},
      {headers: {Authorization: 'Bearer ' + accessToken}},
    );
    if (result.status === 200) {
      console.log('인증 코드 일치함');

      return 200;
    } else if (result.status === 403) {
      console.log('인증 코드 일치하지 않음');
      return 403;
    }
  },
);

export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async () => {
    const tokens = await SecureStore.getItemAsync('tokens');
    if (!tokens) {
      return null;
    }
    const {accessToken} = JSON.parse(tokens);
    await axios
      .delete(API_URL + 'player/account', {
        headers: {Authorization: 'Bearer ' + accessToken},
      })
      .then(async () => {
        await SecureStore.deleteItemAsync('tokens');
        await SecureStore.deleteItemAsync('lastTimeAuthenticated');
      });

    return null;
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.tokens.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.tokens.refreshToken = action.payload;
    },
    setTokens: (state, action: PayloadAction<Tokens>) => {
      state.tokens = action.payload;
    },
    setLastTimeAuthenticated: (state, action: PayloadAction<number>) => {
      state.lastTimeAuthenticated = action.payload;
    },
    dropauthorizeError: state => {
      state.authorizeUserError = null;
    },
    dropLoginError: state => {
      state.loginError = null;
    },
    dropDeletionResult: state => {
      state.accountDeletionResult = null;
    },
    dropUser: state => {
      state.tokens.accessToken = '';
      state.tokens.refreshToken = '';
      state.loggedIn = false;
      state.lastTimeAuthenticated = null;
      state.accountDeletionResult = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(initializeUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(initializeUser.fulfilled, (state, action) => {
        console.log('fullfilled');

        if (action.payload) {
          if (!state.tokens.accessToken && !state.tokens.refreshToken) {
            state.tokens = action.payload.tokens;
          }
          state.lastTimeAuthenticated = action.payload.lastTimeAuthenticated;
          state.authorized = action.payload.authorized;
          state.bannedUntil = action.payload.bannedUntil;
          state.initializeError = null;
          state.email = action.payload.email;
          state.username = action.payload.username;
          state.id = action.payload.id;
          state.loggedIn = true;
          state.accountDeletionResult = null;
        } else {
          state.loggedIn = false;
        }
        state.status = 'succeeded';
      })
      .addCase(initializeUser.rejected, (state, action) => {
        console.log('rejected');
        state.status = 'failed';
        state.loggedIn = false;
        if (action.error.message !== undefined) {
          console.log(action.error.message);

          state.initializeError = action.error.message;
        }
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload) {
          if (action.payload.tokens && action.payload.lastTimeAuthenticated) {
            state.tokens = action.payload.tokens;
            state.authorized = action.payload.authorized;
            state.bannedUntil = action.payload.bannedUntil;
            state.email = action.payload.email;
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.loggedIn = true;
            state.lastTimeAuthenticated = action.payload.lastTimeAuthenticated;
          } else {
            if (
              action.payload.statusCode === 400 ||
              action.payload.statusCode === 401 ||
              action.payload.statusCode === 404
            ) {
              state.loginError = '이메일이나 비밀번호가 옳지 않습니다';
            } else {
              state.loginError =
                '서버에 문제가 발생했습니다. 다시 시도해주세요';
            }
          }
        }
      })
      .addCase(logout.fulfilled, state => {
        state.tokens.accessToken = '';
        state.tokens.refreshToken = '';
        state.loggedIn = false;
        state.lastTimeAuthenticated = null;
      })
      .addCase(logout.rejected, state => {
        state.tokens.accessToken = '';
        state.tokens.refreshToken = '';
        state.loggedIn = false;
        state.lastTimeAuthenticated = null;
      })
      .addCase(reissueToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.tokens = action.payload.tokens;
          state.lastTimeAuthenticated = action.payload.lastTimeAuthenticated;
        }
      })
      .addCase(authorizeUser.fulfilled, (state, action) => {
        if (action.payload) {
          if (action.payload === 200) {
            state.authorized = true;
            state.authorizeUserError = null;
          } else {
            state.authorizeUserError = 'Given code is not valid.';
          }
        }
      })
      .addCase(deleteAccount.fulfilled, state => {
        state.accountDeletionResult = '회원탈퇴가 완료되었습니다';
      })
      .addCase(deleteAccount.rejected, state => {
        state.accountDeletionResult = '문제가 발생했습니다. 다시 시도해주세요';
      });
  },
});

export const {
  setAccessToken,
  setRefreshToken,
  setTokens,
  setLastTimeAuthenticated,
  dropauthorizeError,
  dropLoginError,
  dropDeletionResult,
  dropUser,
} = userSlice.actions;

export const selectAccessToken = (state: RootState) =>
  state.user.tokens.accessToken;

export const selectRefreshToken = (state: RootState) =>
  state.user.tokens.refreshToken;

export const checkUserId = (state: RootState) => state.user.id;

export const checkUsername = (state: RootState) => state.user.username;

export const checkEmail = (state: RootState) => state.user.email;

export const checkUserStatus = (state: RootState) => state.user.status;

export const checkUserLoggedIn = (state: RootState) => state.user.loggedIn;

export const checkUserIsAuthorized = (state: RootState) =>
  state.user.authorized;

export const checkLastTimeAuthenticated = (state: RootState) =>
  state.user.lastTimeAuthenticated;

export const checkauthorizeError = (state: RootState) =>
  state.user.authorizeUserError;

export const checkLoginError = (state: RootState) => state.user.loginError;

export const checkAccountDeletionResult = (state: RootState) =>
  state.user.accountDeletionResult;

export default userSlice.reducer;

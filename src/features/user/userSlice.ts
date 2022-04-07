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
  accessToken: string;
  refreshToken: string;
}

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  id: number;
  email: string | null;
  username: string;
  active: boolean;
}

interface UserState {
  id: number | null;
  email: string | null;
  username: string | null;
  tokens: Tokens;
  loggedIn: boolean | null;
  active: boolean;
  lastTimeAuthenticated: number | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  loginError: string | null;
  initializeError: string | null;
  activateUserError: string | null;
}

const initialState: UserState = {
  id: null,
  email: null,
  username: null,
  tokens: {accessToken: '', refreshToken: ''},
  loggedIn: null,
  active: false,
  lastTimeAuthenticated: null,
  status: 'idle',
  loginError: null,
  initializeError: null,
  activateUserError: null,
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
      const user = await Api.get('user/info', {
        headers: {Authorization: 'Bearer ' + accessToken},
      });

      if (user) {
        console.log('fetced user data: ', user.data);
        return {
          tokens: JSON.parse(tokens),
          lastTimeAuthenticated: Number.parseInt(lastTimeAuthenticated, 10),
          active: user.data.active,
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
      tokens: {accessToken: '', refreshToken: ''},
      id: 0,
      active: false,
      email: '',
      username: '',
      lastTimeAuthenticated: 0,
      statusCode: 0,
    };

    await axios
      .post(API_URL + 'auth/login', {
        email,
        password,
      })
      .then(async (response: AxiosResponse<LoginResult>) => {
        const tokens = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        } as Tokens;
        const id = response.data.id;
        const active = response.data.active;
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
        result.active = active;
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
  await axios
    .delete(API_URL + 'auth/token', {
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
  const result = await axios.patch(API_URL + 'auth/token', null, {
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

export const activateUser = createAsyncThunk(
  'user/activateUser',
  async (authCode: string) => {
    const tokens = await SecureStore.getItemAsync('tokens');
    if (!tokens) {
      return null;
    }
    const {accessToken} = JSON.parse(tokens);
    const result = await Api.post(
      'auth/activate-user',
      {authCode},
      {headers: {Authorization: 'Bearer ' + accessToken}},
    );
    if (result.status === 200) {
      return 200;
    } else if (result.status === 403) {
      return 403;
    }
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
    dropActivateError: state => {
      state.activateUserError = null;
    },
    dropLoginError: state => {
      state.loginError = null;
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
          state.tokens = action.payload.tokens;
          state.lastTimeAuthenticated = action.payload.lastTimeAuthenticated;
          state.active = action.payload.active;
          state.initializeError = null;
          state.email = action.payload.email;
          state.username = action.payload.username;
          state.id = action.payload.id;
          state.loggedIn = true;
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
            state.active = action.payload.active;
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
              state.loginError = 'E-mail or password is invalid';
            } else {
              state.loginError = 'Unexpected error. Please try again';
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
      .addCase(activateUser.fulfilled, (state, action) => {
        if (action.payload) {
          if (action.payload === 200) {
            state.active = true;
            state.activateUserError = null;
          } else {
            state.activateUserError = 'Given code is not valid.';
          }
        }
      });
  },
});

export const {
  setAccessToken,
  setRefreshToken,
  setTokens,
  setLastTimeAuthenticated,
  dropActivateError,
  dropLoginError,
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

export const checkUserActive = (state: RootState) => state.user.active;

export const checkLastTimeAuthenticated = (state: RootState) =>
  state.user.lastTimeAuthenticated;

export const checkActivateError = (state: RootState) =>
  state.user.activateUserError;

export const checkLoginError = (state: RootState) => state.user.loginError;

export default userSlice.reducer;

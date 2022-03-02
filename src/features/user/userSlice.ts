import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../redux/store';
import SecureStore from 'expo-secure-store';

// const setToken = async (accessToken: string, refreshToken: string) => {
//   SecureStore.setItemAsync('accessToken', accessToken);
//   SecureStore.setItemAsync('refreshToken', refreshToken);
//   SecureStore.setItemAsync(
//     'lastLoginTime',
//     new Date(Date.now()).getTime().toString(),
//   );
// };

// export const getToken = async () => {
//   const now = new Date(Date.now()).getTime();
//   const timeAllowed = 1000 * 60 * 30;
//   const lastLoginTime = await SecureStore.getItemAsync('lastLoginTime');
//   const timeSinceLastLogin = now - Number.parseInt(lastLoginTime!);
//   if (timeSinceLastLogin < timeAllowed) {
//     return await SecureStore.getItemAsync('accessToken');
//   }
// };

// const deleteToken = async () => {
//   await SecureStore.deleteItemAsync('token');
//   await SecureStore.deleteItemAsync('lastLoginTime');
// };
interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface UserState {
  tokens: Tokens;
  loggedIn: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  tokens: {accessToken: '', refreshToken: ''},
  loggedIn: false,
  status: 'idle',
  error: null,
};

export const initializeUser = createAsyncThunk(
  'user/initializeUser',
  async () => {
    const tokens = await SecureStore.getItemAsync('tokens');
    return tokens ? JSON.parse(tokens) : null;
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
    setTokens: (state, action: PayloadAction<UserState>) => {
      state = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(initializeUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(initializeUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.tokens = action.payload;
          state.loggedIn = true;
        }
      })
      .addCase(initializeUser.rejected, (state, action) => {
        state.status = 'failed';
        if (action.error.message !== undefined) {
          state.error = action.error.message;
        }
      });
  },
});

export const {setAccessToken, setRefreshToken} = userSlice.actions;

export const selectAccessToken = (state: RootState) =>
  state.user.tokens.accessToken;

export const selectRefreshToken = (state: RootState) =>
  state.user.tokens.refreshToken;

export const checkUserStatus = (state: RootState) => state.user.status;

export const checkUserLoggedIn = (state: RootState) => state.user.loggedIn;

export default userSlice.reducer;

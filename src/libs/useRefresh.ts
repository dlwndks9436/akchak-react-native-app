import axios, {AxiosRequestConfig} from 'axios';
import * as SecureStore from 'expo-secure-store';
import {
  logout,
  setLastTimeAuthenticated,
  setTokens,
  Tokens,
} from '../features/user/userSlice';
import store from '../redux/store';
import {API_URL} from '../utils/constants';

const refresh = async (
  config: AxiosRequestConfig,
): Promise<AxiosRequestConfig> => {
  const lastTimeAuthenticated = await SecureStore.getItemAsync(
    'lastTimeAuthenticated',
  );
  if (lastTimeAuthenticated) {
    console.log('access token 체크');

    const now = new Date(Date.now()).getTime();

    const timeSince = now - Number.parseInt(lastTimeAuthenticated, 10);

    const timeAllowed = 1000 * 60 * 60 * 3;
    if (timeSince > timeAllowed) {
      console.log('하지만 access token이 만료됨');
      const tokensStr = await SecureStore.getItemAsync('tokens');
      if (tokensStr) {
        const {refreshToken} = JSON.parse(tokensStr);
        const result = await axios.patch(API_URL + 'player/token', null, {
          headers: {Authorization: 'Bearer ' + refreshToken},
        });
        if (result.status === 200) {
          const newTokens = result.data as Tokens;
          SecureStore.setItemAsync('tokens', JSON.stringify(newTokens));
          SecureStore.setItemAsync('lastTimeAuthenticated', now.toString());
          store.dispatch(setTokens(newTokens));
          store.dispatch(setLastTimeAuthenticated(now));
          config.headers!['Authorization'] = `Bearer ${newTokens.accessToken}`;
          console.log('새로운 access token 발급됨');
        }
      }
    } else {
      console.log('access token 유효함');
    }
  }

  return config;
};

const backToLogin = async () => {
  console.log(
    'error occured during user authentication. Stored access token might have problem',
  );

  store.dispatch(logout());
};

export {refresh, backToLogin};

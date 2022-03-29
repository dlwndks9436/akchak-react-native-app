import axios from 'axios';
import {API_URL} from '../utils/constants';
import {refresh, backToLogin} from './useRefresh';

const Api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  params: {},
});

Api.interceptors.request.use(refresh, backToLogin);

export default Api;

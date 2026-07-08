// import axios from 'axios';
// import baseUrl from '../../cosntants.js';
// console.log("1",baseUrl);

// const axiosInstance = axios.create();

// axiosInstance.defaults.baseURL = baseUrl;
// axiosInstance.defaults.withCredentials = true;

// export default axiosInstance;

import axios from 'axios';
import baseUrl from '../../Cosntants.js';
import * as Keychain from 'react-native-keychain';

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async config => {

  const credentials = await Keychain.getGenericPassword();

  if (credentials) {
    const {accessToken} = JSON.parse(credentials.password);

    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.request.use(
  config => {
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  response => {
    console.log('Response received:', response);
    return response;
  },
  error => {
    console.error('Response error:', error.response || error.message);
    return Promise.reject(error);
  },
);

export default axiosInstance;

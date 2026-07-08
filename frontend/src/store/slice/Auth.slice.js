import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/AxiosInstance.js';

const initialState = {
  loading: false,
  status: 'loading',
  userData: null,
  requestedUserData: null,
};
import * as Keychain from 'react-native-keychain';
import Toast from 'react-native-toast-message';

export const userLogin = createAsyncThunk('userLogin', async data => {
  try {
    const response = await axiosInstance.post('/user/userLogin', data);
    const {accessToken, refreshToken} = response.data.data;
    await Keychain.setGenericPassword(
      'token',
      JSON.stringify({
        accessToken,
        refreshToken,
      }),
    );
    return response.data.data;
  } catch (error) {
    Toast.show({
      type: 'customNotificationError',
      text1: error.response?.data?.message || 'Login failed',
      visibilityTime: 1000,
    });
    throw error;
  }
});

export const registerUser = createAsyncThunk('registerUser', async data => {
  try {
    const response = await axiosInstance.post('/user/registerUser', data);
    return response.data.data;
  } catch (error) {
    throw error;
  }
});

export const getUInfo = createAsyncThunk('getUInfo', async data => {
  try {
    const response = await axiosInstance.post('/user/getUInfo', {id: data});
    return response.data.data;
  } catch (error) {
    throw error;
  }
});

export const getCurrUInfo = createAsyncThunk('getCurrUInfo', async () => {
  try {
    const response = await axiosInstance.get('/user/getCurrUInfo');
    return response.data.data;
  } catch (error) {
    throw error;
  }
});

export const logoutUser = createAsyncThunk('logoutUser', async () => {
  try {
    const response = await axiosInstance.post('/user/logout');
    await Keychain.resetGenericPassword();
    return response.data.data;
  } catch (error) {
    throw error;
  }
});

export const forgetPass = createAsyncThunk('forgetPass', async data => {
  try {
    const response = await axiosInstance.post('/user/forgetPassword', data);
    return response.data.data;
  } catch (error) {
    throw error;
  }
});

export const createCustomer = createAsyncThunk('createCustomer', async data => {
  try {
    const response = await axiosInstance.post('/user/createCustomer', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
});

export const initializeAuth = createAsyncThunk(
  'initializeAuth',
  async (_, {dispatch}) => {
    const credentials = await Keychain.getGenericPassword();

    if (!credentials) {
      throw new Error('No Token');
    }

    const {refreshToken} = JSON.parse(credentials.password);

    const response = await axiosInstance.post('/user/refreshToken', {
      refreshToken,
    });

    const {accessToken} = response.data.data;

    await Keychain.setGenericPassword(
      'token',
      JSON.stringify({
        accessToken,
        refreshToken,
      }),
    );

    await dispatch(getCurrUInfo());

    return true;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(userLogin.pending, state => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'authenticated';
        state.userData = action.payload.user;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.status = 'unauthenticated';
        state.userData = null;
      })
      .addCase(initializeAuth.pending, state => {
        state.status = 'loading';
      })
      .addCase(initializeAuth.fulfilled, state => {
        state.status = 'authenticated';
      })
      .addCase(initializeAuth.rejected, state => {
        state.status = 'unauthenticated';
      })
      .addCase(registerUser.pending, state => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getUInfo.pending, state => {
        state.loading = true;
      })
      .addCase(getUInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.requestedUserData = action.payload;
      })
      .addCase(getUInfo.rejected, (state, action) => {
        state.loading = false;
        state.requestedUserData = null;
      })
      .addCase(getCurrUInfo.pending, state => {
        state.loading = true;
      })
      .addCase(getCurrUInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'authenticated';
        state.userData = action.payload;
      })
      .addCase(getCurrUInfo.rejected, (state, action) => {
        state.loading = false;
        state.status = 'unauthenticated';
        state.userData = null;
      })
      .addCase(logoutUser.pending, state => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'unauthenticated';
        state.userData = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.status = 'unauthenticated';
        state.userData = null;
      })
      .addCase(forgetPass.pending, state => {
        state.loading = true;
      })
      .addCase(forgetPass.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(forgetPass.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(createCustomer.pending, state => {
        state.loading = true;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
export default authSlice.reducer;

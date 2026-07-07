import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/AxiosInstance.js';

const initialState = {
  loading: false,
  status: false,
  userData: null,
};

export const userLogin = createAsyncThunk('login', async ({Mobileno, pwd}) => {
  try {
    const response = await axiosInstance.get(
      `/Getlogin?Mobileno=${Mobileno}&pwd=${pwd}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
});
export const userLogout = createAsyncThunk('logout', async ({EmpId}) => {
  try {
    const response = await axiosInstance.get(`/Getlogout?EmpId=${EmpId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const changePassword = createAsyncThunk(
  'changePassword',
  async ({id, newPwd}) => {
    try {
      const response = await axiosInstance.get(
        `/UpdateEmpPwd?EmpId=${id}&pwd=${newPwd}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(userLogin.pending, state => {
      state.loading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      if (action.payload?.Status === 'Invalid User') {
        state.status = false;
        state.loading = false;
        state.userData = action.payload;
      } else if (action.payload?.LoginStatus === '1') {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
      } else if (action.payload?.LoginStatus === '0') {
        state.status = false;
        state.loading = false;
        state.userData = action.payload;
      }
    });
    builder.addCase(userLogin.rejected, state => {
      state.loading = false;
    });
    builder.addCase(userLogout.pending, state => {
      state.loading = true;
    });
    builder.addCase(userLogout.fulfilled, state => {
      state.loading = false;
      state.status = false;
      state.userData = null;
    });
    builder.addCase(userLogout.rejected, state => {
      state.loading = false;
    });
  },
});
export default authSlice.reducer;

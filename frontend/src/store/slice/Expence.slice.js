import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/AxiosInstance.js';

const initialState = {
  suceess: false,
};

export const getAllExpenceType = createAsyncThunk(
  'getAllExpenceType',
  async () => {
    try {
      const response = await axiosInstance.get(`GetExpList`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const setExpense = createAsyncThunk(
  'setExpence',
  async ({ExpDate, EmpId, ExpId, Remark, Amt}) => {
    try {
      const response = await axiosInstance.get(
        `/AddExpence?ExpDate=${ExpDate}&EmpId=${EmpId}&ExpId=${ExpId}&Remark=${Remark}&Amount=${Amt}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

const expenceSlice = createSlice({
  name: 'expnc',
  initialState,
  reducers: {},
  //   extraReducers:
  //   builder => {
  //     builder.addCase(getAllTask.pending, state => {
  //       state.suceess = false;
  //     });
  //     builder.addCase(getAllTask.fulfilled, state => {
  //       state.suceess = true;
  //     });
  //   },
});
export default expenceSlice.reducer;

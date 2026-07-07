import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/AxiosInstance.js';

const initialState = {
  suceess: false,
};

export const getAllTask = createAsyncThunk(
  'tasks',
  async ({EmpId, FromDate, ToDate, TaskType = 0}) => {
    try {
      const response = await axiosInstance.get(
        `GetEmpTaskDetail?EmpId=${EmpId}&FromDate=${FromDate}&ToDate=${ToDate}&TaskType=${TaskType}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const completedTask = createAsyncThunk(
  'completedTask',
  async ({id, remark}) => {
    try {
      const response = await axiosInstance.get(
        `/UpdateDoneTask?TaskId=${id}&DoneRemark=${remark}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllTask.pending, state => {
      state.suceess = false;
    });
    builder.addCase(getAllTask.fulfilled, state => {
      state.suceess = true;
    });
  },
});
export default taskSlice.reducer;

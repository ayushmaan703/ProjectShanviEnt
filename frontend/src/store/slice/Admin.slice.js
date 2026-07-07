import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/AxiosInstance.js';

const initialState = {
  suceess: false,
  list: [],
  cashBankList: [],
};

export const getAllEmployeeList = createAsyncThunk(
  'getAllEmployeeList',
  async () => {
    try {
      const response = await axiosInstance.get(`GetEmployeeList`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const assignTask = createAsyncThunk(
  'assignTask',
  async ({ExpDate, task, TaskDescp, EmpId, AdminId }) => {
    try {
      const response = await axiosInstance.get(
        `/AddTask?ExpDate=${ExpDate}&task=${task}&TaskDescp=${TaskDescp}&EmpId=${EmpId}&AdminId=${AdminId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const seeEmployeeExpences = createAsyncThunk(
  'seeEmployeeExpences',
  async ({ToDate, EmpId, FromDate, Paytype = 3}) => {
    try {
      const response = await axiosInstance.get(
        `/GetExpenceList?EmpId=${EmpId}&FromDate=${FromDate}&ToDate=${ToDate}&Paytype=${Paytype}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const seeEmpCompletedTask = createAsyncThunk(
  'seeEmpCompletedTask',
  async ({EmpId, FromDate, ToDate, TaskType = 2}) => {
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

export const EmpWiseLedger = createAsyncThunk(
  'EmpWiseLedger',
  async ({EmpId, FromDate, ToDate}) => {
    try {
      const response = await axiosInstance.get(
        `EmpwiseLedger?EmpId=${EmpId}&FromDate=${FromDate}&ToDate=${ToDate}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const EmpWiseLedgerSummary = createAsyncThunk(
  'EmpWiseLedgerSummary',
  async ({EmpId, FromDate, ToDate}) => {
    try {
      const response = await axiosInstance.get(
        `EmpwiseLedger_Summary?EmpId=${EmpId}&FromDate=${FromDate}&ToDate=${ToDate}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const approveExpense = createAsyncThunk(
  'approveExpense',
  async ({EmpId, CashBankId}) => {
    try {
      console.log({EmpId, CashBankId});

      const response = await axiosInstance.get(
        `ExpenceApprove?id=${EmpId}&CashBankId=${CashBankId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const CashBankList = createAsyncThunk('CashBankList', async () => {
  try {
    const response = await axiosInstance.get('GetCashBankList');
    return response.data;
  } catch (error) {
    throw error;
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllEmployeeList.pending, state => {
      state.suceess = false;
    });
    builder.addCase(getAllEmployeeList.fulfilled, (state, action) => {
      state.suceess = true;
      state.list = action.payload;
    });
    builder.addCase(CashBankList.pending, state => {
      state.suceess = false;
    });
    builder.addCase(CashBankList.fulfilled, (state, action) => {
      state.suceess = true;
      state.cashBankList = action.payload;
    });
  },
});
export default adminSlice.reducer;

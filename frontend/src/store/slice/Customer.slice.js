import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/AxiosInstance.js';
import Toast from 'react-native-toast-message';

const initialState = {
  loading: false,
  status: false,
  customerList: null,
};

export const getAllCustomers = createAsyncThunk('getAllCustomers', async () => {
  try {
    const response = await axiosInstance.get('/customer/getCustomerList');
    return response.data.data;
  } catch (error) {
    throw error;
  }
});

export const deleteCustomer = createAsyncThunk(
  'deleteCustomer',
  async customerId => {
    try {
      const response = await axiosInstance.delete('/customer/deleteCustomer', {
        data: customerId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const editCustomer = createAsyncThunk(
  'editCustomer',
  async ({data, customerId}) => {
    try {
      const response = await axiosInstance.delete(
        '/customer/editCustomer',
        data,
        {
          params: {customerId},
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const togglePaidStatus = createAsyncThunk(
  'togglePaidStatus',
  async customerId => {
    console.log(customerId);
    
    try {
      const response = await axiosInstance.patch('/customer/togglePaidStatus', {
        params: {customerId},
      });
      return response.data;
    } catch (error) {
      console.log(error);
      
      Toast.show({
        type: 'customNotificationError',
        text1: error?.data||'Error Occured',
        visibilityTime: 1000,
      });
      throw error;
    }
  },
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllCustomers.pending, state => {
        state.loading = true;
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customerList = action.payload;
      })
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.customerList = null;
      })
      .addCase(deleteCustomer.pending, state => {
        state.loading = true;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerList = state.customerList.filter(
          customer => customer._id !== action.meta.arg,
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(editCustomer.pending, state => {
        state.loading = true;
      })
      .addCase(editCustomer.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(editCustomer.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(togglePaidStatus.pending, state => {
        state.loading = true;
      })
      .addCase(togglePaidStatus.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(togglePaidStatus.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
export default customerSlice.reducer;

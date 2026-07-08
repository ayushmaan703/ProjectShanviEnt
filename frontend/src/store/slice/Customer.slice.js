import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/AxiosInstance.js';

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
        state.status = true;
        state.customerList = action.payload;
      })
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.status = false;
        state.customerList = null;
      })
      .addCase(deleteCustomer.pending, state => {
        state.loading = true;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.customerList = state.customerList.filter(
          customer => customer._id !== action.meta.arg,
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.status = false;
      });
  },
});
export default customerSlice.reducer;

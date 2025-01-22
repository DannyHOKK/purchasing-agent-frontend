import { createSlice } from "@reduxjs/toolkit";
import {
  checkCustomerExist,
  createCustomer,
  deleteCustomer,
  getAllCustomer,
  modifyCustomer,
} from "./customerAction";

const initialState = {
  customerLoading: false,
  customerError: null,
  customerSuccess: false,
  customerData: [],
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCustomer.pending, (state) => {
        state.customerLoading = true;
        state.customerError = null;
      })
      .addCase(getAllCustomer.fulfilled, (state, { payload }) => {
        state.customerLoading = false;
        state.customerSuccess = true;
        state.customerData = payload.data;
      })
      .addCase(getAllCustomer.rejected, (state, { payload }) => {
        state.customerLoading = false;
        state.customerError = payload;
      })
      .addCase(createCustomer.pending, (state) => {
        state.customerLoading = true;
        state.customerError = null;
      })
      .addCase(createCustomer.fulfilled, (state, { payload }) => {
        state.customerLoading = false;
        state.customerSuccess = true;
      })
      .addCase(createCustomer.rejected, (state, { payload }) => {
        state.customerLoading = false;
        state.customerError = payload;
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.customerLoading = true;
        state.customerError = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, { payload }) => {
        state.customerLoading = false;
        state.customerSuccess = true;
      })
      .addCase(deleteCustomer.rejected, (state, { payload }) => {
        state.customerLoading = false;
        state.customerError = payload;
      })
      .addCase(modifyCustomer.pending, (state) => {
        state.customerLoading = true;
        state.customerError = null;
      })
      .addCase(modifyCustomer.fulfilled, (state, { payload }) => {
        state.customerLoading = false;
        state.customerSuccess = true;
      })
      .addCase(modifyCustomer.rejected, (state, { payload }) => {
        state.customerLoading = false;
        state.customerError = payload;
      })
      .addCase(checkCustomerExist.pending, (state) => {
        state.customerLoading = true;
        state.customerError = null;
      })
      .addCase(checkCustomerExist.fulfilled, (state, { payload }) => {
        state.customerLoading = false;
        state.customerSuccess = true;
      })
      .addCase(checkCustomerExist.rejected, (state, { payload }) => {
        state.customerLoading = false;
        state.customerError = payload;
      });
  },
});

export default customerSlice.reducer;

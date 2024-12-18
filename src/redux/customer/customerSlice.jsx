import { createSlice } from "@reduxjs/toolkit";
import { createCustomer, getAllCustomer } from "./customerAction";

const initialState = {
  customerLoading: false,
  customerError: null,
  customerSuccess: false,
  allCustomer: [],
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
        state.allCustomer = payload.data;
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
      });
  },
});

export default customerSlice.reducer;

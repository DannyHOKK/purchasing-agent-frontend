import { createSlice } from "@reduxjs/toolkit";
import { createCustomer, getAllCustomer } from "./customerAction";

const initialState = {
  allCusomterLoading: false,
  allCustomerError: null,
  allCustomerSuccess: false,
  allCustomer: [],
  createCustomerLoading: false,
  createCustomerError: null,
  createCustomerSuccess: false,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCustomer.pending, (state) => {
        state.allCusomterLoading = true;
        state.allCustomerError = null;
      })
      .addCase(getAllCustomer.fulfilled, (state, { payload }) => {
        state.allCusomterLoading = false;
        state.allCustomerSuccess = true;
        state.allCustomer = payload.data;
      })
      .addCase(getAllCustomer.rejected, (state, { payload }) => {
        state.allCusomterLoading = false;
        state.allCustomerError = payload;
      });
    // .addCase(createCustomer.pending, (state) => {
    //   state.createCustomerLoading = true;
    //   state.createCustomerError = null;
    // })
    // .addCase(createCustomer.fulfilled, (state, { payload }) => {
    //   state.createCustomerLoading = false;
    //   state.createCustomerSuccess = true;
    // })
    // .addCase(createCustomer.rejected, (state, { payload }) => {
    //   state.createCustomerLoading = false;
    //   state.createCustomerError = payload;
    // });
  },
});

export default customerSlice.reducer;

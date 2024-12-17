import { createSlice } from "@reduxjs/toolkit";
import { getAllCustomer } from "./customerAction";

const initialState = {
  allCusomterLoading: false,
  allCustomerError: null,
  allCustomerSuccess: false,
  allCustomer: [],
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
  },
});

export default customerSlice.reducer;

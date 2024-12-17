import { createSlice } from "@reduxjs/toolkit";
import { getAllOrders } from "./orderAction";

const initialState = {
  orderLoading: false,
  orderError: null,
  orderSuccess: false,
  orderData: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(getAllOrders.fulfilled, (state, { payload }) => {
        state.orderLoading = false;
        state.orderSuccess = true;
        state.orderData = payload.data;
      })
      .addCase(getAllOrders.rejected, (state, { payload }) => {
        state.orderLoading = false;
        state.orderError = payload;
      });
  },
});

export default orderSlice.reducer;

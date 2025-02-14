import { createSlice } from "@reduxjs/toolkit";
import {
  changePaidOrder,
  changePaymentMethod,
  changeStatusOrder,
  changeTakeMethodOrder,
  createOrder,
  deleteOrderById,
  getAllOrders,
  getPackageName,
  modifyOrder,
} from "./orderAction";

const initialState = {
  orderLoading: false,
  orderError: null,
  orderSuccess: false,
  orderData: [],
  orderPackageName: [],
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
      })
      .addCase(createOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.orderLoading = false;
        state.orderSuccess = true;
      })
      .addCase(createOrder.rejected, (state, { payload }) => {
        state.orderLoading = false;
        state.orderError = payload;
      })
      .addCase(deleteOrderById.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(deleteOrderById.fulfilled, (state, { payload }) => {
        state.orderLoading = false;
        state.orderSuccess = true;
      })
      .addCase(deleteOrderById.rejected, (state, { payload }) => {
        state.orderLoading = false;
        state.orderError = payload;
      })
      .addCase(changeStatusOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(changeStatusOrder.fulfilled, (state, { payload }) => {
        state.orderLoading = false;
        state.orderSuccess = true;
      })
      .addCase(changeStatusOrder.rejected, (state, { payload }) => {
        state.orderLoading = false;
        state.orderError = payload;
      })
      .addCase(modifyOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(modifyOrder.fulfilled, (state, { payload }) => {
        state.orderLoading = false;
        state.orderSuccess = true;
      })
      .addCase(modifyOrder.rejected, (state, { payload }) => {
        state.orderLoading = false;
        state.orderError = payload;
      })
      .addCase(changePaidOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(changePaidOrder.fulfilled, (state, { payload }) => {
        state.orderLoading = false;
        state.orderSuccess = true;
      })
      .addCase(changePaidOrder.rejected, (state, { payload }) => {
        state.orderLoading = false;
        state.orderError = payload;
      })
      .addCase(changeTakeMethodOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(changeTakeMethodOrder.fulfilled, (state, { payload }) => {
        state.orderLoading = false;
        state.orderSuccess = true;
      })
      .addCase(changeTakeMethodOrder.rejected, (state, { payload }) => {
        state.orderLoading = false;
        state.orderError = payload;
      })
      .addCase(changePaymentMethod.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(changePaymentMethod.fulfilled, (state, { payload }) => {
        state.orderLoading = false;
        state.orderSuccess = true;
      })
      .addCase(changePaymentMethod.rejected, (state, { payload }) => {
        state.orderLoading = false;
        state.orderError = payload;
      })
      .addCase(getPackageName.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(getPackageName.fulfilled, (state, { payload }) => {
        state.orderLoading = false;
        state.orderSuccess = true;
        state.orderPackageName = payload.data;
      });
  },
});

export default orderSlice.reducer;

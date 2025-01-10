import { createSlice } from "@reduxjs/toolkit";
import {
  createConsumption,
  deleteExpense,
  getAllExpense,
  modifyConsumption,
} from "./expenseAction";

const initialState = {
  expenseLoading: false,
  expenseError: null,
  expenseSuccess: false,
  expenseData: [],
};

const orderSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllExpense.pending, (state) => {
        state.expenseLoading = true;
        state.expenseError = null;
      })
      .addCase(getAllExpense.fulfilled, (state, { payload }) => {
        state.expenseLoading = false;
        state.expenseSuccess = true;
        state.expenseData = payload.data;
      })
      .addCase(getAllExpense.rejected, (state, { payload }) => {
        state.expenseLoading = false;
        state.expenseError = payload;
      })
      .addCase(createConsumption.pending, (state) => {
        state.expenseLoading = true;
        state.expenseError = null;
      })
      .addCase(createConsumption.fulfilled, (state, { payload }) => {
        state.expenseLoading = false;
        state.expenseSuccess = true;
        state.expenseData = payload.data;
      })
      .addCase(createConsumption.rejected, (state, { payload }) => {
        state.expenseLoading = false;
        state.expenseError = payload;
      })
      .addCase(modifyConsumption.pending, (state) => {
        state.expenseLoading = true;
        state.expenseError = null;
      })
      .addCase(modifyConsumption.fulfilled, (state, { payload }) => {
        state.expenseLoading = false;
        state.expenseSuccess = true;
        state.expenseData = payload.data;
      })
      .addCase(modifyConsumption.rejected, (state, { payload }) => {
        state.expenseLoading = false;
        state.expenseError = payload;
      })
      .addCase(deleteExpense.pending, (state) => {
        state.expenseLoading = true;
        state.expenseError = null;
      })
      .addCase(deleteExpense.fulfilled, (state, { payload }) => {
        state.expenseLoading = false;
        state.expenseSuccess = true;
        state.expenseData = payload.data;
      })
      .addCase(deleteExpense.rejected, (state, { payload }) => {
        state.expenseLoading = false;
        state.expenseError = payload;
      });
  },
});

export default orderSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { getAllExpense } from "./expenseAction";

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
      // .addCase(getAllExpense.pending, (state) => {
      //   state.expenseLoading = true;
      //   state.expenseError = null;
      // })
      .addCase(getAllExpense.fulfilled, (state, { payload }) => {
        // state.expenseLoading = false;
        // state.expenseSuccess = true;
        state.expenseData = payload.data;
      });
    // .addCase(getAllExpense.rejected, (state, { payload }) => {
    //   state.expenseLoading = false;
    //   state.expenseError = payload;
    // });
  },
});

export default orderSlice.reducer;

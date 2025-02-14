import { createSlice } from "@reduxjs/toolkit";
import { getAllProductStock } from "./productStockAction";

const initialState = {
  productStockLoading: false,
  productStockError: null,
  productStockSuccess: false,
  productStockData: [],
};

const productStockSlice = createSlice({
  name: "productStock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProductStock.fulfilled, (state, { payload }) => {
      // state.expenseLoading = false;
      // state.expenseSuccess = true;
      state.productStockData = payload.data;
    });
  },
});

export default productStockSlice.reducer;

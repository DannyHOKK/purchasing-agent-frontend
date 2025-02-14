import { createSlice } from "@reduxjs/toolkit";
import { createCurrency, getExchangeRate } from "./exchangeRateAction";

const initialState = {
  exchangeRateLoading: false,
  exchangeRateError: null,
  exchangeRateSuccess: false,
  exchangeRateData: [],
};

const exchangeRateSlice = createSlice({
  name: "exchangeRate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExchangeRate.pending, (state) => {
        state.exchangeRateLoading = true;
        state.exchangeRateError = null;
      })
      .addCase(getExchangeRate.fulfilled, (state, { payload }) => {
        state.exchangeRateLoading = false;
        state.exchangeRateSuccess = true;
        state.exchangeRateData = payload.data;
      })
      .addCase(getExchangeRate.rejected, (state, { payload }) => {
        state.exchangeRateLoading = false;
        state.exchangeRateError = payload;
      });
  },
});

export default exchangeRateSlice.reducer;

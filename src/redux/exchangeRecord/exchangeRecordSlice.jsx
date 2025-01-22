import { createSlice } from "@reduxjs/toolkit";
import {
  createExchangeRecord,
  getAllExchangeRecord,
} from "./exchangeRecordAction";

const initialState = {
  exchangeRecordLoading: false,
  exchangeRecordError: null,
  exchangeRecordSuccess: false,
  exchangeRecordData: [],
};

const exchangeRecordSlice = createSlice({
  name: "exchangeRecord",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createExchangeRecord.pending, (state) => {
        state.exchangeRecordLoading = true;
        state.exchangeRecordError = null;
      })
      .addCase(createExchangeRecord.fulfilled, (state, { payload }) => {
        state.exchangeRecordLoading = false;
        state.exchangeRecordSuccess = true;
      })
      .addCase(createExchangeRecord.rejected, (state, { payload }) => {
        state.exchangeRecordLoading = false;
        state.exchangeRecordError = payload;
      })
      .addCase(getAllExchangeRecord.pending, (state) => {
        state.exchangeRecordLoading = true;
        state.exchangeRecordError = null;
      })
      .addCase(getAllExchangeRecord.fulfilled, (state, { payload }) => {
        state.exchangeRecordLoading = false;
        state.exchangeRecordSuccess = true;
        state.exchangeRecordData = payload.data;
      })
      .addCase(getAllExchangeRecord.rejected, (state, { payload }) => {
        state.exchangeRecordLoading = false;
        state.exchangeRecordError = payload;
      });
  },
});

export default exchangeRecordSlice.reducer;

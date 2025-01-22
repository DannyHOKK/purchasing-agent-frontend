import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const backendURL = import.meta.env.VITE_APP_API_URL;

export const createExchangeRecord = createAsyncThunk(
  "api/exchangeRecord/createExchangeRecord",
  async (exchangeRecordDTO, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/exchangeRecord/createExchangeRecord`,
        exchangeRecordDTO
      );

      if (response.data.code === -1) {
        return rejectWithValue(response.data.msg);
      }
      return response.data;
    } catch (error) {
      // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getAllExchangeRecord = createAsyncThunk(
  "api/exchangeRecord/getAllExchangeRecord",
  async (empty, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendURL}/api/exchangeRecord/getAllExchangeRecord`,
        ""
      );

      if (response.data.code === -1) {
        return rejectWithValue(response.data.msg);
      }
      return response.data;
    } catch (error) {
      // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteExchangeRecord = createAsyncThunk(
  "api/exchangeRecord/deleteExchangeRecord",
  async (exchangeId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${backendURL}/api/exchangeRecord/deleteExchangeRecord/${exchangeId}`
      );

      if (response.data.code === -1) {
        return rejectWithValue(response.data.msg);
      }
      return response.data;
    } catch (error) {
      // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const backendURL = import.meta.env.VITE_APP_API_URL;

export const createCurrency = createAsyncThunk(
  "api/exchangeRate/createCurrency",
  async (exchangeRateDTO, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/exchangeRate/createCurrency`,
        exchangeRateDTO
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

export const getExchangeRate = createAsyncThunk(
  "api/exchangeRate/getExchangeRate",
  async (empty, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendURL}/api/exchangeRate/getExchangeRate`,
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

import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const backendURL = import.meta.env.VITE_APP_API_URL;

export const getAllOrders = createAsyncThunk(
  "api/order/getAllOrders",
  async (empty, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendURL}/api/order/getAllOrders`,
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

export const createOrder = createAsyncThunk(
  "api/order/createOrder",
  async (ordersDTO, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/order/createOrder`,
        ordersDTO
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

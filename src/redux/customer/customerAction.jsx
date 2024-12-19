import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const backendURL = import.meta.env.VITE_APP_API_URL;

export const getAllCustomer = createAsyncThunk(
  "api/customer/getAllCustomer",
  async (empty, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendURL}/api/customer/getAllCustomer`,
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

export const createCustomer = createAsyncThunk(
  "api/customer/createCustomer",
  async (customerDTO, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/customer/createCustomer`,
        customerDTO
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

export const deleteCustomer = createAsyncThunk(
  "api/customer/deleteCustomer",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${backendURL}/api/customer/deleteCustomer/${customerId}`
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

export const modifyCustomer = createAsyncThunk(
  "api/customer/modifyCustomer",
  async (customerDTO, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/customer/modifyCustomer`,
        customerDTO
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

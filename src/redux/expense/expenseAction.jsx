import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const backendURL = import.meta.env.VITE_APP_API_URL;

export const getAllExpense = createAsyncThunk(
  "api/consumption/getAllExpense",
  async (empty, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendURL}/api/consumption/getAllExpense`,
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

export const createConsumption = createAsyncThunk(
  "api/consumption/createConsumption",
  async (expenseDTO, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/consumption/createConsumption`,
        expenseDTO
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

export const modifyConsumption = createAsyncThunk(
  "api/consumption/modifyConsumption",
  async (expenseDTO, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/consumption/modifyConsumption`,
        expenseDTO
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

export const deleteExpense = createAsyncThunk(
  "api/consumption/deleteExpense",
  async (expenseId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${backendURL}/api/consumption/deleteExpense/${expenseId}`
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

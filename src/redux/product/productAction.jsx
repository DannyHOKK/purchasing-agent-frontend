import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const backendURL = import.meta.env.VITE_APP_API_URL;

export const getAllProduct = createAsyncThunk(
  "api/product/getAllProduct",
  async (empty, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendURL}/api/product/getAllProduct`,
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

export const createProduct = createAsyncThunk(
  "api/product/createProduct",
  async (productDTO, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/product/createProduct`,
        productDTO
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

export const deleteProductById = createAsyncThunk(
  "api/product/deleteProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${backendURL}/api/product/deleteProductById/${productId}`
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

export const modifyProduct = createAsyncThunk(
  "api/product/modifyProduct",
  async (productDTO, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/product/modifyProduct`,
        productDTO
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

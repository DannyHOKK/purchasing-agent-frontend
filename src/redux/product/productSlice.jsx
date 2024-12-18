import { createSlice } from "@reduxjs/toolkit";
import { createProduct, getAllProduct } from "./productAction";

const initialState = {
  productLoading: false,
  productError: null,
  productSuccess: false,
  productData: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProduct.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(getAllProduct.fulfilled, (state, { payload }) => {
        state.productLoading = false;
        state.productSuccess = true;
        state.productData = payload.data;
      })
      .addCase(getAllProduct.rejected, (state, { payload }) => {
        state.productLoading = false;
        state.productError = payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(createProduct.fulfilled, (state, { payload }) => {
        state.productLoading = false;
        state.productSuccess = true;
      })
      .addCase(createProduct.rejected, (state, { payload }) => {
        state.productLoading = false;
        state.productError = payload;
      });
  },
});

export default productSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { getAllProduct } from "./productAction";

const initialState = {
  allProductLoading: false,
  allProductError: null,
  allProductSuccess: false,
  allProduct: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProduct.pending, (state) => {
        state.allProductLoading = true;
        state.allProductError = null;
      })
      .addCase(getAllProduct.fulfilled, (state, { payload }) => {
        state.allProductLoading = false;
        state.allProductSuccess = true;
        state.allProduct = payload.data;
      })
      .addCase(getAllProduct.rejected, (state, { payload }) => {
        state.allProductLoading = false;
        state.allProductError = payload;
      });
  },
});

export default productSlice.reducer;

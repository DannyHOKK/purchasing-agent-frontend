import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "../redux/order/orderSlice";
import customerReducer from "../redux/customer/customerSlice";
import productReducer from "../redux/product/productSlice";
import exchangeRateReducer from "../redux/exchangeRate/exchangeRateSlice";

const store = configureStore({
  reducer: {
    order: orderReducer,
    customer: customerReducer,
    product: productReducer,
    exchangeRate: exchangeRateReducer,
  },
});

export default store;

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../redux/product/productAction";
import ProductDataTable from "./ProductDataTable";
import { getExchangeRate } from "../../redux/exchangeRate/exchangeRateAction";
import { getAllOrders } from "../../redux/order/orderAction";

const ProductCrud = () => {
  return (
    <div>
      <ProductDataTable />
    </div>
  );
};

export default ProductCrud;

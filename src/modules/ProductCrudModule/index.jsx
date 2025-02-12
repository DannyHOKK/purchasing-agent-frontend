import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../redux/product/productAction";
import ProductDataTable from "./ProductDataTable";
import { getExchangeRate } from "../../redux/exchangeRate/exchangeRateAction";
import { getAllOrders } from "../../redux/order/orderAction";

const ProductCrud = () => {
  const { productLoading, productData } = useSelector((state) => state.product);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProduct());
    dispatch(getExchangeRate());
    dispatch(getAllOrders());
  }, []);

  return (
    <div>
      <ProductDataTable
        productLoading={productLoading}
        productData={productData}
      />
    </div>
  );
};

export default ProductCrud;

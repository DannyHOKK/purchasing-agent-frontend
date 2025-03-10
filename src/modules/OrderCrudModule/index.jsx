import { Table } from "antd";
import React, { useEffect } from "react";
import OrderDataTable from "./OrderDataTable";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomer } from "../../redux/customer/customerAction";
import { getAllProduct } from "../../redux/product/productAction";
import { getAllOrders, getPackageName } from "../../redux/order/orderAction";
import { getExchangeRate } from "../../redux/exchangeRate/exchangeRateAction";

const OrderCrud = () => {
  const dispatch = useDispatch();

  const packageName = localStorage.getItem("packageName")
    ? localStorage.getItem("packageName")
    : "預設";

  useEffect(() => {
    dispatch(getAllCustomer());
    dispatch(getAllProduct());
    dispatch(getPackageName());
    dispatch(getExchangeRate());
    dispatch(getAllOrders(packageName));
  }, []);

  return (
    <div>
      <OrderDataTable />
    </div>
  );
};

export default OrderCrud;

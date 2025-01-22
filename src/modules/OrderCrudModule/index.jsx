import { Table } from "antd";
import React, { useEffect } from "react";
import OrderDataTable from "./OrderDataTable";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomer } from "../../redux/customer/customerAction";
import { getAllProduct } from "../../redux/product/productAction";

const OrderCrud = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCustomer());
    dispatch(getAllProduct());
  }, []);

  return (
    <div>
      <OrderDataTable />
    </div>
  );
};

export default OrderCrud;

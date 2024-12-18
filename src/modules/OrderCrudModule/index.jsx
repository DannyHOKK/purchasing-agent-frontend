import { Table } from "antd";
import React, { useEffect } from "react";
import OrderDataTable from "./OrderDataTable";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../redux/order/orderAction";
import { getAllCustomer } from "../../redux/customer/customerAction";
import { getAllProduct } from "../../redux/product/productAction";

const OrderCrud = () => {
  const { orderLoading, orderSuccess, orderData, orderError } = useSelector(
    (state) => state.order
  );
  const { allCustomer } = useSelector((state) => state.customer);
  const { productData } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getAllCustomer());
    dispatch(getAllProduct());
  }, []);

  return (
    <div>
      <OrderDataTable
        orderLoading={orderLoading}
        orderData={orderData}
        allCustomer={allCustomer}
        productData={productData}
      />
    </div>
  );
};

export default OrderCrud;

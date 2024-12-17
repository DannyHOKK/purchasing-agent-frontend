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

  const {
    allCustomerLoading,
    allCustomer,
    allCustomerSuccess,
    allCustomerError,
  } = useSelector((state) => state.customer);

  const { allProductLoading, allProductSuccess, allProduct, allProductError } =
    useSelector((state) => state.product);

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
        allProduct={allProduct}
      />
    </div>
  );
};

export default OrderCrud;

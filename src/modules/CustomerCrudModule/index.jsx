import { Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomer } from "../../redux/customer/customerAction";
import CustomerDataTable from "./CustomerDataTable";

const CustomerCrud = () => {
  const {
    allCustomerLoading,
    allCustomer,
    allCustomerSuccess,
    allCustomerError,
    createCustomerLoading,
  } = useSelector((state) => state.customer);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCustomer());
  }, []);

  return (
    <div>
      <CustomerDataTable
        customerLoading={allCustomerLoading}
        customerData={allCustomer}
      />
    </div>
  );
};

export default CustomerCrud;

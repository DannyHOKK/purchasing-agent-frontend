import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomer } from "../../redux/customer/customerAction";
import CustomerDataTable from "./CustomerDataTable";

const CustomerCrud = () => {
  const { customerLoading, allCustomer, customerSuccess, customerError } =
    useSelector((state) => state.customer);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCustomer());
  }, []);

  return (
    <div>
      <CustomerDataTable
        customerLoading={customerLoading}
        customerData={allCustomer}
      />
    </div>
  );
};

export default CustomerCrud;

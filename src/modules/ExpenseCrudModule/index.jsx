import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExchangeRate } from "../../redux/exchangeRate/exchangeRateAction";
import ExpenseForm from "./ExpenseForm";

const ExpenseCrud = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getExchangeRate());
  }, []);

  return (
    <>
      <div
        className="whiteBox shadow"
        style={{ color: "#595959", fontSize: 13 }}
      >
        <div className="p-4 container-sm">
          <ExpenseForm />
        </div>
      </div>

      <div className="space30"></div>

      <div
        className="whiteBox shadow"
        style={{ color: "#595959", fontSize: 13 }}
      >
        {/* <ExchangeTable /> */}
      </div>
    </>
  );
};

export default ExpenseCrud;

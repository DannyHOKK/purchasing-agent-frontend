import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ExpenseForm from "./ExpenseForm";
import ExpenseTable from "./ExpenseTable";
import { getAllExpense } from "../../redux/expense/expenseAction";
import { getExchangeRate } from "../../redux/exchangeRate/exchangeRateAction";
import { createSelector } from "@reduxjs/toolkit";

const selectExpenseData = createSelector(
  (state) => state.expense.expenseData,
  (expenseData) => expenseData
);

const ExpenseCrud = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllExpense());
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
        <ExpenseTable />
      </div>
    </>
  );
};

export default ExpenseCrud;

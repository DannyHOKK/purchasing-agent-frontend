import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExpenseForm from "./ExpenseForm";
import ExpenseTable from "./ExpenseTable";
import { getAllExpense } from "../../redux/expense/expenseAction";

const ExpenseCrud = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllExpense());
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

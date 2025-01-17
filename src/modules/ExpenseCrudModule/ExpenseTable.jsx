import { Button, Popconfirm, Table, message } from "antd";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import currency from "../../staticData/currency.json";
import {
  deleteExpense,
  getAllExpense,
} from "../../redux/expense/expenseAction";

const currenciesOptions = currency.currenciesOptions.map((currency) => ({
  value: currency.value,
  label: currency.label,
  symbol: currency.symbol,
}));

const ExpenseTable = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { exchangeRateData, exchangeRateLoading } = useSelector(
    (state) => state.exchangeRate
  );
  const { expenseData } = useSelector((state) => state.expense);
  const koreaExchangeRate = useMemo(
    () =>
      exchangeRateData?.find((currency) => currency.currency === "KRW")
        ?.exchangeRate,
    [exchangeRateData]
  );

  const deleteHandler = async (expenseId) => {
    const result = await dispatch(deleteExpense(expenseId));
    console.log(result);
    if (result.meta.requestStatus === "fulfilled") {
      dispatch(getAllExpense());
      messageApi.open({
        type: "success",
        content: result.payload.msg,
      });
    } else {
      messageApi.open({
        type: "error",
        content: result.payload,
      });
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "店鋪",
      dataIndex: "shopName",
      key: "shopName",
    },
    {
      title: "消費種類",
      dataIndex: "consumeType",
      key: "consumeType",
    },
    {
      title: "價格",
      dataIndex: "consumeCost",
      key: "consumeCost",
    },
    {
      title: "港幣",
      dataIndex: "hkdPrice",
      key: "hkdPrice",
      render: (text, record) => {
        return (
          <>${Math.ceil((record.consumeCost / koreaExchangeRate) * 10) / 10}</>
        );
      },
    },
    {
      title: "付款方式",
      dataIndex: "payment",
      key: "payment",
    },
    {
      title: "付款日期",
      dataIndex: "payDate",
      key: "payDate",
    },
    {
      title: "建立日期",
      dataIndex: "createDate",
      key: "createDate",
      width: "180px",
    },
    {
      title: "更改日期",
      dataIndex: "modifyDate",
      key: "modifyDate",
      width: "180px",
    },
    {
      title: "行動",
      key: "operation",
      render: (text, record) => {
        return (
          <>
            <Popconfirm
              placement="topLeft"
              title="刪除"
              description="是否確認刪除?"
              onConfirm={() => {
                deleteHandler(record.expenseId);
              }}
              okText="刪除"
              cancelText="取消"
            >
              <Button
                color="danger"
                variant="filled"
                style={{
                  marginRight: "5px",
                }}
              >
                刪除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const data = expenseData?.map((expense, index) => ({
    id: index + 1,
    expenseId: expense.expenseId,
    shopName: expense.shopName,
    consumeType: expense.consumeType,
    consumeCost: expense.consumeCost,
    hkdPrice: expense.hkdPrice,
    payment: expense.payment,
    payDate: expense.payDate,
    createDate: expense?.createDate.split(".")[0].replaceAll("T", " "),
    modifyDate: expense?.modifyDate.split(".")[0].replaceAll("T", " "),
  }));

  return (
    <div className=" p-4 container-sm">
      <h4>貨幣表格</h4>
      <Table
        loading={exchangeRateLoading}
        columns={columns}
        dataSource={data}
        pagination={{
          position: ["bottomCenter"],
        }}
      />
    </div>
  );
};

export default ExpenseTable;

import { Button, Popconfirm, Table, message } from "antd";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import currency from "../../staticData/currency.json";
import {
  deleteExpense,
  getAllExpense,
} from "../../redux/expense/expenseAction";

const ExpenseTable = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { exchangeRateData, exchangeRateLoading } = useSelector(
    (state) => state.exchangeRate
  );
  const { expenseData } = useSelector((state) => state.expense);

  const exchangeCurrency = exchangeRateData.map(
    (exchangeRate) => exchangeRate.currency
  );

  const currenciesOptions = currency.currenciesOptions
    .filter((option) => {
      return exchangeCurrency.includes(option.value);
    })
    .map((currency) => ({
      value: currency.value,
      label: currency.label,
      symbol: currency.symbol,
    }));

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
      render: (text, record) => {
        const symbol = currenciesOptions?.find(
          (currency) => currency.value === record.currency?.currency
        )?.symbol;

        return (
          <>
            {symbol} {new Intl.NumberFormat().format(record.consumeCost)}
          </>
        );
      },
    },
    {
      title: "港幣",
      dataIndex: "hkdPrice",
      key: "hkdPrice",
      render: (text, record) => {
        const formattedPrice = new Intl.NumberFormat().format(
          Math.ceil((record.consumeCost / record.currency?.exchangeRate) * 10) /
            10
        );
        return <>$ {formattedPrice}</>;
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

    currency: expense?.exchangeRate,
  }));

  return (
    <div className=" p-4 container order-table-container mb-5 mb-sm-0 ">
      <h4>貨幣表格</h4>
      <Table
        loading={exchangeRateLoading}
        columns={columns}
        dataSource={data}
        pagination={{
          position: ["bottomCenter"],
        }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default ExpenseTable;

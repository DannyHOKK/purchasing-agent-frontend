import { Table } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import currency from "../../staticData/currency.json";

const currenciesOptions = currency.currenciesOptions.map((currency) => ({
  value: currency.value,
  label: currency.label,
  symbol: currency.symbol,
}));

const ExpenseTable = () => {
  const { exchangeRateData, exchangeRateLoading } = useSelector(
    (state) => state.exchangeRate
  );

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
    },
    {
      title: "付款方式",
      dataIndex: "payment",
      key: "payment",
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
  ];

  const data = exchangeRateData?.map((exchange, index) => ({
    id: index + 1,
    currency: exchange?.currency,
    exchangeRate: exchange?.exchangeRate,
    createDate: exchange?.createDate.split(".")[0].replaceAll("T", " "),
    modifyDate: exchange?.modifyDate.split(".")[0].replaceAll("T", " "),
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

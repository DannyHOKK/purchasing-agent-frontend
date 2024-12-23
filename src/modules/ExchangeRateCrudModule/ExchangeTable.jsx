import { Table } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import currency from "../../staticData/currency.json";

const currenciesOptions = currency.currenciesOptions.map((currency) => ({
  value: currency.value,
  label: currency.label,
  symbol: currency.symbol,
}));

const ExchangeTable = () => {
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
      title: "貨幣",
      dataIndex: "currency",
      key: "currency",
      render: (text, record) => {
        console.log(
          currenciesOptions?.find(
            (currency) => currency.value === record.currency
          )?.symbol
        );
        return (
          <>
            {
              currenciesOptions?.find(
                (currency) => currency.value === record.currency
              )?.symbol
            }{" "}
            ({record.currency})
          </>
        );
      },
    },
    {
      title: "匯率",
      dataIndex: "exchangeRate",
      key: "exchangeRate",
      render: (text, record) => {
        const exchange = currenciesOptions?.find(
          (currency) => currency.value === record.currency
        );
        return (
          <>
            HKD$1 = {exchange?.symbol} {record.exchangeRate}
          </>
        );
      },
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

export default ExchangeTable;

import { Button, Popconfirm, Table, message } from "antd";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import currency from "../../staticData/currency.json";
import {
  deleteExchange,
  getExchangeRate,
} from "../../redux/exchangeRate/exchangeRateAction";

const ExchangeTable = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { exchangeRateData, exchangeRateLoading } = useSelector(
    (state) => state.exchangeRate
  );

  const currenciesOptions = useMemo(
    () =>
      currency.currenciesOptions.map((currency) => ({
        value: currency.value,
        label: currency.label,
        symbol: currency.symbol,
      })),
    [currency]
  );

  console.log(exchangeRateData);

  const deleteExchangeHandler = async (currency) => {
    const result = await dispatch(deleteExchange(currency));
    console.log(result);
    if (result.meta.requestStatus === "fulfilled") {
      dispatch(getExchangeRate());
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
      title: "貨幣",
      dataIndex: "currency",
      key: "currency",
      render: (text, record) => {
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
                deleteExchangeHandler(record.currency);
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

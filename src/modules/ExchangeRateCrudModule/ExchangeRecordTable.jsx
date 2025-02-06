import { Button, Popconfirm, Table, message } from "antd";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import currency from "../../staticData/currency.json";
import {
  deleteExchangeRecord,
  getAllExchangeRecord,
} from "../../redux/exchangeRecord/exchangeRecordAction";
import { PlusOutlined } from "@ant-design/icons";
import ExchangeRecordAddModal from "./ExchangeRecordAddModal";

const ExchangeRecordTable = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { exchangeRateData, exchangeRateLoading } = useSelector(
    (state) => state.exchangeRate
  );

  const { exchangeRecordData, exchangeRecordLoading } = useSelector(
    (state) => state.exchangeRecord
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

  const deleteExchangeHandler = async (exchangeId) => {
    const result = await dispatch(deleteExchangeRecord(exchangeId));

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(getAllExchangeRecord());
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
      fixed: "left",
      render: (text, record) => {
        return <>{record.currency}</>;
      },
    },
    {
      title: "唱錢金額",
      dataIndex: "exchangeCost",
      key: "exchangeCost",
      render: (text, record) => {
        return <>HKD$ {record.exchangeCost}</>;
      },
    },
    {
      title: "幣值金額",
      render: (text, record) => {
        const exchange = currenciesOptions?.find(
          (currency) => currency.value === record.currency
        );
        const formattedPrice = new Intl.NumberFormat().format(
          record.exchangeCost * record.exchangeRate
        );
        return (
          <>
            {exchange?.symbol} {formattedPrice}
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
      title: "兌換日期",
      dataIndex: "exchangeDate",
      key: "exchangeDate",
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
                deleteExchangeHandler(record.exchangeId);
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

  const data = useMemo(
    () =>
      exchangeRecordData?.map((exchange, index) => ({
        id: index + 1,
        exchangeId: exchange?.exchangeId,
        currency: exchange?.currency,
        exchangeCost: exchange?.exchangeCost,
        exchangeDate: exchange?.exchangeDate,
        exchangeRate: exchange?.exchangeRate,
        createDate: exchange?.createDate.split(".")[0].replaceAll("T", " "),
      })),
    [exchangeRecordData]
  );

  const refreshHandler = () => {
    dispatch(getAllExchangeRecord());
  };
  return (
    <div className=" p-4 container order-table-container ">
      <h4>兌換記錄</h4>
      <div className=" d-flex justify-content-between p-4">
        <div>-</div>
        <div>
          <Button className=" me-3" onClick={refreshHandler}>
            更新表格
          </Button>
          <Button
            style={{ backgroundColor: "#1da57a", color: "white" }}
            onClick={() => setOpen(true)}
          >
            <PlusOutlined />
            加兌換記錄
          </Button>
        </div>
      </div>
      <Table
        loading={exchangeRecordLoading}
        columns={columns}
        dataSource={data}
        pagination={{
          position: ["bottomCenter"],
        }}
        scroll={{ x: "max-content" }}
      />
      <ExchangeRecordAddModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default memo(ExchangeRecordTable);

import { Button, Col, Form, Input, Row, Select, Space, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  createCurrency,
  getExchangeRate,
} from "../../redux/exchangeRate/exchangeRateAction";
import currency from "../../staticData/currency.json";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 6,
    },
    sm: {
      span: 2,
    },
  },
  wrapperCol: {
    xs: {
      span: 20,
    },
    sm: {
      span: 6,
    },
  },
};

const currenciesOptions = currency.currenciesOptions.map((currency) => ({
  value: currency.value,
  label: currency.label,
  symbol: currency.symbol,
}));

const ExchangeForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [symbol, setSymbol] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async () => {
    await form.validateFields();

    const exchangeRateDTO = {
      currency: form.getFieldValue("currency"),
      exchangeRate: form.getFieldValue("exchangeRate"),
    };

    const result = await dispatch(createCurrency(exchangeRateDTO));

    if (result.meta.requestStatus === "fulfilled") {
      form.resetFields();
      messageApi.open({
        type: "success",
        content: "創立成功",
      });
      dispatch(getExchangeRate());
    }
  };

  return (
    <div>
      {contextHolder}
      <h4>創建/更新貨幣匯率</h4>
      <Form
        {...formItemLayout}
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        className=" mt-4"
      >
        <Form.Item
          name="currency"
          label="貨幣"
          rules={[{ required: true, message: "請輸入貨幣" }]}
        >
          <Select
            showSearch
            options={currenciesOptions}
            onChange={(value) => {
              setSymbol(
                currenciesOptions?.find((currency) => currency.value === value)
                  ?.symbol
              );
            }}
          />
        </Form.Item>
        <Form.Item
          name="exchangeRate"
          label="匯率"
          rules={[{ required: true, message: "請輸入匯率" }]}
        >
          <Input prefix={symbol} />
        </Form.Item>
        <Button htmlType="submit" type="primary">
          完成
        </Button>
      </Form>
    </div>
  );
};

export default ExchangeForm;

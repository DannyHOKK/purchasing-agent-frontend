import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import currency from "../../staticData/currency.json";
import {
  createExchangeRecord,
  getAllExchangeRecord,
} from "../../redux/exchangeRecord/exchangeRecordAction";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 6,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 20,
    },
    sm: {
      span: 12,
    },
  },
};

const ExchangeRecordAddModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [symbol, setSymbol] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState();

  const currenciesOptions = currency.currenciesOptions.map((currency) => ({
    value: currency.value,
    label: currency.label,
    symbol: currency.symbol,
  }));

  const onFinish = async () => {
    await form.validateFields();

    const exchangeRecordDTO = {
      currency: form.getFieldValue("currency"),
      exchangeCost: form.getFieldValue("exchangeCost"),
      exchangeRate: form.getFieldValue("exchangeRate"),
      exchangeDate: form.getFieldValue("exchangeDate"),
    };
    console.log(exchangeRecordDTO);
    const result = await dispatch(createExchangeRecord(exchangeRecordDTO));

    if (result.meta.requestStatus === "fulfilled") {
      setOpen(false);
      form.resetFields();
      dispatch(getAllExchangeRecord());
    }
    console.log(result);
  };

  return (
    <Modal
      title={<h3> 加兌換記錄 </h3>}
      centered
      open={open}
      onCancel={() => {
        setOpen(false);
        setSymbol("");
        setSelectedCurrency("");
        form.resetFields();
      }}
      footer={
        <>
          <Button
            onClick={() => {
              setOpen(false);
              form.resetFields();
            }}
          >
            取消
          </Button>
          <Button
            onClick={onFinish}
            style={{ backgroundColor: "#1DA57A", color: "white" }}
          >
            確認
          </Button>
        </>
      }
      width={750}
    >
      <div>請填寫下列表格，添加兌換記錄</div>
      <br />
      <Form
        {...formItemLayout}
        autoComplete="off"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          name="exchangeDate"
          label="兌換日期"
          rules={[{ required: true, message: "請選擇兌換日期" }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="currency"
          label="貨幣"
          rules={[{ required: true, message: "請輸入產品成本" }]}
        >
          <Select
            showSearch
            options={currenciesOptions}
            onChange={(value) => {
              setSymbol(
                currenciesOptions?.find((currency) => currency.value === value)
                  ?.symbol
              );
              setSelectedCurrency(
                currenciesOptions?.find((currency) => currency.value === value)
                  ?.value
              );
            }}
          />
        </Form.Item>

        <Form.Item
          name="exchangeCost"
          label="唱錢金額"
          rules={[{ required: true, message: "請輸入唱錢金額" }]}
        >
          <Input
            prefix="HKD $"
            onChange={(e) => {
              const exchangeRate = form.getFieldValue("exchangeRate");
              const exchangeCost = parseFloat(e.target.value);
              const calculatedPrice =
                Math.ceil(exchangeRate * exchangeCost * 10) / 10;

              // Format the calculated price
              const formattedPrice = new Intl.NumberFormat().format(
                calculatedPrice
              );

              // Set the formatted value in the price field
              form.setFieldValue("price", formattedPrice);
            }}
          />
        </Form.Item>

        {selectedCurrency && (
          <>
            <Form.Item
              name="exchangeRate"
              label="匯率"
              rules={[{ required: true, message: "請輸入匯率" }]}
              style={{ width: "100%" }}
            >
              <Input
                prefix={"HKD 1 : " + symbol}
                onChange={(e) => {
                  const exchangeRate = parseFloat(e.target.value);
                  const exchangeCost = form.getFieldValue("exchangeCost");
                  const calculatedPrice =
                    Math.ceil(exchangeRate * exchangeCost * 10) / 10;

                  // Format the calculated price
                  const formattedPrice = new Intl.NumberFormat().format(
                    calculatedPrice
                  );

                  // Set the formatted value in the price field
                  form.setFieldValue("price", formattedPrice);
                }}
              />
            </Form.Item>

            <Form.Item name="price" label={symbol + " " + selectedCurrency}>
              <Input defaultValue={0} disabled />
            </Form.Item>
          </>
        )}

        <Button htmlType="submit" style={{ display: "none" }}></Button>
      </Form>
    </Modal>
  );
};

export default ExchangeRecordAddModal;

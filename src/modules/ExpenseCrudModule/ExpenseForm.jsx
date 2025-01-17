import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  message,
} from "antd";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import expenseData from "../../staticData/expense.json";
import {
  createConsumption,
  getAllExpense,
} from "../../redux/expense/expenseAction";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 6,
    },
    sm: {
      span: 4,
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

const consumeTypeOptions = expenseData.consumeType.map((consume) => ({
  value: consume.value,
  label: consume.label,
}));
const paymentOptions = expenseData.payment.map((payment) => ({
  value: payment.value,
  label: payment.label,
}));

const ExpenseForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { exchangeRateData } = useSelector((state) => state.exchangeRate);

  const koreaExchangeRate = useMemo(
    () =>
      exchangeRateData?.find((currency) => currency.currency === "KRW")
        ?.exchangeRate,
    [exchangeRateData]
  );

  const onFinish = async () => {
    await form.validateFields();

    const expenseDTO = {
      shopName: form.getFieldValue("shopName"),
      payDate: form.getFieldValue("payDate"),
      consumeType: form.getFieldValue("consumeType"),
      consumeCost: form.getFieldValue("consumeCost"),
      payment: form.getFieldValue("payment"),
    };

    console.log(expenseDTO);

    const result = await dispatch(createConsumption(expenseDTO));

    console.log(result);
    if (result.meta.requestStatus === "fulfilled") {
      form.resetFields();
      messageApi.open({
        type: "success",
        content: "創立成功",
      });
      dispatch(getAllExpense());
    }
  };

  return (
    <div>
      {contextHolder}
      <h4>創建/更新消費記錄</h4>
      <Form
        {...formItemLayout}
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        className=" mt-4"
      >
        <Form.Item
          name="payDate"
          label="日期"
          rules={[{ required: true, message: "請選擇日期" }]}
        >
          <DatePicker onChange={(value) => console.log(setDate())} />
        </Form.Item>
        <Form.Item
          name="shopName"
          label="店鋪"
          rules={[{ required: true, message: "請輸入店鋪" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="consumeType"
          label="消費種類"
          rules={[{ required: true, message: "請選擇消費種類" }]}
        >
          <Select showSearch options={consumeTypeOptions} />
        </Form.Item>

        <Form.Item
          name="consumeCost"
          label="價格"
          rules={[
            { required: true, message: "請輸入價格" },
            {
              pattern: /^[0-9]*$/,
              message: "只允许输入数字!",
            },
          ]}
        >
          <Input
            prefix="₩"
            onChange={(e) => {
              form.setFieldValue(
                "hkdCost",
                Math.ceil((e.target.value / koreaExchangeRate) * 10) / 10
              );
            }}
          />
        </Form.Item>

        <Form.Item name="hkdCost" label="⁠⁠港紙">
          <Input prefix="HKD$" disabled />
        </Form.Item>

        <Form.Item
          name="payment"
          label="付款方式"
          rules={[{ required: true, message: "請選擇付款方式" }]}
        >
          <Select showSearch options={paymentOptions} />
        </Form.Item>

        <Button htmlType="submit" type="primary">
          完成
        </Button>
      </Form>
    </div>
  );
};

export default ExpenseForm;

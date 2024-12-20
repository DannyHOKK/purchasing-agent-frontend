import { Button, Cascader, Divider, Form, Input, Modal, Select } from "antd";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createCustomer,
  getAllCustomer,
} from "../../redux/customer/customerAction";

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

const CustomerAddModal = ({ open, setOpen, messageApi }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const customer = useRef({
    phone: "",
    instagram: "",
    shippingAddress: "",
    remark: "",
  });

  const onFinish = async () => {
    await form.validateFields();
    customer.current = {
      phone: form.getFieldValue("phone"),
      instagram: form.getFieldValue("instagram"),
      shippingAddress: form.getFieldValue("shippingAddress"),
      remark: form.getFieldValue("remark"),
    };

    const result = await dispatch(createCustomer(customer.current));

    if (result.meta.requestStatus === "fulfilled") {
      setOpen(false);
      dispatch(getAllCustomer());
    } else {
      messageApi.open({
        type: "error",
        content: result.payload,
      });
    }
  };

  return (
    <Modal
      title={<h3> 加客人資料 </h3>}
      centered
      open={open}
      onCancel={() => setOpen(false)}
      footer={
        <>
          <Button onClick={() => setOpen(false)}>取消</Button>
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
      <div>請填寫下列表格，添加客人資料</div>
      <br />
      <Form
        {...formItemLayout}
        autoComplete="off"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item name="instagram" label="Instagram">
          <Input />
        </Form.Item>

        <Form.Item name="phone" label="電話">
          <Input />
        </Form.Item>

        <Form.Item name="shippingAddress" label="郵寄地址">
          <Input />
        </Form.Item>

        <Form.Item name="remark" label="remark">
          <Input />
        </Form.Item>
        <Button htmlType="submit" style={{ display: "none" }}></Button>
      </Form>
    </Modal>
  );
};

export default CustomerAddModal;

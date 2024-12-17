import { Button, Cascader, Divider, Form, Input, Modal, Select } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCustomer } from "../../redux/customer/customerAction";

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

const CustomerAddModal = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = async () => {
    await form.validateFields();
    console.log(form.getFieldsValue());
    const result = await dispatch(createCustomer(form.getFieldsValue()));

    if (result.meta.requestStatus === "fulfilled") {
      setOpen(false);
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
            // onClick={() => applyConfirmHandler(tutor.id)}
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
      <Form {...formItemLayout} autoComplete="off" form={form}>
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
      </Form>
    </Modal>
  );
};

export default CustomerAddModal;

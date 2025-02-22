import { Button, Cascader, Divider, Form, Input, Modal, Select } from "antd";
import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getAllCustomer,
  modifyCustomer,
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

const CustomerModifyModal = ({
  openModify,
  setOpenModify,
  customerModifyData,
  messageApi,
}) => {
  const [form] = Form.useForm();
  const [test, setTest] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldValue("instagram", customerModifyData?.instagram);
    form.setFieldValue("phone", customerModifyData?.phone);
    form.setFieldValue("remark", customerModifyData?.remark);
    form.setFieldValue("shippingAddress", customerModifyData?.shippingAddress);
  }, [customerModifyData]);

  const onFinish = async () => {
    await form.validateFields();
    const modifyCustomerData = {
      customerId: customerModifyData.customerId,
      phone: form.getFieldValue("phone") ? form.getFieldValue("phone") : null,
      instagram: form.getFieldValue("instagram")
        ? form.getFieldValue("instagram")
        : null,
      remark: form.getFieldValue("remark")
        ? form.getFieldValue("remark")
        : null,
      shippingAddress: form.getFieldValue("shippingAddress")
        ? form.getFieldValue("shippingAddress")
        : null,
    };
    console.log(modifyCustomerData);

    const result = await dispatch(modifyCustomer(modifyCustomerData));

    if (result.meta.requestStatus === "fulfilled") {
      setOpenModify(false);
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
      title={<h3> 編輯客人資料 </h3>}
      centered
      open={openModify}
      onCancel={() => setOpenModify(false)}
      footer={
        <>
          <Button onClick={() => setOpenModify(false)}>取消</Button>
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
      <div>請填寫下列表格，編輯客人資料</div>
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
export default memo(CustomerModifyModal);

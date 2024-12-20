import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createProduct,
  getAllProduct,
} from "../../redux/product/productAction";

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

const ProductAddModal = ({ open, setOpen, productBrandOptions }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldValue("discount", 100);
    form.setFieldValue("stock", 0);
  }, [open]);

  const onFinish = async () => {
    await form.validateFields();
    const result = await dispatch(createProduct(form.getFieldsValue()));

    if (result.meta.requestStatus === "fulfilled") {
      setOpen(false);
      form.resetFields();
      dispatch(getAllProduct());
    }
    console.log(result);
  };

  return (
    <Modal
      title={<h3> 加產品資料 </h3>}
      centered
      open={open}
      onCancel={() => {
        setOpen(false);
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
      <div>請填寫下列表格，添加客人資料</div>
      <br />
      <Form {...formItemLayout} autoComplete="off" form={form}>
        <Form.Item
          name="productBrand"
          label="牌子"
          rules={[{ required: true, message: "請輸入產品牌子" }]}
        >
          <AutoComplete
            options={productBrandOptions}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
        </Form.Item>

        <Form.Item
          name="productType"
          label="種類"
          rules={[{ required: true, message: "請輸入產品種類" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="productName"
          label="產品"
          rules={[{ required: true, message: "請輸入產品" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="成本" style={{ margin: "0" }}>
          <Space.Compact>
            <Form.Item
              name="productCost"
              rules={[{ required: true, message: "請輸入產品成本" }]}
              style={{ width: "63%" }}
            >
              <Input prefix="₩" suffix="KRW" />
            </Form.Item>
            <Form.Item
              name="discount"
              rules={[{ required: true, message: "請輸入優惠" }]}
              style={{ width: "37%" }}
            >
              <InputNumber
                prefix="x"
                defaultValue={100}
                suffix="%"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item
          name="productPrice"
          label="售價"
          rules={[{ required: true, message: "請輸入產品售價" }]}
        >
          <Input prefix="$" suffix="HKD" />
        </Form.Item>

        <Form.Item
          name="stock"
          label="存貨"
          rules={[{ required: true, message: "請輸入存貨" }]}
        >
          <Input type="number" defaultValue={0} />
        </Form.Item>
        <Button htmlType="submit" style={{ display: "none" }}></Button>
      </Form>
    </Modal>
  );
};

export default ProductAddModal;

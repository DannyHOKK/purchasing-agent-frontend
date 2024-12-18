import { AutoComplete, Button, Form, Input, Modal, Radio, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  getAllProduct,
} from "../../redux/product/productAction";
import { createOrder, getAllOrders } from "../../redux/order/orderAction";

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

const OrderAddModal = ({ open, setOpen, customerPhone }) => {
  const { productData } = useSelector((state) => state.product);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [productTypeOptions, setProductTypeOptions] = useState();
  const [productNameOptions, setProductNameOptions] = useState();
  const [ordersDTO, setOrdersDTO] = useState({
    phone: "",
    productName: "",
    paid: false,
    quantity: 0,
    takeMethod: "",
    paymentMethod: "",
    remark: "",
  });

  useEffect(() => {
    setProductNameOptions(
      productData?.map((product) => ({
        value: product.productName,
      }))
    );

    setProductTypeOptions(
      productData?.map((product) => ({
        value: product.productType,
      }))
    );
  }, [productData]);

  const onFinish = async () => {
    await form.validateFields();
    console.log(form.getFieldsValue());

    setOrdersDTO(() => ({
      phone: form.getFieldValue("phone"),
      productName: form.getFieldValue("productName"),
      paid: form.getFieldValue("paid"),
      quantity: form.getFieldValue("quantity"),
      takeMethod: form.getFieldValue("takeMethod"),
      paymentMethod: form.getFieldValue("paymentMethod"),
      remark: form.getFieldValue("remark") ? form.getFieldValue("remark") : " ",
    }));
    createOrderHandler();
  };

  const createOrderHandler = async () => {
    const result = await dispatch(createOrder(ordersDTO));

    if (result.meta.requestStatus === "fulfilled") {
      setOpen(false);
      dispatch(getAllOrders());
    }

    console.log(ordersDTO);
  };

  const phoneOptions = customerPhone.map((phone) => ({
    value: phone,
  }));

  const productBrandOptions = productData
    ?.map((product) => product.productBrand)
    ?.filter((product, index, self) => self.indexOf(product) === index)
    ?.map((productBrand) => ({
      value: productBrand,
    }));

  const filterBrandHandler = () => {
    setProductTypeOptions(
      productData
        .filter((product) =>
          product.productBrand?.includes(form.getFieldValue("productBrand"))
        )
        .map((product) => product.productType)
        .filter((product, index, self) => self.indexOf(product) === index)
        .map((productType) => ({
          value: productType,
        }))
    );

    setProductNameOptions(
      productData
        .filter((product) =>
          product.productBrand?.includes(form.getFieldValue("productBrand"))
        )

        .map((product) => product.productName)
        .filter((product, index, self) => self.indexOf(product) === index)
        .map((productName) => ({
          value: productName,
        }))
    );

    form.setFieldValue("productType", "");
    form.setFieldValue("productName", "");
  };

  const filterTypeHandler = () => {
    setProductNameOptions(
      productData
        .filter((product) =>
          product.productType?.includes(form.getFieldValue("productType"))
        )
        .map((product) => ({
          value: product.productName,
        }))
    );

    autoFillBrand();
    form.setFieldValue("productName", "");
  };

  const autoFillBrand = () => {
    form.setFieldValue(
      "productBrand",
      productData
        .filter(
          (product) => product.productType == form.getFieldValue("productType")
        )
        .map((product) => product.productBrand)
    );
  };

  const autoFillHandler = (value) => {
    form.setFieldValue(
      "productType",
      productData
        .filter((product) => product.productName == value)
        .map((product) => product.productType)
    );

    autoFillBrand();
  };

  return (
    <Modal
      title={<h3> 計單資料 </h3>}
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
      <div>請填寫下列訂單表格</div>
      <br />
      <Form {...formItemLayout} autoComplete="off" form={form}>
        <Form.Item
          name="phone"
          label="客人電話"
          rules={[{ required: true, message: "客人電話" }]}
        >
          <AutoComplete
            options={phoneOptions}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
        </Form.Item>

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
            onChange={(value) => {
              filterBrandHandler(value);
            }}
          />
        </Form.Item>

        <Form.Item
          name="productType"
          label="種類"
          rules={[{ required: true, message: "請輸入產品種類" }]}
        >
          <AutoComplete
            options={productTypeOptions}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            onChange={() => {
              filterTypeHandler();
            }}
          />
        </Form.Item>

        <Form.Item
          name="productName"
          label="產品"
          rules={[{ required: true, message: "請輸入產品" }]}
        >
          <Select
            showSearch
            options={productNameOptions}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            onChange={(value) => {
              autoFillHandler(value);
            }}
          />
        </Form.Item>

        <Form.Item
          name="paid"
          label="是否已付款"
          rules={[{ required: true, message: "請選擇是否付款" }]}
        >
          <Radio.Group>
            <Radio value={true}>已付款</Radio>
            <Radio value={false}>未付款</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="takeMethod"
          label="運輸"
          rules={[{ required: true, message: "請選擇運輸" }]}
        >
          <Radio.Group>
            <Radio value={"自取"}>自取</Radio>
            <Radio value={"順豐"}>順豐</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="paymentMethod"
          label="付款方法"
          rules={[{ required: true, message: "請選擇運輸" }]}
        >
          <Radio.Group>
            <Radio value={"PAYME"}>PAYME</Radio>
            <Radio value={"FPS"}>FPS</Radio>
            <Radio value={"ALIPAY"}>ALIPAY</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="quantity"
          label="數量"
          rules={[{ required: true, message: "請輸入數量" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="remark" label="Remark">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderAddModal;

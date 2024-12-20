import {
  AutoComplete,
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Switch,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  getAllProduct,
} from "../../redux/product/productAction";
import {
  createOrder,
  getAllOrders,
  modifyOrder,
} from "../../redux/order/orderAction";

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

const OrderModifyModal = ({ openModify, setOpenModify, orderModifyData }) => {
  const { productData } = useSelector((state) => state.product);
  const { allCustomer } = useSelector((state) => state.customer);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [contact, setContact] = useState(false);
  const [productTypeOptions, setProductTypeOptions] = useState();
  const [productNameOptions, setProductNameOptions] = useState();
  // const [messageApi, contextHolder] = message.useMessage();
  const ordersDTO = useRef({
    phone: "",
    instagram: "",
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

  useEffect(() => {
    console.log(orderModifyData);

    orderModifyData?.phone !== null
      ? (form.setFieldValue("phone", orderModifyData?.photo),
        form.setFieldValue("contact", true),
        setContact(true))
      : (form.setFieldValue("instagram", orderModifyData?.instagram),
        form.setFieldValue("contact", false),
        setContact(false));
    form.setFieldValue("phone", orderModifyData?.phone);
    form.setFieldValue("instagram", orderModifyData?.instagram);
    form.setFieldValue("productName", orderModifyData?.productName);
    autoFillHandler(orderModifyData?.productName);
    form.setFieldValue("paid", orderModifyData?.paid);
    form.setFieldValue("quantity", orderModifyData?.quantity);
    form.setFieldValue("takeMethod", orderModifyData?.takeMethod);
    form.setFieldValue("paymentMethod", orderModifyData?.paymentMethod);
    form.setFieldValue("remark", orderModifyData?.remark);
  }, [orderModifyData]);

  const onFinish = async () => {
    await form.validateFields();

    ordersDTO.current = {
      orderId: orderModifyData?.orderId,
      phone: form.getFieldValue("phone"),
      instagram: form.getFieldValue("instagram"),
      productName: form.getFieldValue("productName"),
      paid: form.getFieldValue("paid"),
      quantity: form.getFieldValue("quantity"),
      takeMethod: form.getFieldValue("takeMethod"),
      paymentMethod: form.getFieldValue("paymentMethod"),
      remark: form.getFieldValue("remark") ? form.getFieldValue("remark") : " ",
    };

    modifyOrderHandler();
  };

  const modifyOrderHandler = async () => {
    const result = await dispatch(modifyOrder(ordersDTO.current));

    if (result.meta.requestStatus === "fulfilled") {
      setOpenModify(false);
      dispatch(getAllOrders());
    }
  };

  const phoneOptions = allCustomer
    .filter((customer) => customer.phone)
    .map((customer) => customer.phone)
    .filter((customer, index, self) => self.indexOf(customer) === index)
    .map((phone) => ({
      value: phone,
    }));

  const instagramOptions = allCustomer
    .filter((customer) => customer.instagram)
    .map((customer) => customer.instagram)
    .filter((customer, index, self) => self.indexOf(customer) === index)
    .map((instagram) => ({
      value: instagram,
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
      open={openModify}
      onCancel={() => {
        setOpenModify(false);
        form.resetFields();
        form.setFieldValue("contact", contact);
      }}
      footer={
        <>
          <Button
            onClick={() => {
              setOpenModify(false);
              form.resetFields();
              form.setFieldValue("contact", contact);
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
      <div>請填寫下列訂單表格</div>
      <br />
      <Form
        {...formItemLayout}
        autoComplete="off"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item name="contact" label="電話 / IG">
          {/* {contextHolder} */}
          <Switch
            onChange={(value) => {
              setContact(value);
            }}
            checkedChildren="電話"
            unCheckedChildren="IG"
          />
        </Form.Item>
        {contact && (
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
              disabled
            />
          </Form.Item>
        )}

        {contact === false && (
          <Form.Item
            name="instagram"
            label="Instagram"
            rules={[{ required: true, message: "Instagram" }]}
          >
            <AutoComplete
              options={instagramOptions}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              }
              disabled
            />
          </Form.Item>
        )}

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
            <Radio value={"郵寄"}>郵寄</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="paymentMethod"
          label="付款方法"
          rules={[{ required: true, message: "請選擇運輸" }]}
          wrapperCol={{ span: 16 }}
        >
          <Radio.Group>
            <Radio value={"PAYME"}>PAYME</Radio>
            <Radio value={"FPS"}>FPS</Radio>
            <Radio value={"ALIPAY"}>ALIPAY</Radio>
            <Radio value={"BANK"}>BANK</Radio>
            <Radio value={"CARMEN"}>CARMEN</Radio>
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
        <Button htmlType="submit" style={{ display: "none" }}></Button>
      </Form>
    </Modal>
  );
};

export default OrderModifyModal;

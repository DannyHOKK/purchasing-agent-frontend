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
import React, { memo, useEffect, useRef, useState } from "react";
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
import { tr } from "framer-motion/client";
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

const OrderModifyModal = ({
  openModify,
  setOpenModify,
  orderModifyData,
  messageApi,
}) => {
  const { productData } = useSelector((state) => state.product);
  const { customerData } = useSelector((state) => state.customer);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [orderPlatform, setOrderPlatform] = useState();
  const [productTypeOptions, setProductTypeOptions] = useState();
  const [productNameOptions, setProductNameOptions] = useState();
  const [productTotalPrice, setProductTotalPrice] = useState();
  const [takeMethod, setTakeMethod] = useState();
  const packageName = localStorage.getItem("packageName")
    ? localStorage.getItem("packageName")
    : "預設";

  useEffect(() => {
    setProductNameOptions(
      productData?.map((product) => ({
        value: product.productName,
      }))
    );

    setProductTypeOptions(
      productData
        .map((product) => product.productType)
        .filter((product, index, self) => self.indexOf(product) === index)
        .map((productType) => ({
          value: productType,
        }))
    );
  }, [productData]);

  useEffect(() => {
    orderModifyData?.phone !== null
      ? form.setFieldValue("phone", orderModifyData?.photo)
      : form.setFieldValue("instagram", orderModifyData?.instagram);

    form.setFieldValue("phone", orderModifyData?.phone);
    form.setFieldValue("instagram", orderModifyData?.instagram);
    form.setFieldValue("productName", orderModifyData?.productName);
    autoFillHandler(orderModifyData?.productName);
    form.setFieldValue("paid", orderModifyData?.paid);
    form.setFieldValue("quantity", orderModifyData?.quantity);
    form.setFieldValue("takeMethod", orderModifyData?.takeMethod);
    form.setFieldValue("paymentMethod", orderModifyData?.paymentMethod);
    form.setFieldValue("remark", orderModifyData?.remark);
    form.setFieldValue("discount", orderModifyData?.discount);
    setOrderPlatform(
      orderModifyData?.orderPlatform === "phone" ? "phone" : "instagram"
    );
    setTakeMethod(orderModifyData?.takeMethod);
    if (orderModifyData?.takeMethod === "郵寄") {
      const customer = customerData.filter((cus) =>
        orderPlatform === "phone"
          ? cus.phone === orderModifyData?.phone
          : cus.instagram === orderModifyData?.instagram
      );

      form.setFieldValue("shippingAddress", customer[0]?.shippingAddress);
    }
    form.setFieldValue(
      "orderPlatform",
      orderModifyData?.orderPlatform === "phone" ? true : false
    );
    form.setFieldValue(
      "price",
      (orderModifyData?.quantity *
        orderModifyData?.product?.productPrice *
        orderModifyData?.discount) /
        100
    );
  }, [orderModifyData]);

  const onFinish = async () => {
    await form.validateFields();

    const ordersDTO = {
      orderId: orderModifyData?.orderId,
      phone: form.getFieldValue("phone"),
      instagram: form.getFieldValue("instagram"),
      productName: form.getFieldValue("productName"),
      paid: form.getFieldValue("paid"),
      orderPlatform: orderPlatform,
      quantity: form.getFieldValue("quantity"),
      takeMethod: form.getFieldValue("takeMethod"),
      paymentMethod: form.getFieldValue("paymentMethod"),
      remark: form.getFieldValue("remark") ? form.getFieldValue("remark") : " ",
      discount: form.getFieldValue("discount"),
    };

    modifyCustomerHandler();

    modifyOrderHandler(ordersDTO);
  };

  const modifyCustomerHandler = async () => {
    const customerAddress = customerData.filter((cus) =>
      orderPlatform === "phone"
        ? cus.phone === form.getFieldValue("phone")
        : cus.instagram === form.getFieldValue("instagram")
    );

    if (
      form.getFieldValue("shippingAddress") &&
      form.getFieldValue("shippingAddress") !==
        customerAddress[0]?.shippingAddress
    ) {
      const customerDTO = {
        customerId: customerAddress[0]?.customerId,
        phone: customerAddress[0]?.phone,
        instagram: customerAddress[0]?.instagram,
        shippingAddress: form.getFieldValue("shippingAddress"),
        remark: customerAddress[0]?.remark,
      };

      const result = await dispatch(modifyCustomer(customerDTO));

      if (result.meta.requestStatus === "fulfilled") {
        dispatch(getAllCustomer());
        messageApi.open({
          type: "success",
          content: "成功更改客人地址",
        });
      } else {
        messageApi.open({
          type: "error",
          content: result.payload,
        });
      }
    }
  };

  const modifyOrderHandler = async (ordersDTO) => {
    const result = await dispatch(modifyOrder(ordersDTO));

    if (result.meta.requestStatus === "fulfilled") {
      setOpenModify(false);
      dispatch(getAllOrders(packageName));
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

  const phoneOptions = customerData
    .filter((customer) => customer.phone)
    .map((customer) => customer.phone)
    .filter((customer, index, self) => self.indexOf(customer) === index)
    .map((phone) => ({
      value: phone,
    }));

  const instagramOptions = customerData
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
        .filter(
          (product) =>
            product.productType?.includes(form.getFieldValue("productType")) &&
            product.productBrand?.includes(
              form.getFieldValue("productBrand")
                ? form.getFieldValue("productBrand")
                : ""
            )
        )
        .map((product) => ({
          value: product.productName,
        }))
    );

    // autoFillBrand();
    form.setFieldValue("productName", "");
  };

  const autoFillBrand = () => {
    form.setFieldValue(
      "productBrand",
      productData
        .filter(
          (product) => product.productName == form.getFieldValue("productName")
        )
        .map((product) => product.productBrand)
    );
  };

  const autoFillHandler = (value) => {
    const price = productData?.find(
      (product) => product.productName === form.getFieldValue("productName")
    )?.productPrice;

    setProductTotalPrice(price);

    form.setFieldValue("price", price * form.getFieldValue("quantity"));

    form.setFieldValue(
      "productType",
      productData
        .filter((product) => product.productName == value)
        .map((product) => product.productType)
    );

    setProductTypeOptions(
      productData
        .filter(
          (product) =>
            product?.productBrand ===
            productData?.find((product) => product.productName === value)
              ?.productBrand
        )
        .map((product) => product.productType)
        .filter((product, index, self) => self.indexOf(product) === index)
        .map((productType) => ({
          value: productType,
        }))
    );

    autoFillBrand();
  };

  const discountPriceHandler = (value) => {
    form.setFieldValue(
      "price",
      Math.ceil(
        productTotalPrice * form.getFieldValue("quantity") * (value / 100) * 10
      ) / 10
    );
  };

  return (
    <Modal
      title={<h3> 計單資料 </h3>}
      centered
      open={openModify}
      onCancel={() => {
        setOpenModify(false);
        // form.resetFields();
        // form.setFieldValue("orderPlatform", orderPlatform);
      }}
      footer={
        <>
          <Button
            onClick={() => {
              setOpenModify(false);
              // form.resetFields();
              // form.setFieldValue("orderPlatform", orderPlatform);
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
        <Form.Item name="orderPlatform" label="電話 / IG">
          <Switch
            onChange={(value) => {
              setOrderPlatform(value ? "phone" : "instagram");
            }}
            checkedChildren="電話"
            unCheckedChildren="IG"
          />
        </Form.Item>
        {orderPlatform === "phone" && (
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

        {orderPlatform === "instagram" && (
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
          <Select
            showSearch
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
          <Select
            showSearch
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
            <Radio value="已付款">已付款</Radio>
            <Radio value="未付款">未付款</Radio>
            <Radio value="已退款">已退款</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="takeMethod"
          label="運輸"
          rules={[{ required: true, message: "請選擇運輸" }]}
        >
          <Radio.Group
            onChange={(e) => {
              const customer = customerData.filter((cus) =>
                orderPlatform === "phone"
                  ? cus.phone === form.getFieldValue("phone")
                  : cus.instagram === form.getFieldValue("instagram")
              );

              form.setFieldValue(
                "shippingAddress",
                customer[0]?.shippingAddress
              );
              setTakeMethod(e.target.value);
            }}
          >
            <Radio value={"自取"}>自取</Radio>
            <Radio value={"郵寄"}>郵寄</Radio>
            <Radio value={"未知"}>未知</Radio>
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
          <Input
            onChange={(e) => {
              form.setFieldValue(
                "price",
                (productTotalPrice *
                  e.target.value *
                  form.getFieldValue("discount")) /
                  100
              );
            }}
          />
        </Form.Item>

        <Form.Item name="discount" label="折扣">
          <Input
            defaultValue={100}
            suffix="%"
            style={{ width: "80px" }}
            onChange={(e) => {
              discountPriceHandler(e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item name="price" label="總數">
          <Input defaultValue={0} disabled />
        </Form.Item>

        <Form.Item name="remark" label="Remark">
          <Input />
        </Form.Item>

        {takeMethod === "郵寄" && (
          <Form.Item
            name="shippingAddress"
            label="郵寄地址"
            rules={[{ required: true, message: "請輸入郵寄地址" }]}
          >
            <Input />
          </Form.Item>
        )}

        <Button htmlType="submit" style={{ display: "none" }}></Button>
      </Form>
    </Modal>
  );
};

export default memo(OrderModifyModal);

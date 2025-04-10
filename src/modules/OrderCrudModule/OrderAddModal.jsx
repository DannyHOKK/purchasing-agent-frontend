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
import { createOrder, getAllOrders } from "../../redux/order/orderAction";
import {
  checkCustomerExist,
  createCustomer,
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
      span: 24,
    },
    sm: {
      span: 12,
    },
  },
};

const OrderAddModal = ({ open, setOpen, messageApi }) => {
  const { productData } = useSelector((state) => state.product);
  const { customerData } = useSelector((state) => state.customer);
  const { orderLoading } = useSelector((state) => state.order);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [orderPlatform, setOrderPlatform] = useState("phone");
  const [productTypeOptions, setProductTypeOptions] = useState();
  const [productNameOptions, setProductNameOptions] = useState();
  const [openCustomerAdd, setOpenCustomerAdd] = useState(false);
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
    setTakeMethod("");
    form.setFieldValue("takeMethod", "未知");
    form.setFieldValue("paid", "已付款");
    form.setFieldValue("quantity", 1);
    form.setFieldValue("discount", 100);
    form.setFieldValue("paymentMethod", "PAYME");
  }, [productData, open]);

  const onFinish = async () => {
    await form.validateFields();

    const ordersDTO = {
      phone: form.getFieldValue("phone"),
      instagram: form.getFieldValue("instagram"),
      productName: form.getFieldValue("productName"),
      orderPlatform: orderPlatform,
      paid: form.getFieldValue("paid"),
      quantity: form.getFieldValue("quantity"),
      takeMethod: form.getFieldValue("takeMethod"),
      paymentMethod: form.getFieldValue("paymentMethod"),
      remark: form.getFieldValue("remark") ? form.getFieldValue("remark") : " ",
      packageName: packageName,
      discount: form.getFieldValue("discount"),
    };

    modifyCustomerHandler();

    createOrderHandler(ordersDTO);
  };

  const modifyCustomerHandler = async () => {
    const customerAddress = customerData.filter((cus) =>
      orderPlatform === "phone"
        ? cus.phone === form.getFieldValue("phone")
        : cus.instagram === form.getFieldValue("instagram")
    );
    console.log(form.getFieldValue("shippingAddress"));
    console.log(customerAddress[0]?.shippingAddress);

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

  const createOrderHandler = async (ordersDTO) => {
    const checkExistResult = await dispatch(checkCustomerExist(ordersDTO));

    if (checkExistResult.meta.requestStatus === "fulfilled") {
      const result = await dispatch(createOrder(ordersDTO));

      if (result.meta.requestStatus === "fulfilled") {
        setOpen(false);
        form.resetFields();
        setOrderPlatform("phone");
        dispatch(getAllOrders(packageName));

        messageApi.open({
          type: "success",
          content: "成功創立訂單",
        });
      }
    } else {
      console.log("冇客人資料");
      setOpenCustomerAdd(true);
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
        .map((product) => product?.productType)
        .filter((product, index, self) => self.indexOf(product) === index)
        .map((productType) => ({
          value: productType,
        }))
    );

    autoFillBrand();
  };

  const addOrderHandler = async () => {
    await form.validateFields();

    const ordersDTO = {
      phone: form.getFieldValue("phone"),
      instagram: form.getFieldValue("instagram"),
      productName: form.getFieldValue("productName"),
      paid: form.getFieldValue("paid"),
      orderPlatform: orderPlatform,
      quantity: form.getFieldValue("quantity"),
      takeMethod: form.getFieldValue("takeMethod"),
      paymentMethod: form.getFieldValue("paymentMethod"),
      remark: form.getFieldValue("remark") ? form.getFieldValue("remark") : " ",
      packageName: packageName,
      discount: form.getFieldValue("discount"),
    };

    modifyCustomerHandler();

    createAddOrderHandler(ordersDTO);
  };

  const createAddOrderHandler = async (ordersDTO) => {
    const checkExistResult = await dispatch(checkCustomerExist(ordersDTO));

    if (checkExistResult.meta.requestStatus === "fulfilled") {
      const result = await dispatch(createOrder(ordersDTO));

      if (result.meta.requestStatus === "fulfilled") {
        dispatch(getAllOrders(packageName));

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

        form.setFieldValue("productBrand", "");
        form.setFieldValue("productType", "");
        form.setFieldValue("productName", "");
        form.setFieldValue("quantity", 1);

        messageApi.open({
          type: "success",
          content: "成功創立訂單",
        });
      }
    } else {
      console.log("冇客人資料");
      setOpenCustomerAdd(true);
    }
  };

  const createCustomerHandler = async () => {
    const customerDTO = {
      phone: form.getFieldValue("phone"),
      instagram: form.getFieldValue("instagram"),
    };

    const result = await dispatch(createCustomer(customerDTO));

    if (result.meta.requestStatus === "fulfilled") {
      setOpenCustomerAdd(false);
      messageApi.open({
        type: "success",
        content: "成功加入客人",
      });
      dispatch(getAllCustomer());
    }
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
    setOrderPlatform("phone");
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
      open={open}
      onCancel={() => {
        onClose();
      }}
      footer={
        <>
          <Button
            onClick={() => {
              onClose();
            }}
          >
            取消
          </Button>
          <Button
            onClick={onFinish}
            style={{ backgroundColor: "#1DA57A", color: "white" }}
            loading={orderLoading}
          >
            確認
          </Button>
          <Button
            onClick={addOrderHandler}
            style={{ backgroundColor: "blue", color: "white" }}
            loading={orderLoading}
          >
            加訂單
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
              form.setFieldValue("phone", "");
              form.setFieldValue("instagram", "");
              form.setFieldValue("shippingAddress", "");
            }}
            checkedChildren="電話"
            unCheckedChildren="IG"
            defaultChecked={true}
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
              onChange={(value) => {
                const customer = customerData.filter(
                  (cus) => cus.phone === value
                );

                form.setFieldValue(
                  "shippingAddress",
                  customer[0]?.shippingAddress
                );
              }}
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
              onChange={(value) => {
                const customer = customerData.filter(
                  (cus) => cus.instagram === value
                );

                form.setFieldValue(
                  "shippingAddress",
                  customer[0]?.shippingAddress
                );
              }}
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
            <Radio
              value="未付款"
              onClick={() => {
                form.setFieldValue("paymentMethod", "未知");
              }}
            >
              未付款
            </Radio>
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
          rules={[{ required: true, message: "請選擇付款方法" }]}
          wrapperCol={{ span: 16 }}
        >
          <Radio.Group>
            <Radio value={"PAYME"}>PAYME</Radio>
            <Radio value={"FPS"}>FPS</Radio>
            <Radio value={"ALIPAY"}>ALIPAY</Radio>
            <Radio value={"BANK"}>BANK</Radio>
            <Radio value={"CARMEN"}>CARMEN</Radio>
            <Radio value={"未知"}>未知</Radio>
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
            defaultValue={1}
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
      <Modal
        title={<h3> 加客人資料 </h3>}
        centered
        open={openCustomerAdd}
        onCancel={() => {
          setOpenCustomerAdd(false);
        }}
        footer={
          <>
            <Button onClick={() => setOpenCustomerAdd(false)}>取消</Button>
            <Button
              style={{ backgroundColor: "#1DA57A", color: "white" }}
              onClick={() => createCustomerHandler()}
            >
              確認
            </Button>
          </>
        }
        width={400}
      >
        {form.getFieldValue("phone") && form.getFieldValue("phone")}
        {form.getFieldValue("instagram") && form.getFieldValue("instagram")}
      </Modal>
    </Modal>
  );
};

export default OrderAddModal;

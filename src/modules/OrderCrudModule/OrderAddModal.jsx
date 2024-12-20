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
import { createOrder, getAllOrders } from "../../redux/order/orderAction";
import {
  checkCustomerExist,
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

const OrderAddModal = ({ open, setOpen, messageApi }) => {
  const { productData } = useSelector((state) => state.product);
  const { allCustomer } = useSelector((state) => state.customer);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [contact, setContact] = useState(false);
  const [productTypeOptions, setProductTypeOptions] = useState();
  const [productNameOptions, setProductNameOptions] = useState();
  const [openCustomerAdd, setOpenCustomerAdd] = useState(false);
  const [productTotalPrice, setProductTotalPrice] = useState();
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
      productData
        .map((product) => product.productType)
        .filter((product, index, self) => self.indexOf(product) === index)
        .map((productType) => ({
          value: productType,
        }))
    );
  }, [productData, open]);

  // useEffect(() => {

  // }, [form.getFieldValue("productName")]);

  const onFinish = async () => {
    await form.validateFields();

    ordersDTO.current = {
      phone: form.getFieldValue("phone"),
      instagram: form.getFieldValue("instagram"),
      productName: form.getFieldValue("productName"),
      paid: form.getFieldValue("paid"),
      quantity: form.getFieldValue("quantity"),
      takeMethod: form.getFieldValue("takeMethod"),
      paymentMethod: form.getFieldValue("paymentMethod"),
      remark: form.getFieldValue("remark") ? form.getFieldValue("remark") : " ",
    };

    createOrderHandler();
  };

  const createOrderHandler = async () => {
    const checkExistResult = await dispatch(
      checkCustomerExist(ordersDTO.current)
    );

    if (checkExistResult.meta.requestStatus === "fulfilled") {
      const result = await dispatch(createOrder(ordersDTO.current));

      console.log(result);
      if (result.meta.requestStatus === "fulfilled") {
        setOpen(false);
        form.resetFields();
        dispatch(getAllOrders());

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
    ).productPrice;

    setProductTotalPrice(price);

    form.setFieldValue("price", price * form.getFieldValue("quantity"));

    form.setFieldValue(
      "productType",
      productData
        .filter((product) => product.productName == value)
        .map((product) => product.productType)
    );

    autoFillBrand();
  };

  const addOrderHandler = async () => {
    await form.validateFields();

    ordersDTO.current = {
      phone: form.getFieldValue("phone"),
      instagram: form.getFieldValue("instagram"),
      productName: form.getFieldValue("productName"),
      paid: form.getFieldValue("paid"),
      quantity: form.getFieldValue("quantity"),
      takeMethod: form.getFieldValue("takeMethod"),
      paymentMethod: form.getFieldValue("paymentMethod"),
      remark: form.getFieldValue("remark") ? form.getFieldValue("remark") : " ",
    };
    createAddOrderHandler();
  };

  const createAddOrderHandler = async () => {
    const checkExistResult = await dispatch(
      checkCustomerExist(ordersDTO.current)
    );

    if (checkExistResult.meta.requestStatus === "fulfilled") {
      const result = await dispatch(createOrder(ordersDTO.current));

      if (result.meta.requestStatus === "fulfilled") {
        dispatch(getAllOrders());

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

        form.setFieldValue("productBrand", "");
        form.setFieldValue("productType", "");
        form.setFieldValue("productName", "");

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

    console.log(result);
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
    form.setFieldValue("contact", contact);
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
          >
            確認
          </Button>
          <Button
            onClick={addOrderHandler}
            style={{ backgroundColor: "blue", color: "white" }}
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
        <Form.Item name="contact" label="電話 / IG">
          <Switch
            onChange={(value) => {
              setContact(value);
              form.setFieldValue("phone", "");
              form.setFieldValue("instagram", "");
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
          <Input
            onChange={(e) => {
              form.setFieldValue("price", productTotalPrice * e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item name="price" label="總數">
          <Input defaultValue={0} disabled />
        </Form.Item>

        <Form.Item name="remark" label="Remark">
          <Input />
        </Form.Item>
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

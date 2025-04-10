import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  message,
} from "antd";
import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  getAllProduct,
  modifyProduct,
} from "../../redux/product/productAction";
import currency from "../../staticData/currency.json";

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

const ProductCopyModal = ({
  open,
  setOpen,
  productBrandOptions,
  productModifyData,
  messageApi,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [productTypeOptions, setProductTypeOptions] = useState();
  const [commission, setCommission] = useState(false);
  const { productData } = useSelector((state) => state.product);
  const { exchangeRateData } = useSelector((state) => state.exchangeRate);
  const [symbol, setSymbol] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState();

  const [exchangeRate, setExchangeRate] = useState();

  const exchangeCurrency = exchangeRateData.map(
    (exchangeRate) => exchangeRate.currency
  );

  const currenciesOptions = currency.currenciesOptions
    .filter((option) => {
      return exchangeCurrency.includes(option.value);
    })
    .map((currency) => ({
      value: currency.value,
      label: currency.label,
      symbol: currency.symbol,
    }));

  useEffect(() => {
    const price =
      Math.ceil(
        ((productModifyData?.productCost * productModifyData?.discount) /
          100 /
          productModifyData?.currency?.exchangeRate +
          productModifyData?.weight * 25) *
          10
      ) / 10;
    setProductTypeOptions(
      productData
        ?.map((product) => product.productType)
        ?.filter((product, index, self) => self.indexOf(product) === index)
        ?.map((productType) => ({
          value: productType,
        }))
    );
    form.setFieldValue("productBrand", productModifyData?.productBrand);
    form.setFieldValue("productType", productModifyData?.productType);
    form.setFieldValue("productCost", productModifyData?.productCost);
    form.setFieldValue("productName", productModifyData?.productName);
    productModifyData?.discount
      ? form.setFieldValue("discount", productModifyData?.discount)
      : form.setFieldValue("discount", 100);
    form.setFieldValue("currency", productModifyData?.currency?.currency);
    form.setFieldValue("productPrice", productModifyData?.productPrice);
    form.setFieldValue("weight", productModifyData?.weight);
    form.setFieldValue("stock", productModifyData?.stock);
    form.setFieldValue("commission", productModifyData?.commission);
    setCommission(productModifyData?.commission);
    form.setFieldValue("price", price);
    setExchangeRate(productModifyData?.currency?.exchangeRate);
    form.setFieldValue(
      "profit",
      Math.ceil((productModifyData?.productPrice - price) * 10) / 10
    );

    const savedCurrency = localStorage.getItem("exchangeCurrency");
    const savedSymbol = localStorage.getItem("exchangeSymbol");
    const savedRate = localStorage.getItem("exchangeRate");

    if (savedCurrency) {
      form.setFieldsValue({ currency: savedCurrency });
      setSelectedCurrency(savedCurrency);
      setSymbol(savedSymbol);
      setExchangeRate(Number(savedRate));
    }
  }, [productModifyData]);

  const onFinish = async () => {
    await form.validateFields();

    const modifyProductData = {
      productBrand: form.getFieldValue("productBrand"),
      productType: form.getFieldValue("productType"),
      productName: form.getFieldValue("productName"),
      productCost: form.getFieldValue("productCost"),
      weight: form.getFieldValue("weight"),
      discount: form.getFieldValue("discount"),
      currency: form.getFieldValue("currency"),
      productPrice: form.getFieldValue("productPrice"),
      stock: form.getFieldValue("stock"),
      commission: commission,
    };

    const result = await dispatch(createProduct(modifyProductData));

    if (result.meta.requestStatus === "fulfilled") {
      messageApi.open({
        type: "success",
        content: result.payload.msg,
      });
      setOpen(false);
      form.resetFields();
      dispatch(getAllProduct());
    } else {
      messageApi.open({
        type: "error",
        content: result.payload,
      });
    }
  };

  return (
    <Modal
      title={<h3> 編輯產品資料 </h3>}
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
            htmlType="submit"
          >
            確認
          </Button>
        </>
      }
      width={750}
    >
      <div>請填寫下列表格，編輯產品資料</div>
      <br />
      <Form
        {...formItemLayout}
        autoComplete="off"
        form={form}
        onFinish={onFinish}
      >
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
          <AutoComplete
            options={productTypeOptions}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
        </Form.Item>

        <Form.Item
          name="productName"
          label="產品"
          rules={[{ required: true, message: "請輸入產品" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="currency"
          label="貨幣"
          rules={[{ required: true, message: "請輸入產品成本" }]}
        >
          <Select
            showSearch
            options={currenciesOptions}
            onChange={(value) => {
              setSymbol(
                currenciesOptions?.find((currency) => currency.value === value)
                  ?.symbol
              );
              setSelectedCurrency(
                currenciesOptions?.find((currency) => currency.value === value)
                  ?.value
              );

              const rate = exchangeRateData.find(
                (exchangeRate) => exchangeRate.currency === value
              ).exchangeRate;
              setExchangeRate(rate);

              const formattedPrice = new Intl.NumberFormat().format(
                (form.getFieldValue("productCost") *
                  form.getFieldValue("discount")) /
                  rate /
                  100
              );

              form.setFieldValue("price", formattedPrice);
            }}
          />
        </Form.Item>

        <Form.Item label="成本" style={{ margin: "0" }}>
          <Space.Compact>
            <Form.Item
              name="productCost"
              rules={[{ required: true, message: "請輸入產品成本" }]}
              style={{ width: "63%" }}
            >
              <Input
                prefix={symbol}
                suffix={selectedCurrency}
                onChange={(e) => {
                  const calculatedPrice =
                    (e.target.value * form.getFieldValue("discount")) /
                    100 /
                    exchangeRate;

                  const formattedPrice = new Intl.NumberFormat().format(
                    calculatedPrice
                  );

                  const productPrice = form.getFieldValue("productPrice");

                  console.log(productPrice - calculatedPrice);
                  form.setFieldValue("price", formattedPrice);
                  form.setFieldValue(
                    "profit",
                    Math.ceil(productPrice - calculatedPrice * 10) / 10
                  );
                }}
              />
            </Form.Item>
            <Form.Item
              name="discount"
              rules={[{ required: true, message: "請輸入優惠" }]}
              style={{ width: "37%" }}
            >
              <Input
                prefix="x"
                defaultValue={100}
                suffix="%"
                style={{ width: "100%" }}
                onChange={(e) => {
                  const calculatedPrice =
                    ((e.target.value / 100) *
                      form.getFieldValue("productCost")) /
                    exchangeRate;
                  const formattedPrice = new Intl.NumberFormat().format(
                    calculatedPrice
                  );
                  const productPrice = form.getFieldValue("productPrice");
                  form.setFieldValue("price", formattedPrice);
                  form.setFieldValue(
                    "profit",
                    Math.ceil(productPrice - calculatedPrice * 10) / 10
                  );
                }}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item
          name="weight"
          label="重量"
          rules={[{ required: true, message: "請輸入產品重量" }]}
        >
          <Input
            suffix="公斤"
            onChange={(e) => {
              const cost = form.getFieldValue("productCost");
              const discount = form.getFieldValue("discount");
              const productPrice = form.getFieldValue("productPrice");
              const calculatedPrice =
                e.target.value * 25 + (cost * discount) / 100 / exchangeRate;
              const formattedPrice = new Intl.NumberFormat().format(
                calculatedPrice
              );

              if (productPrice) {
                form.setFieldValue(
                  "profit",
                  Math.ceil(productPrice - calculatedPrice * 10) / 10
                );
              }
              form.setFieldValue("price", formattedPrice);
            }}
          />
        </Form.Item>

        <Form.Item name="price" label="港元">
          <Input value={0} disabled />
        </Form.Item>

        <Form.Item name="commission" label="返點" valuePropName="checked">
          <Checkbox
            style={{ marginLeft: "10px" }}
            onChange={(e) => {
              setCommission(e.target.checked);
            }}
          />
        </Form.Item>

        <Form.Item
          name="productPrice"
          label="售價"
          rules={[{ required: true, message: "請輸入產品售價" }]}
        >
          <Input
            prefix="$"
            suffix="HKD"
            onChange={(e) => {
              form.setFieldValue(
                "profit",
                e.target.value - form.getFieldValue("price")
              );
            }}
          />
        </Form.Item>

        <Form.Item name="profit" label="盈利">
          <Input defaultValue={0} disabled />
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

export default memo(ProductCopyModal);

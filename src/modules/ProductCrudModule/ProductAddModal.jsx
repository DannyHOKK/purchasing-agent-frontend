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
} from "antd";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  getAllProduct,
} from "../../redux/product/productAction";
import currency from "../../staticData/currency.json";
import {
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

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

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 4,
    },
  },
};

const ProductAddModal = ({
  open,
  setOpen,
  productBrandOptions,
  messageApi,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [commission, setCommission] = useState(false);
  const { productData, productLoading } = useSelector((state) => state.product);
  const { exchangeRateData } = useSelector((state) => state.exchangeRate);
  const [productTypeOptions, setProductTypeOptions] = useState();
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
    form.setFieldValue("discount", 100);
    form.setFieldValue("stock", 0);
  }, [open]);

  const onFinish = async () => {
    await form.validateFields();

    const productColor = form
      .getFieldValue("productColor")
      .map((color) => color.color);

    const createProductData = {
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
      productColor: productColor,
    };

    const result = await dispatch(createProduct(createProductData));

    if (result.meta.requestStatus === "fulfilled") {
      setOpen(false);
      form.resetFields();
      dispatch(getAllProduct());
      messageApi.open({
        type: "success",
        content: "成功建立貨品",
      });
    } else {
      messageApi.open({
        type: "error",
        content: result.payload,
      });
    }
  };

  const addProductHandler = async () => {
    await form.validateFields();

    const productColor = form
      .getFieldValue("productColor")
      .map((color) => color.color);

    const createProductData = {
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
      productColor: productColor,
    };
    console.log(createProductData);

    const result = await dispatch(createProduct(createProductData));

    console.log(result);
    if (result.meta.requestStatus === "fulfilled") {
      dispatch(getAllProduct());
      messageApi.open({
        type: "success",
        content: "成功建立貨品",
      });
    } else {
      messageApi.open({
        type: "error",
        content: result.payload,
      });
    }
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
          <Button
            onClick={addProductHandler}
            style={{ backgroundColor: "blue", color: "white" }}
            loading={productLoading}
          >
            加貨品
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
            onChange={() => {
              productTypeHandler();
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
          />
        </Form.Item>

        <Form.Item
          name="productName"
          label="產品"
          rules={[{ required: true, message: "請輸入產品" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="顏色">
          <Form.List name="productColor">
            {(subFields, subOpt) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 16,
                }}
              >
                {subFields.map((subField) => (
                  <div key={subField.key} className=" d-flex">
                    <Form.Item
                      noStyle
                      name={[subField.name, "color"]}
                      rules={[
                        {
                          required: true,
                          message: "請輸入顏色",
                        },
                      ]}
                    >
                      <Input placeholder="顏色" />
                    </Form.Item>
                    <CloseOutlined
                      className=" ms-2"
                      onClick={() => {
                        subOpt.remove(subField.name);
                      }}
                    />
                  </div>
                ))}
                <Button type="dashed" onClick={() => subOpt.add()} block>
                  + 加顏色
                </Button>
              </div>
            )}
          </Form.List>
        </Form.Item>

        {/* <Form.Item label="顏色">
          <Form.List name="color">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      // marginBottom: 2,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "color"]}
                      rules={[
                        {
                          required: true,
                          message: "請輸入顏色",
                        },
                      ]}
                    >
                      <Input placeholder="顏色" />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    加顏色
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item> */}

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
                    Math.ceil(
                      ((e.target.value * form.getFieldValue("discount")) /
                        100 /
                        exchangeRate) *
                        10
                    ) / 10;

                  const formattedPrice = new Intl.NumberFormat().format(
                    calculatedPrice
                  );

                  form.setFieldValue("price", formattedPrice);
                  form.setFieldValue(
                    "profit",
                    form.getFieldValue("productPrice") - formattedPrice
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
                    Math.ceil(
                      (((e.target.value / 100) *
                        form.getFieldValue("productCost")) /
                        exchangeRate) *
                        10
                    ) / 10;
                  const formattedPrice = new Intl.NumberFormat().format(
                    calculatedPrice
                  );
                  form.setFieldValue("price", formattedPrice);
                  form.setFieldValue(
                    "profit",
                    form.getFieldValue("productPrice") - formattedPrice
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
                Math.ceil(
                  (e.target.value * 25 +
                    (cost * discount) / 100 / exchangeRate) *
                    10
                ) / 10;
              const formattedPrice = new Intl.NumberFormat().format(
                calculatedPrice
              );

              if (productPrice) {
                form.setFieldValue(
                  "profit",
                  Math.ceil((productPrice - formattedPrice) * 10) / 10
                );
              }
              form.setFieldValue("price", formattedPrice);
            }}
          />
        </Form.Item>

        <Form.Item name="price" label="港元">
          <Input defaultValue={0} disabled />
        </Form.Item>

        <Form.Item name="commission" label="返點">
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
                Math.ceil((e.target.value - form.getFieldValue("price")) * 10) /
                  10
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

export default memo(ProductAddModal);

import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductById,
  getAllProduct,
} from "../../redux/product/productAction";
import { Button, Popconfirm, Table, message } from "antd";
import ProductAddModal from "./ProductAddModal";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import ProductModifyModal from "./ProductModifyModal";
import ProductCopyModal from "./ProductCopyModal";
import { render } from "less";
import currency from "../../staticData/currency.json";

const ProductDataTable = ({ productLoading, productData }) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [open, setOpen] = useState(false);
  const [openCopy, setOpenCopy] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [productModifyData, setProductModifyData] = useState({});
  const dispatch = useDispatch();
  const { exchangeRateData } = useSelector((state) => state.exchangeRate);
  const { orderData } = useSelector((state) => state.order);
  const [messageApi, contextHolder] = message.useMessage();

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

  const orderQuantity = productData.map((product) => {
    return orderData
      .filter(
        (order) =>
          order?.product?.productName === product?.productName &&
          order?.paid === "已付款"
      )
      .map((order) => order?.quantity)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  });

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const refreshHandler = () => {
    dispatch(getAllProduct());
    console.log(productData);
  };

  const deleteProductHandler = async (productId) => {
    const result = await dispatch(deleteProductById(productId));
    if (result.meta.requestStatus === "fulfilled") {
      refreshHandler();
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

  const modifyProductHandle = async (product) => {
    setProductModifyData(product);
    setOpenModify(true);
  };

  const copyProductHandle = async (product) => {
    setProductModifyData(product);
    setOpenCopy(true);
  };

  const productBrand = productData
    .map((product) => product.productBrand)
    .filter(
      (productBrand, index, self) => self.indexOf(productBrand) === index
    );

  const productType = productData
    .map((product) => product.productType)
    .filter((productType, index, self) => self.indexOf(productType) === index);

  const productName = productData
    .map((product) => product.productName)
    .filter((productName, index, self) => self.indexOf(productName) === index);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "牌子",
      dataIndex: "productBrand",
      key: "productBrand",
      width: "80px",
      // fixed: "left",
      filterSearch: true,
      filters: productBrand?.map((productBrand, index) => ({
        text: productBrand,
        value: productBrand,
      })),
      filteredValue: filteredInfo.productBrand || null,
      onFilter: (value, record) => record.productBrand === value,
      sorter: (a, b) =>
        (a.productBrand || "").localeCompare(b.productBrand || "", "zh-HK", {
          sensitivity: "base",
        }),
      sortOrder:
        sortedInfo.columnKey === "productBrand" ? sortedInfo.order : null,
    },
    {
      title: "種類",
      dataIndex: "productType",
      key: "productType",
      width: "80px",
      filterSearch: true,
      filters: productType?.map((productType, index) => ({
        text: productType,
        value: productType,
      })),
      filteredValue: filteredInfo.productType || null,
      onFilter: (value, record) => record.productType === value,
      sorter: (a, b) =>
        (a.productType || "").localeCompare(b.productType || "", "zh-HK", {
          sensitivity: "base",
        }),
      sortOrder:
        sortedInfo.columnKey === "productType" ? sortedInfo.order : null,
    },
    {
      title: "產品",
      dataIndex: "productName",
      key: "productName",
      fixed: "left",
      width: "180px",
      filterSearch: true,
      filters: productName?.map((productName, index) => ({
        text: productName,
        value: productName,
      })),
      filteredValue: filteredInfo.productName || null,
      onFilter: (value, record) => record.productName === value,
      sorter: (a, b) =>
        (a.productName || "").localeCompare(b.productName || "", "zh-HK", {
          sensitivity: "base",
        }),
      sortOrder:
        sortedInfo.columnKey === "productName" ? sortedInfo.order : null,
    },
    {
      title: "尚欠",
      dataIndex: "needBuy",
      key: "needBuy",
      sorter: (a, b) => a.needBuy - b.needBuy,
      sortOrder: sortedInfo.columnKey === "needBuy" ? sortedInfo.order : null,

      render: (text, record) => {
        return <>{record.needBuy * -1}</>;
      },
    },
    {
      title: "返點",
      dataIndex: "commission",
      key: "commission",
      render: (text, record) => {
        return record.commission ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        );
      },
    },
    {
      title: "原價",
      dataIndex: "productCost",
      key: "productCost",
      render: (text, record) => {
        const symbol = currenciesOptions?.find(
          (currency) => currency.value === record.currency?.currency
        )?.symbol;

        return (
          <>
            {symbol}
            {record.productCost}
          </>
        );
      },
    },
    {
      title: "折扣",
      dataIndex: "discount",
      key: "discount",
      render: (text, record) => {
        return <>{record.discount}%</>;
      },
    },
    {
      title: "重量",
      dataIndex: "weight",
      key: "weight",
      render: (text, record) => {
        return <>{record.weight}kg</>;
      },
    },
    {
      title: "成本",
      dataIndex: "cost",
      key: "cost",
      render: (text, record) => {
        const weight = record.weight;
        const formattedPrice = new Intl.NumberFormat().format(
          Math.ceil(
            (record.cost / record.currency?.exchangeRate + weight * 25) * 10
          ) / 10
        );

        return <span style={{ color: "red" }}>HKD${formattedPrice}</span>;
      },
    },
    {
      title: "售價",
      dataIndex: "productPrice",
      key: "productPrice",
      render: (text, record) => {
        return <span style={{ color: "blue" }}>${record.productPrice}</span>;
      },
    },
    {
      title: "盈利",
      dataIndex: "profit",
      key: "profit",
      render: (text, record) => {
        const weight = record.weight;
        const formattedPrice = new Intl.NumberFormat().format(
          Math.ceil(
            (record.productPrice -
              (record.cost / record.currency?.exchangeRate + weight * 25)) *
              10
          ) / 10
        );
        return <span style={{ color: "green" }}>${formattedPrice}</span>;
      },
    },
    {
      title: "訂單數量",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "行動",
      key: "operation",
      render: (text, record) => {
        return (
          <>
            <Button
              className="mb-2 mb-sm-0"
              color="primary"
              variant="outlined"
              style={{
                marginRight: "5px",
              }}
              onClick={() => {
                modifyProductHandle(record);
              }}
            >
              更改
            </Button>
            <Popconfirm
              placement="topLeft"
              title="刪除訂單"
              description="是否確認刪除訂單?"
              onConfirm={() => {
                deleteProductHandler(record.productId);
              }}
              okText="刪除"
              cancelText="取消"
            >
              <Button
                className="mb-2 mb-sm-0"
                color="danger"
                variant="filled"
                style={{
                  marginRight: "5px",
                }}
              >
                刪除
              </Button>
            </Popconfirm>
            <Button
              variant="outlined"
              style={{
                backgroundColor: "#1da57a",
                color: "white",
              }}
              onClick={() => {
                copyProductHandle(record);
              }}
            >
              複製
            </Button>
          </>
        );
      },
    },
  ];

  const data = useMemo(
    () =>
      productData?.map((product, index) => ({
        id: index + 1,
        productId: product.productId,
        productBrand: product.productBrand,
        productCost: product.productCost,
        commission: product.commission,
        discount: product.discount,
        cost: product.productCost * product.discount * 0.01,
        productPrice: product.productPrice,
        productName: product.productName,
        productType: product.productType,
        weight: product.weight,
        quantity: (
          <>
            {orderQuantity[index]} ({product.stock})
          </>
        ),
        needBuy: orderQuantity[index] - product.stock,
        stock: product.stock,
        discount: product.discount,
        createDate: product.createDate.split(".")[0].replaceAll("T", " "),
        modifyDate: product.modifyDate.split(".")[0].replaceAll("T", " "),

        currency: product?.exchangeRate,
      })),
    [productData]
  );

  const productBrandOptions = useMemo(
    () =>
      productData
        ?.map((brand) => brand.productBrand)
        .filter((brand, index, self) => self.indexOf(brand) === index)
        .map((brand, index) => ({
          value: brand,
        })),
    [productData]
  );

  return (
    <div className="order-table-container mb-5 mb-sm-0 ">
      {contextHolder}
      <div>
        <div className=" d-flex justify-content-between m-4">
          <a onClick={() => window.history.back()} className="my-auto">
            <ArrowLeftOutlined />
          </a>
          <div>
            <Button className=" me-3" onClick={refreshHandler}>
              更新表格
            </Button>
            <Button
              style={{ backgroundColor: "#1da57a", color: "white" }}
              onClick={() => setOpen(true)}
            >
              <PlusOutlined />
              加產品資料
            </Button>
          </div>
        </div>
      </div>
      <Table
        size="middle"
        loading={productLoading}
        columns={columns}
        dataSource={data}
        pagination={{
          position: ["bottomCenter"],
          pageSize: 20,
        }}
        onChange={handleChange}
        scroll={{ x: "max-content" }}
      />
      <ProductAddModal
        open={open}
        setOpen={setOpen}
        productBrandOptions={productBrandOptions}
        messageApi={messageApi}
      />
      <ProductModifyModal
        open={openModify}
        setOpen={setOpenModify}
        productBrandOptions={productBrandOptions}
        productModifyData={productModifyData}
        messageApi={messageApi}
      />
      <ProductCopyModal
        open={openCopy}
        setOpen={setOpenCopy}
        productBrandOptions={productBrandOptions}
        productModifyData={productModifyData}
        messageApi={messageApi}
      />
    </div>
  );
};

export default ProductDataTable;

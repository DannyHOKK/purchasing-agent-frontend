import React, { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductById,
  getAllProduct,
  modifyProduct,
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
import { getExchangeRate } from "../../redux/exchangeRate/exchangeRateAction";
import { getAllOrders } from "../../redux/order/orderAction";
import { createSelector } from "@reduxjs/toolkit";
import { getAllProductStock } from "../../redux/productStock/productStockAction";

const selectCombinedData = createSelector(
  (state) => state.exchangeRate.exchangeRateData,
  (state) => state.product.productLoading,
  (state) => state.product.productData,
  (state) => state.order.orderData,
  (state) => state.productStock.productStockData,
  (
    exchangeRateData,
    productLoading,
    productData,
    orderData,
    productStockData
  ) => ({
    exchangeRateData,
    productLoading,
    productData,
    orderData,
    productStockData,
  })
);

const ProductDataTable = () => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [open, setOpen] = useState(false);
  const [openCopy, setOpenCopy] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [productModifyData, setProductModifyData] = useState({});
  const dispatch = useDispatch();

  const {
    exchangeRateData,
    productLoading,
    productData,
    orderData,
    productStockData,
  } = useSelector(selectCombinedData);

  // const { exchangeRateData } = useSelector((state) => state.exchangeRate);
  // const { productLoading, productData } = useSelector((state) => state.product);
  // const { orderData } = useSelector((state) => state.order);
  const [messageApi, contextHolder] = message.useMessage();
  const exchangeCurrency = exchangeRateData.map(
    (exchangeRate) => exchangeRate.currency
  );

  const packageName = localStorage.getItem("packageName")
    ? localStorage.getItem("packageName")
    : "預設";

  const { productBrand, productType, productName } = useMemo(() => {
    const uniqueBrands = new Set();
    const uniqueTypes = new Set();
    const uniqueNames = new Set();

    productData.forEach((product) => {
      uniqueBrands.add(product.productBrand);
      uniqueTypes.add(product.productType);
      uniqueNames.add(product.productName);
    });

    return {
      productBrand: Array.from(uniqueBrands),
      productType: Array.from(uniqueTypes),
      productName: Array.from(uniqueNames),
    };
  }, [productData]);

  useEffect(() => {
    dispatch(getAllProduct());
    dispatch(getExchangeRate());
    dispatch(getAllOrders(packageName));
    dispatch(getAllProductStock(packageName));
  }, []);

  useEffect(() => {
    dispatch(getAllOrders(packageName));
    dispatch(getAllProductStock(packageName));
  }, [packageName]);

  const currenciesOptions = useMemo(
    () =>
      currency.currenciesOptions
        .filter((option) => exchangeCurrency.includes(option.value))
        .map((currency) => ({
          value: currency.value,
          label: currency.label,
          symbol: currency.symbol,
        })),
    [currency.currenciesOptions, exchangeCurrency]
  ); // Dependencies: changes in these will trigger a recompute

  const orderQuantity = useMemo(
    () =>
      productData.map((product) => {
        return orderData
          .filter(
            (order) =>
              order?.product?.productName === product?.productName &&
              order?.paid === "已付款"
          )
          .map((order) => order?.quantity)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      }),
    [productData, orderData]
  ); // Dependencies: changes in these will trigger a recompute

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const refreshHandler = () => {
    dispatch(getAllProduct());
    dispatch(getAllProductStock(packageName));
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

  const updateQuantity = async (record, delta) => {
    const modifyProductData = {
      productId: record?.productId,
      productBrand: record.productBrand,
      productType: record.productType,
      productName: record.productName,
      productCost: record.productCost,
      weight: record.weight,
      currency: record.currency.currency,
      discount: record.discount,
      productPrice: record.productPrice,
      stock: record.stock + delta,
      commission: record.commission,
      packageName: packageName,
    };

    console.log(modifyProductData);

    const result = await dispatch(modifyProduct(modifyProductData));

    if (result.meta.requestStatus === "fulfilled") {
      messageApi.open({
        type: "success",
        content: result.payload.msg,
      });
      refreshHandler();
    } else {
      messageApi.open({
        type: "error",
        content: result.payload,
      });
    }
  };

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
        return (
          <>
            <Button size="small" onClick={() => updateQuantity(record, -1)}>
              -
            </Button>{" "}
            {record.needBuy * -1}{" "}
            <Button size="small" onClick={() => updateQuantity(record, 1)}>
              +
            </Button>
          </>
        );
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

        return <span style={{ color: "purple" }}>HKD${formattedPrice}</span>;
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
        return formattedPrice < 0 ? (
          <span style={{ color: "red" }}>${formattedPrice}</span>
        ) : (
          <span style={{ color: "green" }}>${formattedPrice}</span>
        );
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
      productData?.map((product, index) => {
        const stockData = productStockData?.find(
          (stockItem) => stockItem?.product?.productId === product.productId
        );

        return {
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
              {orderQuantity[index]} ({stockData ? stockData?.stock : 0})
            </>
          ),
          needBuy: orderQuantity[index] - (stockData ? stockData?.stock : 0),
          stock: stockData ? stockData?.stock : 0,
          discount: product.discount,
          createDate: product.createDate.split(".")[0].replaceAll("T", " "),
          modifyDate: product.modifyDate.split(".")[0].replaceAll("T", " "),

          currency: product?.exchangeRate,
        };
      }),
    [productData, productStockData]
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
          pageSize: 50,
        }}
        onChange={() => {
          handleChange;
        }}
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
        packageName={packageName}
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

export default memo(ProductDataTable);

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductById,
  getAllProduct,
} from "../../redux/product/productAction";
import { Button, Popconfirm, Table, message } from "antd";
import ProductAddModal from "./ProductAddModal";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import ProductModifyModal from "./ProductModifyModal";

const ProductDataTable = ({ productLoading, productData }) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [productModifyData, setProductModifyData] = useState({});
  const dispatch = useDispatch();

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const refreshHandler = () => {
    dispatch(getAllProduct());
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
      // filters: customerPhone?.map((phone, index) => ({
      //   text: phone,
      //   value: phone,
      // })),
      // filteredValue: filteredInfo.phone || null,
      // onFilter: (value, record) => record.phone === value,
      // sorter: (a, b) => a.phone.length - b.phone.length,
      // sortOrder: sortedInfo.columnKey === "phone" ? sortedInfo.order : null,
      // ellipsis: true,
    },
    {
      title: "種類",
      dataIndex: "productType",
      key: "productType",
    },
    {
      title: "產品",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "成本",
      dataIndex: "productCost",
      key: "productCost",
    },
    {
      title: "售價",
      dataIndex: "productPrice",
      key: "productPrice",
    },
    {
      title: "訂單數量",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "存貨",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "建立日期",
      dataIndex: "createDate",
      key: "createDate",
      width: "180px",
      // sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
      // sortOrder:
      //   sortedInfo.columnKey === "createDate" ? sortedInfo.order : null,
      // ellipsis: true,
    },
    {
      title: "更改日期",
      dataIndex: "modifyDate",
      key: "modifyDate",
      width: "180px",
      // sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
      // sortOrder:
      //   sortedInfo.columnKey === "createDate" ? sortedInfo.order : null,
      // ellipsis: true,
    },
    {
      title: "行動",
      key: "operation",
      minWidth: "180px",
      render: (text, record) => {
        return (
          <>
            <Button
              color="primary"
              variant="outlined"
              style={{
                marginRight: "10px",
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
                deleteProductHandler(record.id);
              }}
              okText="刪除"
              cancelText="取消"
            >
              <Button color="danger" variant="filled">
                刪除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const data = productData?.map((product, index) => ({
    id: product.productId,
    productBrand: product.productBrand,
    productCost: product.productCost * product.discount,
    productPrice: product.productPrice,
    productName: product.productName,
    productType: product.productType,
    quantity: product.quantity,
    stock: product.stock,
    discount: product.discount * 100,
    createDate: product.createDate.split(".")[0].replaceAll("T", " "),
    modifyDate: product.modifyDate.split(".")[0].replaceAll("T", " "),
  }));

  const productBrandOptions = productData
    ?.map((brand) => brand.productBrand)
    .filter((brand, index, self) => self.indexOf(brand) === index)
    .map((brand, index) => ({
      value: brand,
    }));

  return (
    <div className="order-table-container">
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
        loading={productLoading}
        columns={columns}
        dataSource={data}
        pagination={{
          position: ["bottomCenter"],
        }}
        onChange={handleChange}
        style={{ minWidth: "850px" }}
      />
      <ProductAddModal
        open={open}
        setOpen={setOpen}
        productBrandOptions={productBrandOptions}
      />
      <ProductModifyModal
        open={openModify}
        setOpen={setOpenModify}
        productBrandOptions={productBrandOptions}
        productModifyData={productModifyData}
      />
    </div>
  );
};

export default ProductDataTable;

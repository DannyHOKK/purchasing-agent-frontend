import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getAllProduct } from "../../redux/product/productAction";
import { Button, Table } from "antd";
import ProductAddModal from "./ProductAddModal";
import { PlusOutlined } from "@ant-design/icons";

const ProductDataTable = ({ productLoading, productData }) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const refreshHandler = () => {
    dispatch(getAllProduct());
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "60px",
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
  ];

  const data = productData?.map((product, index) => ({
    id: product.productId,
    productBrand: product.productBrand,
    productCost: product.productCost,
    productPrice: product.productPrice,
    productName: product.productName,
    productType: product.productType,
    quantity: product.quantity,
    stock: product.stock,
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
      <div>
        <div className=" d-flex justify-content-between m-4">
          <div>--</div>
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
        onChange={handleChange}
        style={{ minWidth: "850px" }}
      />
      <ProductAddModal
        open={open}
        setOpen={setOpen}
        productBrandOptions={productBrandOptions}
      />
    </div>
  );
};

export default ProductDataTable;

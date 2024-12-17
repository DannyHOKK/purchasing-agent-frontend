import { Badge, Table } from "antd";
import React, { useState } from "react";

const OrderDataTable = ({ orderLoading, orderData }) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const customerPhone = orderData
    .map((order) => order.customer.phone)
    .filter((phone, index, self) => self.indexOf(phone) === index);

  const productBrand = orderData
    .map((order) => order.product.productBrand)
    .filter(
      (productBrand, index, self) => self.indexOf(productBrand) === index
    );

  const productName = orderData
    .map((order) => order.product.productName)
    .filter((productName, index, self) => self.indexOf(productName) === index);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "60px",
    },
    {
      title: "電話",
      dataIndex: "phone",
      key: "phone",
      filters: customerPhone.map((phone, index) => ({
        text: phone,
        value: phone,
      })),
      filteredValue: filteredInfo.phone || null,
      onFilter: (value, record) => record.phone === value,
      sorter: (a, b) => a.phone.length - b.phone.length,
      sortOrder: sortedInfo.columnKey === "phone" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "牌子",
      dataIndex: "productBrand",
      key: "productBrand",
      filters: productBrand.map((brand, index) => ({
        text: brand,
        value: brand,
      })),
      filteredValue: filteredInfo.productBrand || null,
      onFilter: (value, record) => record.productBrand === value,
      sorter: (a, b) => a.productBrand.length - b.productBrand.length,
      sortOrder:
        sortedInfo.columnKey === "productBrand" ? sortedInfo.order : null,
      ellipsis: true,
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
      filters: productName.map((brand, index) => ({
        text: brand,
        value: brand,
      })),
      filteredValue: filteredInfo.productName || null,
      onFilter: (value, record) => record.productName === value,
      sorter: (a, b) => a.productName.length - b.productName.length,
      sortOrder:
        sortedInfo.columnKey === "productName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "數量",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "付款",
      dataIndex: "paid",
      key: "paid",
      filters: [
        {
          text: "已付款",
          value: "已付款",
        },
        {
          text: "未付款",
          value: "未付款",
        },
      ],
      filteredValue: filteredInfo.paid || null,
      onFilter: (value, record) => record.paid.props.children === value,
      ellipsis: true,
    },
    {
      title: "運輸",
      dataIndex: "takeMethod",
      key: "takeMethod",
    },
    {
      title: "付款方法",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      filters: [
        {
          text: "PAYME",
          value: "PAYME",
        },
        {
          text: "FPS",
          value: "FPS",
        },
        {
          text: "ALIPAY",
          value: "ALIPAY",
        },
      ],
      filteredValue: filteredInfo.paymentMethod || null,
      onFilter: (value, record) => record.paymentMethod === value,
      ellipsis: true,
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "狀態",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "落單時間",
      dataIndex: "createDate",
      key: "createDate",
      width: "180px",
    },
    {
      title: "行動",
      key: "operation",
      //   render: (text, record) => {
      //     if (record.certificationProof === true) {
      //       return (
      //         <>
      //           <Button
      //             style={{
      //               backgroundColor: "red",
      //               color: "white",
      //             }}
      //             onClick={() => disqualifyCertHandler(record.id)}
      //           >
      //             取消認證
      //           </Button>
      //         </>
      //       );
      //     } else {
      //       return (
      //         <>
      //           <Button
      //             style={{ backgroundColor: "green", color: "white" }}
      //             onClick={() => verifyCertHandler(record.id)}
      //           >
      //             認證學歷
      //           </Button>
      //         </>
      //       );
      //     }
      //   },
    },
  ];

  const data = orderData.map((order, index) => ({
    id: order.orderId,
    phone: order.customer.phone,
    productBrand: order.product.productBrand,
    productType: order.product.productType,
    productName: order.product.productName,
    quantity: order.quantity,
    paid: order.paid ? <>已付款</> : <>未付款</>,
    takeMethod: order.takeMethod,
    paymentMethod: order.paymentMethod,
    remark: order.remark,
    createDate: order?.createDate.split(".")[0].replaceAll("T", " "),
    status: (
      <>
        {order.status === "已付款" && (
          <Badge status="processing" text="已付款" />
        )}
        {order.status === "未付款" && <Badge status="error" text="未付款" />}
      </>
    ),
  }));

  return (
    <div className="order-table-container">
      <Table
        loading={orderLoading}
        columns={columns}
        dataSource={data}
        onChange={handleChange}
        style={{ minWidth: "1000px" }}
      />
    </div>
  );
};

export default OrderDataTable;

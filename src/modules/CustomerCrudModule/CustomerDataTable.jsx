import { Badge, Table, Button } from "antd";
import React, { useState } from "react";
import CustomerAddModal from "./CustomerAddModal";
import { useDispatch } from "react-redux";
import { getAllCustomer } from "../../redux/customer/customerAction";
import { PlusOutlined } from "@ant-design/icons";

const CustomerDataTable = ({ customerLoading, customerData }) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const refreshHandler = () => {
    dispatch(getAllCustomer());
  };

  const customerPhone = customerData
    ?.map((customer) => customer.phone)
    .filter((phone, index, self) => self.indexOf(phone) === index);

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
      filters: customerPhone?.map((phone, index) => ({
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
      title: "Instagram",
      dataIndex: "instagram",
      key: "instagram",
    },
    {
      title: "郵寄地址",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "建立日期",
      dataIndex: "createDate",
      key: "createDate",
      width: "180px",
      sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
      sortOrder:
        sortedInfo.columnKey === "createDate" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "更改日期",
      dataIndex: "modifyDate",
      key: "modifyDate",
      width: "180px",
      sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
      sortOrder:
        sortedInfo.columnKey === "createDate" ? sortedInfo.order : null,
      ellipsis: true,
    },
  ];

  const data = customerData?.map((customer, index) => ({
    id: customer.customerId,
    phone: customer.phone ? customer.phone : <>-</>,
    instagram: customer.instagram ? customer.instagram : <>-</>,
    shippingAddress: customer.shippingAddress ? (
      customer.shippingAddress
    ) : (
      <>-</>
    ),
    remark: customer.remark ? customer.remark : <>-</>,
    createDate: customer?.createDate.split(".")[0].replaceAll("T", " "),
    modifyDate: customer?.modifyDate.split(".")[0].replaceAll("T", " "),
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
              加客人資料
            </Button>
          </div>
        </div>
      </div>
      <Table
        loading={customerLoading}
        columns={columns}
        dataSource={data}
        onChange={handleChange}
        style={{ minWidth: "850px" }}
      />
      <CustomerAddModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default CustomerDataTable;

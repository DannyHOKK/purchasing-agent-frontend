import { Badge, Table, Button, message, Popconfirm } from "antd";
import React, { useEffect, useRef, useState } from "react";
import CustomerAddModal from "./CustomerAddModal";
import { useDispatch } from "react-redux";
import {
  deleteCustomer,
  getAllCustomer,
} from "../../redux/customer/customerAction";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import CustomerModifyModal from "./CustomerModifyModal";

const CustomerDataTable = ({ customerLoading, customerData }) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [openModify, setOpenModify] = useState(false);
  const [customerModifyData, setCustomerModifyData] = useState({});
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const refreshHandler = () => {
    dispatch(getAllCustomer());
  };

  const deleteCustomerHandler = async (customerId) => {
    const result = await dispatch(deleteCustomer(customerId));

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

  const modifyCustomerHandle = (customer) => {
    setCustomerModifyData(customer);
    setOpenModify(true);
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
      render: (text, record) => {
        return record.phone ? record.phone : <>-</>;
      },
    },
    {
      title: "Instagram",
      dataIndex: "instagram",
      key: "instagram",
      render: (text, record) => {
        return record.instagram ? record.instagram : <>-</>;
      },
    },
    {
      title: "郵寄地址",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      render: (text, record) => {
        return record.shippingAddress ? record.shippingAddress : <>-</>;
      },
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: (text, record) => {
        return record.remark ? record.remake : <>-</>;
      },
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
    {
      title: "行動",
      key: "operation",
      width: "180px",
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
                modifyCustomerHandle(record);
              }}
            >
              更改
            </Button>
            <Popconfirm
              placement="topLeft"
              title="刪除訂單"
              description="是否確認刪除訂單?"
              onConfirm={() => {
                deleteCustomerHandler(record.id);
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

  const data = customerData?.map((customer, index) => ({
    id: customer.customerId,
    phone: customer.phone ? customer.phone : null,
    instagram: customer.instagram ? customer.instagram : null,
    shippingAddress: customer.shippingAddress ? customer.shippingAddress : null,
    remark: customer.remark ? customer.remark : null,
    createDate: customer?.createDate?.split(".")[0]?.replaceAll("T", " "),
    modifyDate: customer?.modifyDate?.split(".")[0]?.replaceAll("T", " "),
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
              加客人資料
            </Button>
          </div>
        </div>
      </div>
      <Table
        loading={customerLoading}
        columns={columns}
        dataSource={data}
        pagination={{
          position: ["bottomCenter"],
        }}
        onChange={handleChange}
        style={{ minWidth: "850px" }}
      />
      <CustomerAddModal open={open} setOpen={setOpen} />
      <CustomerModifyModal
        openModify={openModify}
        setOpenModify={setOpenModify}
        customerModifyData={customerModifyData}
      />
    </div>
  );
};

export default CustomerDataTable;

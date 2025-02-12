import { Badge, Table, Button, message, Popconfirm } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import CustomerAddModal from "./CustomerAddModal";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCustomer,
  getAllCustomer,
} from "../../redux/customer/customerAction";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import CustomerModifyModal from "./CustomerModifyModal";

const CustomerDataTable = () => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [openModify, setOpenModify] = useState(false);
  const [customerModifyData, setCustomerModifyData] = useState({});
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const { customerLoading, customerData } = useSelector(
    (state) => state.customer
  );

  useEffect(() => {
    dispatch(getAllCustomer());
  }, []);

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

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "電話",
      dataIndex: "phone",
      key: "phone",
      fixed: "left",
      sorter: (a, b) =>
        (a.phone || "").localeCompare(b.phone || "", "zh-HK", {
          sensitivity: "base",
        }),
      sortOrder: sortedInfo.columnKey === "phone" ? sortedInfo.order : null,

      render: (text, record) => {
        return record.phone ? record.phone : <>-</>;
      },
    },
    {
      title: "Instagram",
      dataIndex: "instagram",
      key: "instagram",
      fixed: "left",
      sorter: (a, b) =>
        (a.instagram || "").localeCompare(b.instagram || "", "zh-HK", {
          sensitivity: "base",
        }),
      sortOrder: sortedInfo.columnKey === "instagram" ? sortedInfo.order : null,

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
        return record.remark ? record.remark : <>-</>;
      },
    },
    {
      title: "建立日期",
      dataIndex: "createDate",
      key: "createDate",
      sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
      sortOrder:
        sortedInfo.columnKey === "createDate" ? sortedInfo.order : null,
    },
    {
      title: "更改日期",
      dataIndex: "modifyDate",
      key: "modifyDate",
      sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
      sortOrder:
        sortedInfo.columnKey === "createDate" ? sortedInfo.order : null,
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
                deleteCustomerHandler(record.customerId);
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

  const data = useMemo(
    () =>
      customerData?.map((customer, index) => ({
        id: index + 1,
        customerId: customer.customerId,
        phone: customer.phone ? customer.phone : null,
        instagram: customer.instagram ? customer.instagram : null,
        shippingAddress: customer.shippingAddress
          ? customer.shippingAddress
          : null,
        remark: customer.remark ? customer.remark : null,
        createDate: customer?.createDate?.split(".")[0]?.replaceAll("T", " "),
        modifyDate: customer?.modifyDate?.split(".")[0]?.replaceAll("T", " "),
      })),
    [customerData]
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
              加客人資料
            </Button>
          </div>
        </div>
      </div>
      <Table
        size="middle"
        loading={customerLoading}
        columns={columns}
        dataSource={data}
        pagination={{
          position: ["bottomCenter"],
          pageSize: 50,
        }}
        onChange={handleChange}
        scroll={{ x: "max-content" }}
      />
      <CustomerAddModal open={open} setOpen={setOpen} messageApi={messageApi} />
      <CustomerModifyModal
        openModify={openModify}
        setOpenModify={setOpenModify}
        customerModifyData={customerModifyData}
        messageApi={messageApi}
      />
    </div>
  );
};

export default CustomerDataTable;

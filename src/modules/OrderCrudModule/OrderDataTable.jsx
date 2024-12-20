import { Badge, Button, Popconfirm, Table, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import OrderAddModal from "./OrderAddModal";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  changeStatusOrder,
  deleteOrderById,
  getAllOrders,
} from "../../redux/order/orderAction";
import OrderModifyModal from "./OrderModifyModal";

const OrderDataTable = ({ orderLoading, orderData, productData }) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [orderModifyData, setOrderModifyData] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const dispatch = useDispatch();

  const customerPhone = orderData
    .map((order) =>
      order.customer?.phone ? order.customer?.phone : order?.customer?.instagram
    )
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
      width: "50px",
    },
    {
      title: "電話/IG",
      dataIndex: "phone",
      key: "phone",
      filters: customerPhone?.map((phone, index) => ({
        text: phone,
        value: phone,
      })),
      filteredValue: filteredInfo.phone || null,
      onFilter: (value, record) => record.phone === value,
      sorter: (a, b) =>
        (parseInt(b.phone, 10) || 0) - (parseInt(a.phone, 10) || 0), // Sort by phone value

      sortOrder: sortedInfo.columnKey === "phone" ? sortedInfo.order : null,
      ellipsis: true,
      render: (text, record) => {
        return record.phone !== null ? record.phone : record.instagram;
      },
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
      title: "產品",
      dataIndex: "productName",
      key: "productName",
      filters: productName.map((brand, index) => ({
        text: brand,
        value: brand,
      })),
      filteredValue: filteredInfo.productName || null,
      onFilter: (value, record) => record.productName === value,
      sorter: (a, b) =>
        (a.productName || "").localeCompare(b.productName || "", "zh-HK", {
          sensitivity: "base",
        }),
      sortOrder:
        sortedInfo.columnKey === "productName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "售價",
      dataIndex: "productPrice",
      key: "productPrice",
    },
    {
      title: "數量",
      dataIndex: "quantity",
      key: "quantity",
      width: "60px",
    },
    {
      title: "付款",
      dataIndex: "paid",
      key: "paid",
      filters: [
        {
          text: "已付款",
          value: true,
        },
        {
          text: "未付款",
          value: false,
        },
      ],
      filteredValue: filteredInfo.paid || null,
      onFilter: (value, record) => record.paid === value,
      ellipsis: true,
      render: (text, record) => {
        return record?.paid === true ? (
          <Popconfirm
            placement="top"
            title="更改為未付款"
            onConfirm={() => {
              changeStatusOrderHandler(record?.orderId, false);
            }}
            okText="更改"
            cancelText="取消"
          >
            <Tag
              color="green"
              style={{ margin: "0 auto", justifyContent: "center" }}
            >
              已付款
            </Tag>
          </Popconfirm>
        ) : (
          <Popconfirm
            placement="top"
            title="更改為已付款"
            onConfirm={() => {
              changeStatusOrderHandler(record?.orderId, true);
            }}
            okText="更改"
            cancelText="取消"
          >
            <Tag
              color="red"
              style={{ margin: "0 auto", justifyContent: "center" }}
            >
              未付款
            </Tag>
          </Popconfirm>
        );
      },
    },
    {
      title: "運輸",
      dataIndex: "takeMethod",
      key: "takeMethod",
      width: "80px",
      filters: [
        {
          text: "自取",
          value: "自取",
        },
        {
          text: "郵寄",
          value: "郵寄",
        },
      ],
      filteredValue: filteredInfo.takeMethod || null,
      onFilter: (value, record) => {
        console.log(record);
        return record.takeMethod === value;
      },
      ellipsis: true,
      render: (text, record) => {
        if (record.takeMethod === "自取") {
          return (
            <>
              <Tag
                color="pink"
                style={{ margin: "0 auto", justifyContent: "center" }}
              >
                自取
              </Tag>
            </>
          );
        } else if (record.takeMethod === "郵寄") {
          return (
            <Tag
              color="yellow"
              style={{
                margin: "0 auto",
                justifyContent: "center",
                border: "1px solid #E1E100",
              }}
            >
              郵寄
            </Tag>
          );
        }
      },
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
        {
          text: "BANK",
          value: "BANK",
        },
        {
          text: "PAYCARMEN",
          value: "PAYCARMEN",
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
      render: (text, record) => {
        return (
          <>
            {record.status === "已付款" && (
              <Badge status="processing" text="已付款" />
            )}
            {record.status === "未付款" && (
              <Badge status="error" text="未付款" />
            )}
            {record.status === "已寄" && <Badge status="success" text="已寄" />}
            {record.status === "已自取" && (
              <Badge status="success" text="已自取" />
            )}
          </>
        );
      },
    },
    {
      title: "落單時間",
      dataIndex: "createDate",
      key: "createDate",
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
              onClick={() => modifyOrderHandler(record)}
            >
              更改
            </Button>
            <Popconfirm
              placement="topLeft"
              title="刪除訂單"
              description="是否確認刪除訂單?"
              onConfirm={() => {
                deleteOrderHandler(record.orderId);
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

  const data = orderData?.map((order, index) => ({
    id: index + 1,
    orderId: order.orderId,
    phone: order?.customer?.phone,
    instagram: order?.customer?.instagram,
    productBrand: order?.product?.productBrand,
    productName: order?.product?.productName,
    productPrice: <>${order?.product?.productPrice}</>,
    quantity: order?.quantity,
    paid: order?.paid,
    takeMethod: order?.takeMethod,
    paymentMethod: order?.paymentMethod,
    remark: order?.remark,
    createDate: order?.createDate.split(".")[0].replaceAll("T", " "),
    status: order?.status,
  }));

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const refreshHandler = () => {
    dispatch(getAllOrders());
  };

  const deleteOrderHandler = async (orderId) => {
    const result = await dispatch(deleteOrderById(orderId));
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

  const changeStatusOrderHandler = async (orderId, paid) => {
    const orderStatusDTO = {
      orderId: orderId,
      paid: paid,
    };
    const result = await dispatch(changeStatusOrder(orderStatusDTO));

    if (result.meta.requestStatus === "fulfilled") {
      refreshHandler();
      // messageApi.open({
      //   type: "success",
      //   content: result.payload.msg,
      // });
    }
  };

  const modifyOrderHandler = async (orderData) => {
    setOrderModifyData(orderData);
    setOpenModify(true);
  };

  return (
    <div className="order-table-container">
      {contextHolder}
      <div className=" d-flex justify-content-between p-4">
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
            加訂單
          </Button>
        </div>
      </div>
      <Table
        loading={orderLoading}
        columns={columns}
        dataSource={data}
        pagination={{
          position: ["bottomCenter"],
        }}
        onChange={handleChange}
        style={{ minWidth: "850px" }}
      />
      <OrderAddModal open={open} setOpen={setOpen} messageApi={messageApi} />
      <OrderModifyModal
        openModify={openModify}
        setOpenModify={setOpenModify}
        orderModifyData={orderModifyData}
      />
    </div>
  );
};

export default OrderDataTable;

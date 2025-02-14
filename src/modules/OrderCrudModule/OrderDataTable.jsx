import {
  Badge,
  Button,
  Dropdown,
  Popconfirm,
  Select,
  Switch,
  Table,
  Tag,
  message,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import OrderAddModal from "./OrderAddModal";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  changePaidOrder,
  changeTakeMethodOrder,
  changeStatusOrder,
  deleteOrderById,
  getAllOrders,
  changePaymentMethod,
} from "../../redux/order/orderAction";
import OrderModifyModal from "./OrderModifyModal";
import OrderPackagingModal from "./OrderPackagingModal";

const OrderDataTable = () => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [orderModifyData, setOrderModifyData] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [openPackaging, setOpenPackaging] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isEnableRowSelection, setIsEnableRowSelection] = useState(false);
  const dispatch = useDispatch();

  const { orderLoading, orderData, orderPackageName } = useSelector(
    (state) => state.order
  );

  const packageName = localStorage.getItem("packageName")
    ? localStorage.getItem("packageName")
    : "預設";

  const packgeNameSet = new Set(orderPackageName);
  packgeNameSet.add("預設"); // Ensures "預設" is always included

  const packgeNameList = [...packgeNameSet].map((packageName) => ({
    value: packageName,
    label: packageName,
  }));

  const { customerPhone, productBrand, productName } = useMemo(() => {
    const result = orderData.reduce(
      (acc, order) => {
        // Get phone or Instagram based on orderPlatform
        const contact =
          order.orderPlatform === "phone"
            ? order.customer.phone
            : order.customer.instagram;
        // Add to customerPhones if unique
        if (!acc.customerPhone.includes(contact)) {
          acc.customerPhone.push(contact);
        }

        // Add to productBrands if unique
        if (!acc.productBrand.includes(order.product.productBrand)) {
          acc.productBrand.push(order.product.productBrand);
        }

        // Add to productNames if unique
        if (!acc.productName.includes(order.product.productName)) {
          acc.productName.push(order.product.productName);
        }

        return acc;
      },
      { customerPhone: [], productBrand: [], productName: [] }
    );

    return result;
  }, [orderData]);

  const columns = useMemo(() => {
    console.log("rerender columns");
    return [
      {
        title: "#",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "電話/IG",
        dataIndex: "showOrderName",
        key: "showOrderName",
        filterSearch: true,
        filters: customerPhone?.map((phone, index) => {
          return {
            text: phone,
            value: phone,
          };
        }),
        filteredValue: filteredInfo.showOrderName || null,
        onFilter: (value, record) => record.showOrderName === value,
        sorter: (a, b) => {
          const valueA = a.showOrderName.toString().toLowerCase();
          const valueB = b.showOrderName.toString().toLowerCase();

          if (valueA < valueB) return -1;
          if (valueA > valueB) return 1;
          return 0;
        },

        sortOrder:
          sortedInfo.columnKey === "showOrderName" ? sortedInfo.order : null,
      },
      {
        title: "牌子",
        dataIndex: "productBrand",
        key: "productBrand",
        filters: productBrand?.map((brand, index) => ({
          text: brand,
          value: brand,
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
        title: "產品",
        dataIndex: "productName",
        key: "productName",
        filterSearch: true,
        filters: productName?.map((brand, index) => ({
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
      },
      {
        title: "狀態",
        dataIndex: "status",
        key: "status",
        filters: [
          {
            text: "備貨中",
            value: "備貨中",
          },
          {
            text: "已取",
            value: "已取",
          },
          {
            text: "已寄出",
            value: "已寄出",
          },
          {
            text: "斷貨",
            value: "斷貨",
          },
          {
            text: "已通知",
            value: "已通知",
          },
          {
            text: "在倉",
            value: "在倉",
          },
        ],
        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => record.status === value,
        render: (text, record) => {
          const items = [
            {
              label: (
                <a
                  onClick={() => {
                    changeStatusOrderHandler(record.orderId, "備貨中");
                  }}
                >
                  備貨中
                </a>
              ),
              key: "0",
            },
            {
              label: (
                <a
                  onClick={() => {
                    changeStatusOrderHandler(record.orderId, "已通知");
                  }}
                >
                  已通知
                </a>
              ),
              key: "4",
            },
            {
              label: (
                <a
                  onClick={() => {
                    changeStatusOrderHandler(record.orderId, "在倉");
                  }}
                >
                  在倉
                </a>
              ),
              key: "5",
            },
            {
              label: (
                <a
                  onClick={() => {
                    changeStatusOrderHandler(record.orderId, "已寄出");
                  }}
                >
                  已寄出
                </a>
              ),
              key: "1",
            },
            {
              label: (
                <a
                  onClick={() => {
                    changeStatusOrderHandler(record.orderId, "已取");
                  }}
                >
                  已取
                </a>
              ),
              key: "2",
            },
            {
              label: (
                <a
                  onClick={() => {
                    changeStatusOrderHandler(record.orderId, "斷貨");
                  }}
                >
                  斷貨
                </a>
              ),
              key: "3",
            },
          ];
          return (
            <>
              {record.status === "備貨中" && (
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <Badge status="processing" text="備貨中" />
                </Dropdown>
              )}
              {record.status === "已寄出" && (
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <Badge status="processing" color="yellow" text="已寄出" />
                </Dropdown>
              )}
              {record.status === "已取" && (
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <Badge status="processing" color="pink" text="已取" />
                </Dropdown>
              )}
              {record.status === "斷貨" && (
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <Badge status="default" color="red" text="斷貨" />
                </Dropdown>
              )}
              {record.status === "在倉" && (
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <Badge status="processing" color="volcano" text="在倉" />
                </Dropdown>
              )}
              {record.status === "已通知" && (
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <Badge status="processing" color="lime" text="已通知" />
                </Dropdown>
              )}
            </>
          );
        },
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
          {
            text: "已退款",
            value: "已退款",
          },
        ],
        filteredValue: filteredInfo.paid || null,
        onFilter: (value, record) => record.paid === value,

        render: (text, record) => {
          const items = [
            {
              label: (
                <a
                  onClick={() => {
                    changepaidOrderHandler(record.orderId, "已付款");
                  }}
                >
                  已付款
                </a>
              ),
              key: "0",
            },
            {
              label: (
                <a
                  onClick={() => {
                    changepaidOrderHandler(record.orderId, "未付款");
                  }}
                >
                  未付款
                </a>
              ),
              key: "1",
            },
            {
              label: (
                <a
                  onClick={() => {
                    changepaidOrderHandler(record.orderId, "已退款");
                  }}
                >
                  已退款
                </a>
              ),
              key: "2",
            },
          ];

          return record?.paid === "已付款" ? (
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Tag
                color="green"
                style={{ margin: "0 auto", justifyContent: "center" }}
              >
                已付款
              </Tag>
            </Dropdown>
          ) : record?.paid === "未付款" ? (
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Tag
                color="red"
                style={{ margin: "0 auto", justifyContent: "center" }}
              >
                未付款
              </Tag>
            </Dropdown>
          ) : (
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Tag
                color="#AAB7B8"
                style={{ margin: "0 auto", justifyContent: "center" }}
              >
                已退款
              </Tag>
            </Dropdown>
          );
        },
      },
      {
        title: "運輸",
        dataIndex: "takeMethod",
        key: "takeMethod",
        filters: [
          {
            text: "自取",
            value: "自取",
          },
          {
            text: "郵寄",
            value: "郵寄",
          },
          {
            text: "未知",
            value: "未知",
          },
        ],
        filteredValue: filteredInfo.takeMethod || null,
        onFilter: (value, record) => {
          return record.takeMethod === value;
        },

        render: (text, record) => {
          const items = [
            {
              label: (
                <a
                  onClick={() => {
                    changeTakeMethodOrderHandler(record.orderId, "自取");
                  }}
                >
                  自取
                </a>
              ),
              key: "0",
            },
            {
              label: (
                <a
                  onClick={() => {
                    changeTakeMethodOrderHandler(record.orderId, "郵寄");
                  }}
                >
                  郵寄
                </a>
              ),
              key: "1",
            },
            {
              label: (
                <a
                  onClick={() => {
                    changeTakeMethodOrderHandler(record.orderId, "未知");
                  }}
                >
                  未知
                </a>
              ),
              key: "2",
            },
          ];

          if (record.takeMethod === "自取") {
            return (
              <Dropdown menu={{ items }} trigger={["click"]}>
                <Tag
                  color="pink"
                  style={{ margin: "0 auto", justifyContent: "center" }}
                >
                  自取
                </Tag>
              </Dropdown>
            );
          } else if (record.takeMethod === "郵寄") {
            return (
              <Dropdown menu={{ items }} trigger={["click"]}>
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
              </Dropdown>
            );
          } else if (record.takeMethod === "未知") {
            return (
              <Dropdown menu={{ items }} trigger={["click"]}>
                <Tag
                  color="red"
                  style={{
                    margin: "0 auto",
                    justifyContent: "center",
                    border: "1px solid #E1E100",
                  }}
                >
                  未知
                </Tag>
              </Dropdown>
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
        render: (text, record) => {
          const items = [
            {
              label: (
                <a
                  onClick={() => {
                    changePaymentMethodHandler(record.orderId, "PAYME");
                  }}
                >
                  PAYME
                </a>
              ),
              key: "0",
            },
            {
              label: (
                <a
                  onClick={() => {
                    changePaymentMethodHandler(record.orderId, "FPS");
                  }}
                >
                  FPS
                </a>
              ),
              key: "1",
            },
            {
              label: (
                <a
                  onClick={() => {
                    changePaymentMethodHandler(record.orderId, "ALIPAY");
                  }}
                >
                  ALIPAY
                </a>
              ),
              key: "2",
            },
            {
              label: (
                <a
                  onClick={() => {
                    changePaymentMethodHandler(record.orderId, "BANK");
                  }}
                >
                  BANK
                </a>
              ),
              key: "3",
            },
            {
              label: (
                <a
                  onClick={() => {
                    changePaymentMethodHandler(record.orderId, "CARMEN");
                  }}
                >
                  CARMEN
                </a>
              ),
              key: "4",
            },
          ];

          if (record.paymentMethod === "PAYME") {
            return (
              <Dropdown menu={{ items }} trigger={["click"]}>
                PAYME
              </Dropdown>
            );
          } else if (record.paymentMethod === "FPS") {
            return (
              <Dropdown menu={{ items }} trigger={["click"]}>
                FPS
              </Dropdown>
            );
          } else if (record.paymentMethod === "ALIPAY") {
            return (
              <Dropdown menu={{ items }} trigger={["click"]}>
                ALIPAY
              </Dropdown>
            );
          } else if (record.paymentMethod === "BANK") {
            return (
              <Dropdown menu={{ items }} trigger={["click"]}>
                BANK
              </Dropdown>
            );
          } else if (record.paymentMethod === "CARMEN") {
            return (
              <Dropdown menu={{ items }} trigger={["click"]}>
                CARMEN
              </Dropdown>
            );
          }
        },
      },
      {
        title: "Remark",
        dataIndex: "remark",
        key: "remark",
      },
      {
        title: "付款時間",
        dataIndex: "createDate",
        key: "createDate",
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
  }, [customerPhone, productBrand, productName, filteredInfo, sortedInfo]);

  const data = useMemo(() => {
    return orderData?.map((order, index) => ({
      id: index + 1,
      key: order.orderId,
      orderId: order.orderId,
      phone: order?.customer?.phone,
      instagram: order?.customer?.instagram,
      showOrderName:
        order.orderPlatform === "phone"
          ? order?.customer?.phone
          : order?.customer?.instagram,
      productBrand: order?.product?.productBrand,
      productName: order?.product?.productName,
      productPrice: <>${order?.product?.productPrice * order?.quantity}</>,
      orderPlatform: order?.orderPlatform,
      quantity: order?.quantity,
      paid: order?.paid,
      takeMethod: order?.takeMethod,
      paymentMethod: order?.paymentMethod,
      remark: order?.remark,
      createDate: order?.createDate.split(".")[0].replaceAll("T", " "),
      status: order?.status,
    }));
  }, [orderData]);

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const refreshHandler = () => {
    dispatch(getAllOrders(packageName));
    setSelectedRowKeys([]);
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

  const changeStatusOrderHandler = async (orderId, status) => {
    const orderStatusDTO = {
      orderId: orderId,
      status: status,
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

  const changepaidOrderHandler = async (orderId, paid) => {
    const orderStatusDTO = {
      orderId: orderId,
      paid: paid,
    };
    const result = await dispatch(changePaidOrder(orderStatusDTO));

    if (result.meta.requestStatus === "fulfilled") {
      refreshHandler();
      // messageApi.open({
      //   type: "success",
      //   content: result.payload.msg,
      // });
    }
  };

  const changeTakeMethodOrderHandler = async (orderId, takeMethod) => {
    const orderStatusDTO = {
      orderId: orderId,
      takeMethod: takeMethod,
    };
    const result = await dispatch(changeTakeMethodOrder(orderStatusDTO));

    if (result.meta.requestStatus === "fulfilled") {
      refreshHandler();
    }
  };

  const changePaymentMethodHandler = async (orderId, paymentMethod) => {
    const orderStatusDTO = {
      orderId: orderId,
      paymentMethod: paymentMethod,
    };
    const result = await dispatch(changePaymentMethod(orderStatusDTO));

    if (result.meta.requestStatus === "fulfilled") {
      refreshHandler();
    }
  };

  const enableRowSelectionHandler = (checked) => {
    setIsEnableRowSelection(checked);
    if (!checked) setSelectedRowKeys([]);
  };

  const rowSelection = isEnableRowSelection
    ? {
        selectedRowKeys,
        onChange: (selectedKeys) => {
          setSelectedRowKeys(selectedKeys);
        },
      }
    : undefined; // Disable selection if switch is off

  const openPackagingHandler = () => {
    if (selectedRowKeys.length !== 0) {
      setOpenPackaging(true);
    } else {
      messageApi.open({
        type: "error",
        content: "請選擇訂單",
      });
    }
  };

  const changePackageNameHandler = (value) => {
    localStorage.setItem("packageName", value);
    dispatch(getAllOrders(value));
  };

  return (
    <div className="mb-5 mb-sm-0 mx-3">
      {contextHolder}
      <div className=" d-flex justify-content-between p-4 flex-column flex-sm-row">
        <div className=" mb-sm-0 mb-4">
          <span>包裝：</span>
          <Select
            placeholder="包裝名稱"
            options={packgeNameList}
            onChange={(value) => {
              changePackageNameHandler(value);
            }}
            defaultValue={packageName}
          />
        </div>
        <div>
          {isEnableRowSelection && (
            <>
              <Button className=" me-3" onClick={openPackagingHandler}>
                打包
              </Button>
            </>
          )}
          <Switch className=" me-3" onClick={enableRowSelectionHandler} />
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
        size="middle"
        loading={orderLoading}
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }}
        pagination={{
          pageSize: 50,
          position: ["bottomCenter"],
        }}
        onChange={handleChange}
        rowSelection={rowSelection}
      />
      <OrderAddModal open={open} setOpen={setOpen} messageApi={messageApi} />
      <OrderModifyModal
        openModify={openModify}
        setOpenModify={setOpenModify}
        orderModifyData={orderModifyData}
      />
      <OrderPackagingModal
        messageApi={messageApi}
        selectedRowKeys={selectedRowKeys}
        openPackaging={openPackaging}
        setOpenPackaging={setOpenPackaging}
      />
    </div>
  );
};

export default OrderDataTable;

import { Button, Form, Input, Modal } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import {
  batchPackaging,
  getAllOrders,
  getPackageName,
} from "../../redux/order/orderAction";

const OrderPackagingModal = ({
  selectedRowKeys,
  openPackaging,
  setOpenPackaging,
  messageApi,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const packageName = localStorage.getItem("packageName")
    ? localStorage.getItem("packageName")
    : "預設";

  const onFinish = async () => {
    await form.validateFields();

    const orderPackagingDTO = {
      orderIdList: selectedRowKeys,
      packageName: packageName,
      packagingToGoName: form.getFieldValue("packageName"),
    };

    const result = await dispatch(batchPackaging(orderPackagingDTO));

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(getAllOrders(packageName));
      dispatch(getPackageName());
      messageApi.open({
        type: "success",
        content: result.payload.msg,
      });
      setOpenPackaging(false);
    } else {
      messageApi.open({
        type: "error",
        content: result.payload,
      });
    }
  };
  return (
    <Modal
      title={<h3> Packaging Order： 共有 {selectedRowKeys.length} 訂單</h3>}
      centered
      open={openPackaging}
      onCancel={() => {
        setOpenPackaging(false);
      }}
      footer={
        <>
          <Button
            onClick={() => {
              setOpenPackaging(false);
            }}
          >
            取消
          </Button>
          <Button onClick={onFinish}>確認</Button>
        </>
      }
    >
      <Form autoComplete="off" form={form} onFinish={onFinish}>
        <Form.Item
          name="packageName"
          label="打包名稱"
          rules={[{ required: true, message: "請輸入打包名稱" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderPackagingModal;

import React from "react";
import { motion } from "framer-motion";
import { Button, Col, Divider, Row, Tag } from "antd";
import PageLayout from "../layout/PageLayout";
import OrderCrud from "../modules/OrderCrudModule";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../redux/order/orderAction";
import { PlusOutlined } from "@ant-design/icons";
import OrderDataTable from "../modules/OrderCrudModule/OrderDataTable";

const Dashboard = () => {
  const config = {
    type: "spring",
    damping: 20,
    stiffness: 100,
  };
  const dispatch = useDispatch();

  const TopCard = ({ title, tagContent, tagColor, prefix }) => {
    return (
      <Col className="gutter-row my-2" xs={24} md={12} lg={6}>
        <div
          className="whiteBox shadow"
          style={{ color: "#595959", fontSize: 13, height: "106px" }}
        >
          <div
            className="pad15 strong"
            style={{ textAlign: "center", justifyContent: "center" }}
          >
            <h3 style={{ color: "#22075e", marginBottom: 0 }}>{title}</h3>
          </div>
          <Divider style={{ padding: 0, margin: 0 }}></Divider>
          <div className="pad15">
            <Row gutter={[0, 0]}>
              <Col
                className="gutter-row"
                span={11}
                style={{ textAlign: "left", justifyContent: "center" }}
              >
                <div style={{ textAlign: "center" }}>{prefix}</div>
              </Col>
              <Col className="gutter-row" span={2}>
                <Divider
                  style={{ padding: "10px 0", justifyContent: "center" }}
                  type="vertical"
                ></Divider>
              </Col>
              <Col
                className="gutter-row"
                span={11}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Tag
                  color={tagColor}
                  style={{ margin: "0 auto", justifyContent: "center" }}
                >
                  {tagContent}
                </Tag>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    );
  };

  const { orderData } = useSelector((state) => state.order);

  const totalPaidPrice = orderData
    .filter((order) => order?.paid === "已付款")
    .map((order) => order?.product?.productPrice * order?.quantity)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const totalNotPaidPrice = orderData
    .filter((order) => order?.paid === "未付款")
    .map((order) => order?.product?.productPrice * order?.quantity)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const totalProfit = orderData
    .filter((order) => order?.paid === "已付款")
    .map(
      (order) =>
        Math.ceil(
          (order?.product?.productPrice -
            ((order?.product?.discount * order?.product?.productCost) /
              100 /
              order?.product?.exchangeRate?.exchangeRate +
              order?.product?.weight * 25)) *
            order?.quantity *
            10
        ) / 10
    )
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  console.log(orderData);

  const totalPrice = totalPaidPrice + totalNotPaidPrice;

  return (
    <motion.div
      transition={config}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
    >
      <PageLayout>
        <Row
          // gutter={[20, 20]}
          gutter={{
            xs: 2,
            sm: 8,
            md: 12,
            lg: 24,
          }}
          // gutter={{
          //   xs:6,
          //   sm:12,
          //   md:24,
          // }}
          className=" d-lg-flex"
        >
          <TopCard
            title={"訂單總數"}
            tagColor={"cyan"}
            prefix={"總共"}
            tagContent={Object.entries(orderData).length}
          />
          <TopCard
            title={"訂單金額"}
            tagColor={"green"}
            prefix={"總共"}
            tagContent={"$" + totalPrice}
          />
          <TopCard
            title={"未付款訂單"}
            tagColor={"purple"}
            prefix={"總共"}
            tagContent={"$" + totalNotPaidPrice}
          />
          <TopCard
            title={"總盈利"}
            tagColor={"purple"}
            prefix={"總共"}
            tagContent={"$" + totalProfit}
          />
        </Row>
        <div className="space30"></div>

        <Row gutter={[20, 20]}>
          <Col className="gutter-row" span={24}>
            <div className="whiteBox shadow">
              <OrderCrud />
            </div>
          </Col>
        </Row>
      </PageLayout>
    </motion.div>
  );
};

export default Dashboard;

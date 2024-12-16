import React from "react";
import { motion } from "framer-motion";
import { Col, Divider, Row, Tag } from "antd";
import PageLayout from "../layout/PageLayout";

const Dashboard = () => {
  const config = {
    type: "spring",
    damping: 20,
    stiffness: 100,
  };

  const TopCard = ({ title, tagContent, tagColor, prefix }) => {
    return (
      <Col className="gutter-row" span={6}>
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
                style={{ textAlign: "left" }}
              >
                <div className="left">{prefix}</div>
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

  return (
    <motion.div
      transition={config}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
    >
      <PageLayout>
        <Row gutter={[24, 24]}>
          <TopCard
            title={"Leads"}
            tagColor={"cyan"}
            prefix={"This month"}
            tagContent={"34 000 $"}
          />
          <TopCard
            title={"Order"}
            tagColor={"purple"}
            prefix={"This month"}
            tagContent={"34 000 $"}
          />
          <TopCard
            title={"Payment"}
            tagColor={"green"}
            prefix={"This month"}
            tagContent={"34 000 $"}
          />
          <TopCard
            title={"Due Balance"}
            tagColor={"red"}
            prefix={"Not Paid"}
            tagContent={"34 000 $"}
          />
        </Row>
        <div className="space30"></div>
      </PageLayout>
    </motion.div>
  );
};

export default Dashboard;

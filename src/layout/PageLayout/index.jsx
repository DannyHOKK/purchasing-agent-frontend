import { Layout } from "antd";
import React from "react";

const { Content } = Layout;

const PageLayout = ({ children }) => {
  return (
    <Layout className="page-layout">
      <Content
        style={{
          padding: "30px 40px",
          margin: "20px auto",
          width: "100%",
          maxWidth: "1100px",
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default PageLayout;

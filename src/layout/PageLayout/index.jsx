import { Layout } from "antd";
import React from "react";

const { Content } = Layout;

const PageLayout = ({ children }) => {
  return (
    <Layout>
      <Content
        style={{
          padding: "30px 20px",
          margin: "20px auto",
          width: "100%",
          maxWidth: "1500px",
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default PageLayout;

import { Layout } from "antd";
import React from "react";

const { Content } = Layout;

const PageLayout = ({ children }) => {
  return (
    <Layout>
      <Content className="pageLayout">{children}</Content>
    </Layout>
  );
};

export default PageLayout;

import React, { useState } from "react";

import { Link } from "react-router-dom";
import { ConfigProvider, Layout, Menu } from "antd";
import {
  SettingOutlined,
  UserOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TeamOutlined,
  TransactionOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { SubMenu } = Menu;

function Navigation() {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };
  return (
    <>
      <ConfigProvider
        theme={{ token: { colorPrimary: "#1DA57A", borderRadius: " 3px" } }}
      >
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          style={{
            zIndex: 1000,
          }}
        >
          <div className=" icon-container">
            <img src="icon.png" className="icon" />
          </div>
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <Link to="/" />
              主頁
            </Menu.Item>
            <Menu.Item key="2" icon={<CustomerServiceOutlined />}>
              <Link to="/customer">客人</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<FileSyncOutlined />}>
              <Link to="/product" />
              產品
            </Menu.Item>
            <Menu.Item key="4" icon={<TransactionOutlined />}>
              <Link to="/exchangeRate">匯率</Link>
            </Menu.Item>
          </Menu>
        </Sider>
      </ConfigProvider>
    </>
  );
}
export default Navigation;

import React, { useState } from "react";

import { Link, NavLink } from "react-router-dom";
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
  PieChartOutlined,
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
          className="leftsidebar"
        >
          <div className=" icon-container">
            <img src="icon.png" className="icon" />
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={[localStorage.getItem("selectKey")]}
            mode="inline"
          >
            <Menu.Item
              key="1"
              icon={<DashboardOutlined />}
              onClick={() => {
                localStorage.setItem("selectKey", "1");
              }}
            >
              <Link to="/">主頁</Link>
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<FileSyncOutlined />}
              onClick={() => {
                localStorage.setItem("selectKey", "3");
              }}
            >
              <Link to="/product">產品</Link>
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<CustomerServiceOutlined />}
              onClick={() => {
                localStorage.setItem("selectKey", "2");
              }}
            >
              <Link to="/customer">客人</Link>
            </Menu.Item>
            <Menu.Item
              key="4"
              icon={<TransactionOutlined />}
              onClick={() => {
                localStorage.setItem("selectKey", "4");
              }}
            >
              <Link to="/exchangeRate">匯率</Link>
            </Menu.Item>
            <Menu.Item
              key="5"
              icon={<PieChartOutlined />}
              onClick={() => {
                localStorage.setItem("selectKey", "5");
              }}
            >
              <Link to="/expense">消費記錄</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <div className="bottombar">
          <Menu
            className="bottom-menu"
            defaultSelectedKeys={[localStorage.getItem("selectKey")]}
          >
            <Menu.Item
              key="1"
              icon={<DashboardOutlined />}
              className="bottom-menu-item"
              onClick={() => {
                localStorage.setItem("selectKey", "1");
              }}
            >
              <Link to="/">主頁</Link>
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<CustomerServiceOutlined />}
              className="bottom-menu-item"
              onClick={() => {
                localStorage.setItem("selectKey", "2");
              }}
            >
              <Link to="/customer">客人</Link>
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<FileSyncOutlined />}
              className="bottom-menu-item"
              onClick={() => {
                localStorage.setItem("selectKey", "3");
              }}
            >
              <Link to="/product" />
              產品
            </Menu.Item>
            <Menu.Item
              key="4"
              icon={<TransactionOutlined />}
              className="bottom-menu-item"
              onClick={() => {
                localStorage.setItem("selectKey", "4");
              }}
            >
              <Link to="/exchangeRate">匯率</Link>
            </Menu.Item>
            <Menu.Item
              key="5"
              icon={<PieChartOutlined />}
              className="bottom-menu-item"
              onClick={() => {
                localStorage.setItem("selectKey", "5");
              }}
            >
              <Link to="/expense">消費記錄</Link>
            </Menu.Item>
          </Menu>
        </div>
      </ConfigProvider>
    </>
  );
}
export default Navigation;

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
            <Menu.Item key="5" icon={<PieChartOutlined />}>
              <Link to="/expense">消費記錄</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <div className="bottombar">
          {/* <ul className="nav-link">
            <li>
              <NavLink>
                <DashboardOutlined />
                <div>主頁</div>
              </NavLink>
            </li>
            <li>
              <NavLink>
                <CustomerServiceOutlined />
                <div>客人</div>
              </NavLink>
            </li>
            <li>
              <NavLink>
                <CustomerServiceOutlined />
                <div>客人</div>
              </NavLink>
            </li>
            <li>
              <NavLink>
                <CustomerServiceOutlined />
                <div>客人</div>
              </NavLink>
            </li>
            <li>
              <NavLink>
                <CustomerServiceOutlined />
                <div>客人</div>
              </NavLink>
            </li>
          </ul> */}
          <Menu className="bottom-menu">
            <Menu.Item
              key="1"
              icon={<DashboardOutlined />}
              className="bottom-menu-item"
            >
              <Link to="/">主頁</Link>
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<CustomerServiceOutlined />}
              className="bottom-menu-item"
            >
              <Link to="/customer">客人</Link>
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<FileSyncOutlined />}
              className="bottom-menu-item"
            >
              <Link to="/product" />
              產品
            </Menu.Item>
            <Menu.Item
              key="4"
              icon={<TransactionOutlined />}
              className="bottom-menu-item"
            >
              <Link to="/exchangeRate">匯率</Link>
            </Menu.Item>
            <Menu.Item
              key="5"
              icon={<PieChartOutlined />}
              className="bottom-menu-item"
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

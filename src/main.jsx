import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./style/dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ConfigProvider
    theme={{ token: { colorPrimary: "#1DA57A", borderRadius: " 3px" } }}
  >
    <App />
  </ConfigProvider>
  // </StrictMode>,
);

import React from "react";
import { Spin } from "antd";

const PageLoader = () => {
  return (
    <div className=" vh-100 w-100 h-100 d-flex justify-content-center align-items-center">
      <Spin size="large" />
    </div>
  );
};
export default PageLoader;

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import styles from "../styles/Sidebar.module.css";


const LayoutWithSidebar = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px", marginLeft: "220px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutWithSidebar;

import React from "react";

import "./Dashboardinformation.css";
import { useSelector } from "react-redux";

const DashboardInformation = () => {
  const { user } = useSelector((state) => ({ ...state.auth }));

  return (
    <div className="dashboard_info_text_container">
      <img src={user.picture} alt="" />
      <span className="dashboard_info_text_title">{user.username}</span>
      <span className="dashboard_info_text_description">
        Calling...
      </span>
    </div>
  );
};

export default DashboardInformation;

import React from "react";
import { Outlet } from "react-router-dom";
import NotificationBanner from "../NotificationBanner";

const ApplicantLayout = () => {
  return (
    <div>
      <NotificationBanner />
      <Outlet />
    </div>
  );
};

export default ApplicantLayout;
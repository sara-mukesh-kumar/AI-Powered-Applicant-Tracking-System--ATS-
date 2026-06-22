import React from "react";
import { Outlet } from "react-router-dom";
import RecruiterNavbar from "./RecruiterNavbar";
import RecruiterSidebar from "./RecruiterSidebar";
import NotificationBanner from "../NotificationBanner";

const RecruiterLayout = () => {
  return (
    <div className="flex">
      <RecruiterSidebar />

      <div className="flex-1">
        <RecruiterNavbar />
        <NotificationBanner />

        <main className="p-6 bg-gray-100 min-h-screen">
          {/* Outlet hi nested pages ko render karega layout ke andar */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
import React from "react";
import RecruiterNavbar from "./RecruiterNavbar";
import RecruiterSidebar from "./RecruiterSidebar";

const RecruiterLayout = ({ children }) => {
  return (
    <div className="flex">
      <RecruiterSidebar />

      <div className="flex-1">
        <RecruiterNavbar />

        <main className="p-6 bg-gray-100 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
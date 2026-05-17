import React from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";

const AdminLayout = () => {
  return (

    <div className="flex bg-[#f7f4fb] min-h-screen">

      <Sidebar />

      <div className="ml-[280px] w-full p-8">
        <Outlet />
      </div>

    </div>

  );
};

export default AdminLayout;
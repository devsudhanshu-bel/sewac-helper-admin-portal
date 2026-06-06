import React from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";

import Footer from "../components/footer/Footer";

const AdminLayout = () => {

  return (

    <div className="flex bg-[#f7f4fb] min-h-screen">

      <Sidebar />

      <div className="ml-[280px] flex-1 min-w-0 flex flex-col">

        {/* PAGE CONTENT */}
        <div className="flex-1 p-8">

          <Outlet />

        </div>

        {/* FOOTER */}
        <Footer />

      </div>

    </div>

  );

};

export default AdminLayout;
import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import RFIDTags from "./pages/RFIDTags";
import NotFoundData from "./pages/NotFoundData";
import Login from "./pages/Login";



// =========================================
// TEMP DISTRIBUTION PAGE
// =========================================
const Distribution = () => {

  return (

    <div className="text-[#1e1b4b] text-4xl font-black">

      Distribution

    </div>

  );
};



// =========================================
// PROTECTED ROUTE
// =========================================
const ProtectedRoute = ({
  children,
}) => {

  const token =
    localStorage.getItem(
      "token"
    );



  // =========================================
  // IF NO TOKEN
  // =========================================
  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }



  // =========================================
  // ALLOW ACCESS
  // =========================================
  return children;
};



// =========================================
// APP
// =========================================
const App = () => {

  return (

    <BrowserRouter>

      <Routes>

        {/* ========================================= */}
        {/* LOGIN */}
        {/* ========================================= */}
        <Route
          path="/login"
          element={<Login />}
        />



        {/* ========================================= */}
        {/* ADMIN PANEL */}
        {/* ========================================= */}
        <Route
          path="/"

          element={

            <ProtectedRoute>

              <AdminLayout />

            </ProtectedRoute>

          }
        >

          {/* DASHBOARD */}
          <Route
            index
            element={<Dashboard />}
          />



          {/* LOGS */}
          <Route
            path="logs"
            element={<Logs />}
          />



          {/* DISTRIBUTION */}
          <Route
            path="distribution"
            element={
              <Distribution />
            }
          />



          {/* RFID TAGS */}
          <Route
            path="rfid-tags"
            element={<RFIDTags />}
          />



          {/* FAILED MAPPINGS */}
          <Route
            path="failed-mappings"
            element={
              <NotFoundData />
            }
          />

        </Route>



        {/* ========================================= */}
        {/* 404 */}
        {/* ========================================= */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );
};

export default App;
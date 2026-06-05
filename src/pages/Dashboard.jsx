import React from "react";

import Header from "../components/navbar/Header";

import StatsCards from "../components/cards/StatsCards";

import DistributionProgress from "../components/charts/DistributionProgress";

import WorkersDistribution from "../components/charts/WorkersDistribution";

import DistributionOverTime from "../components/charts/DistributionOverTime";




const Dashboard = () => {

  return (

    <div className="w-full">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}
      <Header />



      {/* ========================================= */}
      {/* STATS */}
      {/* ========================================= */}
      <StatsCards />



      {/* ========================================= */}
      {/* TOP ANALYTICS */}
      {/* ========================================= */}
      <div className="grid grid-cols-[1.3fr_1fr] gap-4">

        {/* LEFT */}
        <DistributionProgress />



        {/* RIGHT */}
        <WorkersDistribution />

      </div>



      {/* ========================================= */}
      {/* SECOND ANALYTICS SECTION */}
      {/* ========================================= */}
      <div className="grid grid-cols-1 gap-4 mt-4">





        {/* BAR CHART */}
        <DistributionOverTime />


      </div>

    </div>

  );
};

export default Dashboard;
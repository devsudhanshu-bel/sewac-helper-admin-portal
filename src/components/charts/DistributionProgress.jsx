import API_BASE_URL from "../../services/api";
import React, { useEffect, useRef, useState } from "react";

import gsap from "gsap";

import {
  ResponsiveContainer,
  Line,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#ff4fa3", "#9333ea"];

const DistributionProgress = () => {
  const cardRef = useRef();

  const donutRef = useRef();

  const graphRef = useRef();

  const statsRef = useRef([]);

  // =========================================
  // STATES
  // =========================================
  const [loading, setLoading] = useState(true);

  const [distributionData, setDistributionData] = useState({
    totalRFID: 0,
    distributedRFID: 0,
    remainingRFID: 0,
    completedPercentage: 0,
    remainingPercentage: 0,
  });

  const [pieData, setPieData] = useState([
    {
      name: "Completed",
      value: 0,
    },

    {
      name: "Remaining",
      value: 0,
    },
  ]);

  const [progressData, setProgressData] = useState([]);

  // =========================================
  // FETCH DATA
  // =========================================
  useEffect(() => {
    const fetchDistributionData = async () => {
      try {
        setLoading(true);

        // =====================================
        // TOKEN
        // =====================================
        const token = sessionStorage.getItem("token");

        if (!token) {
          console.error("No token found");

          setLoading(false);

          return;
        }

        // =====================================
        // FETCH APIs
        // =====================================
        const [totalResponse, distributedResponse, dailyCountsResponse] =
          await Promise.all([
            fetch(
              `${API_BASE_URL}/api/dashboard/total-rfid-tags`,
              {
                method: "GET",

                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              },
            ),

            fetch(
              `${API_BASE_URL}/api/dashboard/distributed-tags`,
              {
                method: "GET",

                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              },
            ),

            fetch(
              `${API_BASE_URL}/api/logs/daily-counts`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                cache: "no-store",
              },
            ),
          ]);

        // =====================================
        // CHECK RESPONSES
        // =====================================
        if (!totalResponse.ok || !distributedResponse.ok) {
          console.error("API request failed");

          setLoading(false);

          return;
        }

        // =====================================
        // JSON
        // =====================================
        const totalData = await totalResponse.json();

        const distributedData = await distributedResponse.json();

        const dailyCountsData = await dailyCountsResponse.json();

        console.log("TOTAL:", totalData);

        console.log("DISTRIBUTED:", distributedData);

        // =====================================
        // VALUES
        // =====================================
        const totalRFID = totalData?.data?.totalRFIDTags || 0;

        const distributedRFID = distributedData?.data?.distributedTags || 0;

        const remainingRFID = totalRFID - distributedRFID;

        // =====================================
        // PERCENTAGES
        // =====================================
        const completedPercentage =
          totalRFID > 0
            ? Number(((distributedRFID / totalRFID) * 100).toFixed(1))
            : 0;

        const remainingPercentage =
          totalRFID > 0
            ? Number(((remainingRFID / totalRFID) * 100).toFixed(1))
            : 0;

        // =====================================
        // MAIN DATA
        // =====================================
        setDistributionData({
          totalRFID,
          distributedRFID,
          remainingRFID,
          completedPercentage,
          remainingPercentage,
        });

        // =====================================
        // PIE DATA
        // =====================================
        setPieData([
          {
            name: "Completed",
            value: completedPercentage,
          },

          {
            name: "Remaining",
            value: remainingPercentage,
          },
        ]);

        // =====================================
        // REALISTIC GRAPH DATA
        // =====================================
        // STARTS FROM 1st MAY
        // ENDS TODAY
        // NEVER SHOWS FUTURE DATES
        // =====================================

        const graphData =
          dailyCountsData?.data?.map((item) => ({
            date: new Date(item.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            }),

            value: item.count,
          })) || [];

        setProgressData(graphData);
      } catch (error) {
        console.error("Distribution fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistributionData();
  }, []);

  // =========================================
  // GSAP
  // =========================================
  useEffect(() => {
    if (loading) return;

    gsap.fromTo(
      cardRef.current,

      {
        y: 30,
        opacity: 0,
      },

      {
        y: 0,
        opacity: 1,

        duration: 0.45,

        ease: "power3.out",
      },
    );

    gsap.fromTo(
      donutRef.current,

      {
        scale: 0.9,
        opacity: 0,
      },

      {
        scale: 1,
        opacity: 1,

        duration: 0.5,

        ease: "power3.out",
      },
    );

    gsap.fromTo(
      statsRef.current,

      {
        x: -15,
        opacity: 0,
      },

      {
        x: 0,
        opacity: 1,

        stagger: 0.05,

        duration: 0.35,

        delay: 0.1,

        ease: "power3.out",
      },
    );

    gsap.fromTo(
      graphRef.current,

      {
        x: 20,
        opacity: 0,
      },

      {
        x: 0,
        opacity: 1,

        duration: 0.45,

        delay: 0.12,

        ease: "power3.out",
      },
    );
  }, [loading]);

  return (
    <div
      ref={cardRef}
      className="
relative
overflow-hidden

bg-white/55
backdrop-blur-2xl

border border-white/40

rounded-[26px]

p-5

shadow-[0_10px_40px_rgba(168,85,247,0.08)]

w-full
min-h-[320px]
"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-[16px] font-bold text-[#1f1f3d]">
          Distribution Progress
        </h2>

        <div className="px-3 py-1.5 rounded-xl bg-[#f6f1fc] text-[#7c6fa3] text-[11px] font-semibold w-fit">
          Live RFID Analytics
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="h-[260px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-pink-300 border-t-pink-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">
          {/* LEFT */}
          <div className="flex flex-col items-center gap-4 lg:pr-6 lg:border-r border-[#ece8f6]">
            {/* DONUT */}
            <div ref={donutRef} className="relative w-[170px] h-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={58}
                    outerRadius={78}
                    paddingAngle={2}
                    cornerRadius={12}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* CENTER */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h2 className="text-[20px] font-bold text-[#1f1f3d] leading-none tracking-tight">
                  {distributionData.completedPercentage}%
                </h2>

                <p className="text-[12px] text-[#8f8fa8] font-semibold mt-2">
                  Completed
                </p>
              </div>
            </div>

            {/* BELOW PIE */}
            <div className="flex flex-col gap-3 w-full">
              {/* DISTRIBUTED */}
              <div
                ref={(el) => (statsRef.current[0] = el)}
                className="flex items-center justify-between bg-[#faf7ff] border border-[#efe7ff] rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500" />

                  <p className="text-[13px] font-semibold text-[#6d6487]">
                    Distributed
                  </p>
                </div>

                <h3 className="text-[18px] font-bold text-[#1f1f3d]">
                  {distributionData.distributedRFID.toLocaleString()}
                </h3>
              </div>

              {/* REMAINING */}
              <div
                ref={(el) => (statsRef.current[1] = el)}
                className="flex items-center justify-between bg-[#faf7ff] border border-[#efe7ff] rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />

                  <p className="text-[13px] font-semibold text-[#6d6487]">
                    Remaining
                  </p>
                </div>

                <h3 className="text-[18px] font-bold text-[#1f1f3d]">
                  {distributionData.remainingRFID.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          {/* GRAPH */}
          <div ref={graphRef} className="flex-1 lg:pl-6 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <CartesianGrid
                  stroke="#ece8f6"
                  strokeDasharray="3 3"
                  vertical={true}
                  horizontal={true}
                />
                {/* GRADIENT */}
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ff4fa3" stopOpacity={0.22} />

                    <stop offset="100%" stopColor="#ff4fa3" stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* X AXIS */}
                <XAxis
                  dataKey="date"
                  interval={0}
                  tickMargin={10}
                  axisLine={{
                    stroke: "#d8d3e8",
                    strokeWidth: 1,
                  }}
                  tickLine={{
                    stroke: "#d8d3e8",
                  }}
                  tick={{
                    fill: "#8f8fa8",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                />

                {/* Y AXIS */}
                <YAxis
                  axisLine={{
                    stroke: "#d8d3e8",
                    strokeWidth: 1,
                  }}
                  tickLine={{
                    stroke: "#d8d3e8",
                  }}
                  tick={{
                    fill: "#8f8fa8",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          className="
bg-white
border border-[#f1e7ff]
rounded-2xl
px-4
py-3
shadow-[0_10px_30px_rgba(0,0,0,0.08)]
"
                        >
                          {/* DATE HEADING */}
                          <h3 className="text-[13px] font-bold text-[#1f1f3d] mb-2">
                            {label}
                          </h3>

                          {/* COUNT */}
                          <p className="text-[13px] font-semibold text-[#ff4fa3]">
                            Distributed : {payload[0].value} Tags
                          </p>
                      </div>
                      );
                    }

                    return null;
                  }}
                />

                {/* AREA */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ff4fa3"
                  strokeWidth={3}
                  fill="url(#colorGradient)"
                />

                {/* LINE */}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ff4fa3"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributionProgress;

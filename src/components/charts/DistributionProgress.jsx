import React, {
  useEffect,
  useRef,
  useState,
} from "react";

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
} from "recharts";

const COLORS = [
  "#ff4fa3",
  "#9333ea",
];

const DistributionProgress = () => {

  const cardRef = useRef();

  const donutRef = useRef();

  const graphRef = useRef();

  const statsRef = useRef([]);

  // =========================================
  // STATES
  // =========================================
  const [loading, setLoading] =
    useState(true);

  const [distributionData, setDistributionData] =
    useState({
      totalRFID: 0,
      distributedRFID: 0,
      remainingRFID: 0,
      completedPercentage: 0,
      remainingPercentage: 0,
    });

  const [pieData, setPieData] =
    useState([
      {
        name: "Completed",
        value: 0,
      },

      {
        name: "Remaining",
        value: 0,
      },
    ]);

  const [progressData, setProgressData] =
    useState([]);

  // =========================================
  // FETCH DATA
  // =========================================
  useEffect(() => {

    const fetchDistributionData =
      async () => {

        try {

          setLoading(true);

          // =====================================
          // TOKEN
          // =====================================
          const token =
            sessionStorage.getItem(
              "token"
            );

          if (!token) {

            console.error(
              "No token found"
            );

            return;
          }

          // =====================================
          // FETCH APIs
          // =====================================
          const [
            totalResponse,
            distributedResponse,
          ] = await Promise.all([
            fetch(
              "https://sewac-helper-admin-portal.onrender.com/api/dashboard/total-rfid-tags",
              {
                method: "GET",

                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type":
                    "application/json",
                },
              }
            ),

            fetch(
              "https://sewac-helper-admin-portal.onrender.com/api/dashboard/distributed-tags",
              {
                method: "GET",

                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type":
                    "application/json",
                },
              }
            ),
          ]);

          // =====================================
          // JSON
          // =====================================
          const totalData =
            await totalResponse.json();

          const distributedData =
            await distributedResponse.json();

          console.log(
            "TOTAL:",
            totalData
          );

          console.log(
            "DISTRIBUTED:",
            distributedData
          );

          // =====================================
          // VALUES
          // =====================================
          const totalRFID =
            totalData?.data
              ?.totalRFIDTags || 0;

          const distributedRFID =
            distributedData?.data
              ?.distributedTags || 0;

          const remainingRFID =
            totalRFID -
            distributedRFID;

          // =====================================
          // PERCENTAGES
          // =====================================
          const completedPercentage =
            totalRFID > 0
              ? Number(
                  (
                    (distributedRFID /
                      totalRFID) *
                    100
                  ).toFixed(2)
                )
              : 0;

          const remainingPercentage =
            totalRFID > 0
              ? Number(
                  (
                    (remainingRFID /
                      totalRFID) *
                    100
                  ).toFixed(2)
                )
              : 0;

          // =====================================
          // SET MAIN DATA
          // =====================================
          setDistributionData({
            totalRFID,
            distributedRFID,
            remainingRFID,
            completedPercentage,
            remainingPercentage,
          });

          // =====================================
          // PIE CHART
          // =====================================
          setPieData([
            {
              name: "Completed",
              value:
                completedPercentage,
            },

            {
              name: "Remaining",
              value:
                remainingPercentage,
            },
          ]);

          // =====================================
          // GRAPH DATA
          // =====================================
          // Simulated progressive growth
          // based on real distribution
          // You can later replace this
          // with backend daily data
          // =====================================
          setProgressData([
            {
              day: "Day 1",
              value: Math.floor(
                distributedRFID *
                  0.35
              ),
            },

            {
              day: "Day 2",
              value: Math.floor(
                distributedRFID *
                  0.7
              ),
            },

            {
              day: "Day 3",
              value:
                distributedRFID,
            },
          ]);

        } catch (error) {

          console.error(
            "Distribution fetch failed:",
            error
          );

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

    // CARD
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
      }
    );

    // DONUT
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
      }
    );

    // STATS
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
      }
    );

    // GRAPH
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
      }
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

        <div className="h-[240px] flex items-center justify-center">

          <div className="text-[#7c6fa3] font-semibold">

            Loading...

          </div>

        </div>

      ) : (

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">

          {/* LEFT */}
          <div className="flex flex-col sm:flex-row items-center gap-5 lg:pr-6 lg:border-r border-[#ece8f6]">

            {/* DONUT */}
            <div
              ref={donutRef}

              className="relative w-[170px] h-[170px] shrink-0"
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

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

                    {pieData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                </PieChart>

              </ResponsiveContainer>

              {/* CENTER */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">

                <h2 className="text-[20px] font-bold text-[#1f1f3d] leading-none tracking-tight">

                  {
                    distributionData.completedPercentage
                  }
                  %

                </h2>

                <p className="text-[12px] text-[#8f8fa8] font-semibold mt-2">

                  Completed

                </p>

              </div>

            </div>

            {/* STATS */}
            <div className="flex flex-col gap-4">

              {/* DISTRIBUTED */}
              <div
                ref={(el) =>
                  (statsRef.current[0] =
                    el)
                }

                className="flex items-start gap-2.5"
              >

                <div className="w-3 h-3 rounded-full bg-pink-500 mt-2" />

                <div>

                  <h3 className="text-[24px] font-bold text-[#1f1f3d] leading-none">

                    {distributionData.distributedRFID.toLocaleString()}

                  </h3>

                  <p className="text-[11px] text-[#8f8fa8] font-medium mt-1.5">

                    Distributed

                  </p>

                </div>

              </div>

              {/* REMAINING */}
              <div
                ref={(el) =>
                  (statsRef.current[1] =
                    el)
                }

                className="flex items-start gap-2.5"
              >

                <div className="w-3 h-3 rounded-full bg-purple-500 mt-2" />

                <div>

                  <h3 className="text-[24px] font-bold text-[#1f1f3d] leading-none">

                    {distributionData.remainingRFID.toLocaleString()}

                  </h3>

                  <p className="text-[11px] text-[#8f8fa8] font-medium mt-1.5">

                    Remaining

                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* GRAPH */}
          <div
            ref={graphRef}

            className="flex-1 lg:pl-6 h-[250px] lg:h-auto"
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={progressData}
              >

                {/* GRADIENT */}
                <defs>

                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#ff4fa3"
                      stopOpacity={
                        0.22
                      }
                    />

                    <stop
                      offset="100%"
                      stopColor="#ff4fa3"
                      stopOpacity={
                        0
                      }
                    />

                  </linearGradient>

                </defs>

                {/* X AXIS */}
                <XAxis
                  dataKey="day"

                  axisLine={false}

                  tickLine={false}

                  tick={{
                    fill:
                      "#8f8fa8",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                />

                {/* TOOLTIP */}
                <Tooltip
                  contentStyle={{
                    borderRadius:
                      "14px",

                    border:
                      "1px solid #f1e7ff",

                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.08)",

                    fontSize:
                      "12px",
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

                  dot={{
                    r: 5,
                    fill:
                      "#ff4fa3",
                    strokeWidth: 3,
                    stroke: "#fff",
                  }}

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
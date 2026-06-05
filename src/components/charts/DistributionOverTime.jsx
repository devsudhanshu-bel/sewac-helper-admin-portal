// =========================================
// src/components/charts/DistributionOverTime.jsx
// =========================================

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";
const CustomTooltip = ({
  active,
  payload,
}) => {

  if (
    active &&
    payload &&
    payload.length
  ) {

    return (

      <div
        className="
bg-white
border border-[#e9ddff]
rounded-xl
px-4 py-3
shadow-xl
"
      >

        <p className="text-[#1f1f3d] font-bold text-[14px]">

          {payload[0].payload.worker}

        </p>

        <p className="text-[#ff4fa3] font-semibold text-[13px] mt-1">

          Tags Distributed :
          {" "}
          {payload[0].value}

        </p>

      </div>

    );

  }

  return null;

};

const DistributionOverTime = () => {

  const cardRef = useRef(null);

  const [data, setData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchWorkerDistribution =
      async () => {

        try {

          const token =
            sessionStorage.getItem(
              "token"
            );

          if (!token) {

            setLoading(false);

            return;

          }

          const response =
            await fetch(
              "http://18.60.41.32:5000/api/dashboard/worker-distribution",
              {
                method: "GET",

                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type":
                    "application/json",
                },
              }
            );

          const result =
            await response.json();

          console.log(
            "BAR CHART DATA:",
            result
          );

          if (
            result.success &&
            result.data?.tagsByWorker
          ) {

            const chartData =
              result.data.tagsByWorker

                .filter(
                  worker =>
                    worker.distributedTags > 0
                )

                .sort(
                  (a, b) =>
                    b.distributedTags -
                    a.distributedTags
                )

                .map(
                  worker => ({
                    worker:
                      worker.username,
                    tags:
                      worker.distributedTags,
                  })
                );

            setData(
              chartData
            );

          }

        } catch (error) {

          console.error(
            "Worker chart fetch failed:",
            error
          );

        } finally {

          setLoading(false);

        }

      };

    fetchWorkerDistribution();

  }, []);

  useEffect(() => {

    gsap.fromTo(
      cardRef.current,

      {
        opacity: 0,
        y: 30,
      },

      {
        opacity: 1,
        y: 0,

        duration: 0.7,

        delay: 0.15,

        ease: "power3.out",
      }
    );

  }, []);

  return (

    <div
      ref={cardRef}
      className="bg-white rounded-[22px] border border-[#f1ebff] p-5 shadow-sm"
    >

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <h2 className="text-[#2d2a4a] text-[15px] font-bold">

          Worker-Wise Distribution

        </h2>

        <div className="bg-[#f7f2ff] text-[#7c3aed] text-[11px] font-semibold px-3 py-1 rounded-full">

          Live

        </div>

      </div>

      {/* CHART */}
      <div className="w-full h-[250px]">

        {loading ? (

          <div className="h-full flex items-center justify-center text-[#7e7a99] font-medium">

            Loading...

          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={data}
              barSize={40}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3efff"
              />

              <XAxis
                dataKey="worker"
                tick={{
                  fill: "#7e7a99",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
                angle={-20}
                textAnchor="end"
                interval={0}
              />

              <YAxis
                tick={{
                  fill: "#7e7a99",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
  content={<CustomTooltip />}
  cursor={{
    fill:
      "rgba(124,58,237,0.08)",
  }}
/>

              <Bar
                dataKey="tags"
                radius={[
                  14,
                  14,
                  0,
                  0,
                ]}
                fill="url(#gradient)"
              />

              <defs>

                <linearGradient
                  id="gradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="#ff4fa3"
                  />

                  <stop
                    offset="100%"
                    stopColor="#8b5cf6"
                  />

                </linearGradient>

              </defs>

            </BarChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>

  );

};

export default DistributionOverTime;
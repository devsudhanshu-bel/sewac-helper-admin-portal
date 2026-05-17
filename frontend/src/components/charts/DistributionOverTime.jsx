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
} from "react";

import gsap from "gsap";



const data = [
  {
    day: "May 18",
    tags: 4200,
  },

  {
    day: "May 19",
    tags: 6400,
  },

  {
    day: "May 20",
    tags: 7100,
  },
];



const DistributionOverTime = () => {

  const cardRef = useRef(null);



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

          Distribution Over Time

        </h2>



        <div className="bg-[#f7f2ff] text-[#7c3aed] text-[11px] font-semibold px-3 py-1 rounded-full">

          Last 3 Days

        </div>

      </div>



      {/* CHART */}
      <div className="w-full h-[230px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart
            data={data}
            barSize={58}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3efff"
            />



            <XAxis
              dataKey="day"
              tick={{
                fill: "#7e7a99",
                fontSize: 12,
              }}

              axisLine={false}
              tickLine={false}
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
              cursor={{
                fill:
                  "rgba(124,58,237,0.06)",
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



            {/* GRADIENT */}
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

      </div>

    </div>

  );
};

export default DistributionOverTime;
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import gsap from "gsap";

import {
  useEffect,
  useRef,
  useState,
} from "react";



const COLORS = [
  "#ff4fa3",
  "#8b5cf6",
  "#fb923c",
  "#6366f1",
  "#14b8a6",
  "#f43f5e",
  "#0ea5e9",
  "#e879f9",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#8b5cf6",
  "#84cc16",
  "#ef4444",
];



const DistributionByWorkers = () => {

  const cardRef = useRef(null);




  // =========================================
  // STATE
  // =========================================
  const [data, setData] =
    useState([]);




  // =========================================
  // FETCH DATA
  // =========================================
  useEffect(() => {

    const fetchWorkerDistribution =
      async () => {

        try {

          // =====================================
          // TOKEN
          // =====================================
          const token =
            localStorage.getItem(
              "token"
            );



          if (!token) {

            console.error(
              "No token found"
            );

            return;
          }



          // =====================================
          // API CALL
          // =====================================
          const response =
            await fetch(
              "https://sewac-helper-admin-portal.onrender.com/api/dashboard/worker-distribution",
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
            "PIE CHART DATA:",
            result
          );



          // =====================================
          // FORMAT DATA
          // =====================================
          if (
            result.success &&
            result.data
          ) {

            const formattedData =
              result.data

                // REMOVE ZERO VALUES
                .filter(
                  (worker) =>
                    worker.distributedTags >
                    0
                )

                // MAP DATA
                .map(
                  (
                    worker
                  ) => ({
                    name:
                      worker.worker,

                    value:
                      worker.distributedTags,
                  })
                )

                // SORT DESC
                .sort(
                  (a, b) =>
                    b.value -
                    a.value
                );



            setData(
              formattedData
            );

          }

        } catch (error) {

          console.error(
            "Failed to fetch worker distribution:",
            error
          );

        }
      };



    fetchWorkerDistribution();

  }, []);




  // =========================================
  // GSAP
  // =========================================
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

        ease: "power3.out",
      }
    );

  }, []);




  // =========================================
  // TOTAL
  // =========================================
  const total =
    data.reduce(
      (acc, item) =>
        acc + item.value,

      0
    );




  return (

    <div
      ref={cardRef}

      className="bg-white rounded-[22px] border border-[#f1ebff] p-5 shadow-sm"
    >

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}
      <div className="flex items-center justify-between">

        <h2 className="text-[#2d2a4a] text-[15px] font-bold">

          Distribution By Workers

        </h2>

      </div>



      {/* ========================================= */}
      {/* EMPTY STATE */}
      {/* ========================================= */}
      {data.length === 0 ? (

        <div className="h-[230px] flex items-center justify-center text-[#8c88a6] text-sm font-medium">

          No worker distributions yet

        </div>

      ) : (

        <div className="flex items-center mt-6">

          {/* ========================================= */}
          {/* CHART */}
          {/* ========================================= */}
          <div className="w-[180px] h-[180px] relative">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={data}

                  innerRadius={55}

                  outerRadius={82}

                  paddingAngle={4}

                  dataKey="value"
                >

                  {data.map(
                    (
                      entry,
                      index
                    ) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

              </PieChart>

            </ResponsiveContainer>



            {/* ========================================= */}
            {/* CENTER */}
            {/* ========================================= */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">

              <h1 className="text-[28px] font-black text-[#2d2a4a]">

                {total.toLocaleString()}

              </h1>

              <p className="text-[#8c88a6] text-[12px] font-medium">

                Distributed

              </p>

            </div>

          </div>



          {/* ========================================= */}
          {/* DETAILS */}
          {/* ========================================= */}
          <div className="flex-1 pl-5 space-y-4">

            {data.map(
              (
                item,
                index
              ) => {

                const percentage =
                  (
                    (item.value /
                      total) *
                    100
                  ).toFixed(1);

                return (

                  <div
                    key={index}

                    className="flex items-center justify-between"
                  >

                    {/* LEFT */}
                    <div className="flex items-center gap-3">

                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          background:
                            COLORS[
                              index %
                                COLORS.length
                            ],
                        }}
                      />



                      <p className="text-[#5e5a78] text-[13px] font-semibold">

                        {item.name}

                      </p>

                    </div>



                    {/* RIGHT */}
                    <div className="text-right">

                      <h3 className="text-[#2d2a4a] text-[13px] font-bold">

                        {item.value.toLocaleString()}

                      </h3>

                      <p className="text-[#8c88a6] text-[11px]">

                        {percentage}%

                      </p>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </div>

      )}

    </div>

  );
};

export default DistributionByWorkers;
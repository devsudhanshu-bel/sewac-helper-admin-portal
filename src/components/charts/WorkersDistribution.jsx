import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

import {
  User,
} from "lucide-react";



const WorkersDistribution = () => {

  const cardRef = useRef();

  const workersRef = useRef([]);




  // =========================================
  // STATE
  // =========================================
  const [workerData, setWorkerData] =
    useState([]);




  // =========================================
  // FETCH WORKER DISTRIBUTION
  // =========================================
  useEffect(() => {

    const fetchWorkers =
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
            "WORKERS:",
            result
          );



          // =====================================
          // VALIDATE
          // =====================================
          if (
            result.success &&
            result.data
          ) {

            // TOTAL TAGS
            const totalTags =
              result.data.reduce(
                (
                  acc,
                  worker
                ) =>
                  acc +
                  worker.distributedTags,

                0
              );



            // FORMAT DATA
            const formattedData =
              result.data.map(
                (
                  worker,
                  index
                ) => {

                  const percentage =
                    totalTags > 0
                      ? (
                          (worker.distributedTags /
                            totalTags) *
                          100
                        ).toFixed(2)
                      : 0;



                  const progress =
                    totalTags > 0
                      ? `${
                          (
                            (worker.distributedTags /
                              totalTags) *
                            100
                          ).toFixed(
                            0
                          )
                        }%`
                      : "0%";



                  return {

                    id:
                      index + 1,

                    worker:
                      worker.worker,

                    distributed:
                      worker.distributedTags.toLocaleString(),

                    percentage: `${percentage}%`,

                    progress,
                  };

                }
              );



            // SORT DESCENDING
            formattedData.sort(
              (a, b) =>
                parseInt(
                  b.distributed.replace(
                    /,/g,
                    ""
                  )
                ) -
                parseInt(
                  a.distributed.replace(
                    /,/g,
                    ""
                  )
                )
            );



            setWorkerData(
              formattedData
            );

          }

        } catch (error) {

          console.error(
            "Failed to fetch workers:",
            error
          );

        }
      };



    fetchWorkers();

  }, []);




  // =========================================
  // GSAP
  // =========================================
  useEffect(() => {

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



    // ROWS
    gsap.fromTo(
      workersRef.current,

      {
        x: 15,
        opacity: 0,
      },

      {
        x: 0,
        opacity: 1,

        stagger: 0.05,

        delay: 0.12,

        duration: 0.35,

        ease: "power3.out",
      }
    );

  }, [workerData]);




  return (

    <div
      ref={cardRef}

      className="bg-white border border-purple-100 rounded-[26px] p-4 shadow-sm h-[320px] flex flex-col"
    >

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}
      <div className="flex items-center justify-between mb-5">

        <h2 className="text-[15px] font-bold text-[#1f1f3d]">

          Tags Distributed by Workers

        </h2>



        <button className="text-pink-500 text-[11px] font-semibold hover:opacity-80 transition-all duration-200">

          Live

        </button>

      </div>



      {/* ========================================= */}
      {/* TABLE HEAD */}
      {/* ========================================= */}
      <div className="grid grid-cols-[30px_1fr_90px_65px] mb-3 px-1">

        <p className="text-[10px] font-semibold text-[#8f8fa8]">

          #

        </p>



        <p className="text-[10px] font-semibold text-[#8f8fa8]">

          Worker

        </p>



        <p className="text-[10px] font-semibold text-[#8f8fa8]">

          Tags

        </p>



        <p className="text-[10px] font-semibold text-[#8f8fa8]">

          %

        </p>

      </div>



      {/* ========================================= */}
      {/* SCROLLABLE */}
      {/* ========================================= */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">

        <div className="flex flex-col gap-4">

          {workerData.length === 0 ? (

            <div className="h-[180px] flex items-center justify-center text-[#8f8fa8] text-sm font-medium">

              No worker data found

            </div>

          ) : (

            workerData.map(
              (
                worker,
                index
              ) => (

                <div
                  key={index}

                  ref={(el) =>
                    (workersRef.current[
                      index
                    ] = el)
                  }

                  className="grid grid-cols-[30px_1fr_90px_65px] items-center"
                >

                  {/* ID */}
                  <p className="text-[12px] font-semibold text-[#1f1f3d]">

                    {worker.id}

                  </p>



                  {/* WORKER */}
                  <div className="flex items-center gap-2.5">

                    {/* PROFILE */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-sm">

                      <User
                        size={15}
                        className="text-white"
                      />

                    </div>



                    {/* INFO */}
                    <div className="flex-1">

                      <p className="text-[12px] font-semibold text-[#1f1f3d]">

                        {worker.worker}

                      </p>



                      {/* PROGRESS */}
                      <div className="w-full h-[4px] rounded-full bg-[#ece8f6] mt-1.5 overflow-hidden">

                        <div
                          className="h-full rounded-full bg-pink-500 transition-all duration-700"
                          style={{
                            width:
                              worker.progress,
                          }}
                        />

                      </div>

                    </div>

                  </div>



                  {/* TAGS */}
                  <p className="text-[12px] font-semibold text-[#1f1f3d]">

                    {
                      worker.distributed
                    }

                  </p>



                  {/* PERCENT */}
                  <p className="text-[12px] font-semibold text-[#8f8fa8]">

                    {
                      worker.percentage
                    }

                  </p>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>

  );
};

export default WorkersDistribution;
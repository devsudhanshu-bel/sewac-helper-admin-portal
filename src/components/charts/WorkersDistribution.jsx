import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

import {
  User,
  Loader2,
} from "lucide-react";

const WorkersDistribution = () => {

  const cardRef = useRef();

  const workersRef = useRef([]);

  // =========================================
  // STATE
  // =========================================
  const [workerData, setWorkerData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [totalDistributed, setTotalDistributed] =
    useState(0);

  // =========================================
  // FETCH WORKER DISTRIBUTION
  // =========================================
  useEffect(() => {

    const fetchWorkers =
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

            setLoading(false);

            return;
          }

          // =====================================
          // API CALL
          // =====================================
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

                cache: "no-store",
              }
            );

          if (!response.ok) {

            console.error(
              "API Error:",
              response.status
            );

            setLoading(false);

            return;
          }

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
            result?.success &&
            result?.data?.tagsByWorker
          ) {

            // =====================================
            // CLEAN DATA
            // =====================================
            const cleanedWorkers =
              result.data.tagsByWorker.map(
                (worker, index) => {

                  const distributedTags =
                    Number(
                      worker.distributedTags
                    ) || 0;

                  return {
                    id: index + 1,

                    worker:
                      worker.username ||
                      "Unknown",

                    distributedTags,
                  };

                }
              );

            // =====================================
            // TOTAL DISTRIBUTED
            // =====================================
            const total =
              cleanedWorkers.reduce(
                (
                  acc,
                  worker
                ) =>
                  acc +
                  worker.distributedTags,

                0
              );

            setTotalDistributed(total);

            // =====================================
            // FORMAT DATA
            // =====================================
            const formattedData =
              cleanedWorkers
                .filter(
                  (worker) =>
                    worker.distributedTags > 0
                )
                .map(
                  (
                    worker,
                    index
                  ) => {

                    const percentage =
                      total > 0
                        ? (
                            (worker.distributedTags /
                              total) *
                            100
                          ).toFixed(2)
                        : "0.00";

                    return {

                      id:
                        index + 1,

                      worker:
                        worker.worker,

                      distributed:
                        worker.distributedTags,

                      percentage:
                        `${percentage}%`,

                      progress:
                        `${Math.round(
                          Number(
                            percentage
                          )
                        )}%`,

                      rawValue:
                        worker.distributedTags,
                    };

                  }
                );

            // =====================================
            // SORT DESCENDING
            // =====================================
            formattedData.sort(
              (a, b) =>
                b.rawValue -
                a.rawValue
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

        } finally {

          setLoading(false);

        }
      };

    fetchWorkers();

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
      }
    );

    if (
      workersRef.current.length > 0
    ) {

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

    }

  }, [workerData, loading]);

  return (

    <div
      ref={cardRef}

      className="bg-white border border-purple-100 rounded-[26px] p-4 shadow-sm h-[420px] flex flex-col"
    >

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-[15px] font-bold text-[#1f1f3d]">

            Tags Distributed by Workers

          </h2>

          <p className="text-[11px] text-[#8f8fa8] mt-1">

            Total Distributed:
            {" "}
            <span className="font-bold text-pink-500">

              {totalDistributed.toLocaleString()}

            </span>

          </p>

        </div>

        <button className="text-pink-500 text-[11px] font-semibold hover:opacity-80 transition-all duration-200">

          Live

        </button>

      </div>

      {/* TABLE HEAD */}
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

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">

        {loading ? (

          <div className="h-[180px] flex flex-col items-center justify-center gap-3">

            <Loader2
              size={28}
              className="animate-spin text-pink-500"
            />

            <p className="text-[#8f8fa8] text-sm font-medium">

              Loading worker data...

            </p>

          </div>

        ) : workerData.length === 0 ? (

          <div className="h-[180px] flex items-center justify-center text-[#8f8fa8] text-sm font-medium">

            No worker data found

          </div>

        ) : (

          <div className="flex flex-col gap-4">

            {workerData.map(
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

                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-sm">

                      <User
                        size={15}
                        className="text-white"
                      />

                    </div>

                    <div className="flex-1">

                      <p className="text-[12px] font-semibold text-[#1f1f3d]">

                        {worker.worker}

                      </p>

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

                    {worker.distributed.toLocaleString()}

                  </p>

                  {/* PERCENT */}
                  <p className="text-[12px] font-semibold text-[#8f8fa8]">

                    {worker.percentage}

                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );
};

export default WorkersDistribution;
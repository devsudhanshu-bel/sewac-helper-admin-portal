import API_BASE_URL from "../services/api";
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

import {
  CalendarDays,
  Users,
  Clock3,
  FileText,
  Filter,
} from "lucide-react";

// =========================================
// LOGS PAGE
// =========================================
const Logs = () => {

  const pageRef = useRef();

  const cardsRef = useRef([]);

  const tableRef = useRef();

  // =========================================
  // API STATS
  // =========================================
  const [summary, setSummary] =
    useState({
      totalLogs: 0,
      todayLogs: 0,
      activeWorkers: 0,
      latestLog: "-",
    });

  // =========================================
  // LOGS DATA
  // =========================================
  const [logsData, setLogsData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================================
  // FILTERS
  // =========================================
  const [selectedWorker, setSelectedWorker] =
    useState("All");

  const [selectedDate, setSelectedDate] =
    useState("");

  // =========================================
  // PAGINATION
  // =========================================
  const recordsPerPage = 10;

  const [currentPage, setCurrentPage] =
    useState(1);

  // =========================================
  // WORKERS LIST
  // =========================================
const [workers, setWorkers] =
  useState(["All"]);

  // =========================================
  // FETCH SUMMARY
  // =========================================
  useEffect(() => {

    const fetchSummary =
      async () => {

        try {

          const token =
            sessionStorage.getItem(
              "token"
            );

          const response =
            await fetch(
              `${API_BASE_URL}/api/logs/summary`,
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

          if (
            result.success
          ) {

            setSummary(
              result.data
            );

            const workerCount =
    result.data.activeWorkers || 0;

            const generatedWorkers = [
    "All",
    ...Array.from(
      { length: workerCount },
      (_, i) =>
        `sewac${String(
          i + 1
        ).padStart(2, "0")}`
    ),
  ];

  setWorkers(
    generatedWorkers
  );

          }

        } catch (error) {

          console.error(
            "Summary Fetch Error:",
            error
          );

        }
      };

    fetchSummary();

  }, []);

  // =========================================
  // FETCH LOGS
  // =========================================
  useEffect(() => {

    const fetchLogs =
      async () => {

        try {

          setLoading(true);

          const token =
            sessionStorage.getItem(
              "token"
            );

          const response =
            await fetch(
              `${API_BASE_URL}/api/logs/all?limit=-1`,
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

          const result =
            await response.json();

          console.log(
            "LOGS:",
            result
          );

          let extractedLogs = [];

          // =====================================
          // HANDLE DIRECT ARRAY
          // =====================================
          if (
            Array.isArray(result)
          ) {

            extractedLogs =
              result;

          }

          // =====================================
          // HANDLE OBJECT RESPONSE
          // =====================================
          else if (
            result.success
          ) {

            if (
              Array.isArray(
                result.data
              )
            ) {

              extractedLogs =
                result.data;

            }

            else if (
              result.data &&
              Array.isArray(
                result.data.logs
              )
            ) {

              extractedLogs =
                result.data.logs;

            }

            else if (
              Array.isArray(
                result.logs
              )
            ) {

              extractedLogs =
                result.logs;

            }

          }

          // =====================================
          // SORT NEWEST FIRST
          // =====================================
          extractedLogs.sort(
            (a, b) =>
              new Date(
                b.time
              ) -
              new Date(
                a.time
              )
          );
          console.log(
  "TOTAL LOGS:",
  extractedLogs.length
);

console.log(
  "FIRST LOG:",
  extractedLogs[0]
);

console.log(
  "LAST LOG:",
  extractedLogs[
    extractedLogs.length - 1
  ]
);

const dates =
  [...new Set(
    extractedLogs.map(
      (log) =>
        log.time?.slice(0, 10)
    )
  )];

console.log(
  "AVAILABLE DATES:",
  dates
);

          setLogsData(
            extractedLogs
          );

        } catch (error) {

          console.error(
            "Failed to fetch logs:",
            error
          );

        } finally {

          setLoading(false);

        }
      };

    fetchLogs();

  }, []);

  // =========================================
  // FILTER LOGIC
  // =========================================
  const filteredLogs =
  logsData.filter((log) => {

    const workerMatch =
      selectedWorker === "All"
        ? true
        : log.worker === selectedWorker;

    let dateMatch = true;

    if (selectedDate && log.time) {

      const logDate =
        log.time.slice(0, 10);

      dateMatch =
        logDate === selectedDate;
    }

    return (
      workerMatch &&
      dateMatch
    );
  });

  // =========================================
  // RESET PAGE WHEN FILTER CHANGES
  // =========================================
  useEffect(() => {

    setCurrentPage(1);

  }, [
    selectedWorker,
    selectedDate,
  ]);

  // =========================================
  // PAGINATION
  // =========================================
  const totalRecords =
    filteredLogs.length;

  const totalPages =
    Math.ceil(
      totalRecords /
        recordsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    recordsPerPage;

  const endIndex =
    startIndex +
    recordsPerPage;

  const currentRecords =
    filteredLogs.slice(
      startIndex,
      endIndex
    );

  // =========================================
  // GSAP
  // =========================================
  useEffect(() => {

    gsap.fromTo(
      pageRef.current,

      {
        opacity: 0,
        y: 10,
      },

      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      cardsRef.current,

      {
        opacity: 0,
        y: 25,
      },

      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.1,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      tableRef.current,

      {
        opacity: 0,
        y: 20,
      },

      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      }
    );

  }, []);

  // =========================================
  // FORMAT TIME
  // =========================================
  const formattedLatestLog =
    summary.latestLog
      ? new Date(
          summary.latestLog
        ).toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "-";

  // =========================================
  // STATS
  // =========================================
  const stats = [
    {
      title: "Total Logs",
      value:
        logsData.length,
      icon: FileText,
      color:
        "from-pink-500 to-fuchsia-500",
    },

    {
      title: "Today's Logs",
      value:
        summary.todayLogs,
      icon:
        CalendarDays,
      color:
        "from-emerald-500 to-green-400",
    },

    {
      title:
        "Active Workers",
      value:
        summary.activeWorkers,
      icon: Users,
      color:
        "from-orange-400 to-amber-500",
    },

    {
      title:
        "Latest Log",
      value:
        formattedLatestLog,
      icon: Clock3,
      color:
        "from-violet-500 to-indigo-500",
    },
  ];

  return (

    <div
      ref={pageRef}
      className="w-full min-w-0 bg-[#f5f7fb] px-1 pt-1 pb-8"
    >

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <div>

          <h1 className="text-[28px] font-black text-[#1e1b4b]">

            Logs

          </h1>

          <p className="text-slate-500 mt-1 font-medium text-[14px]">

            Track all RFID distribution activities

          </p>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">

        {stats.map(
          (
            item,
            index
          ) => {

            const Icon =
              item.icon;

            return (

              <div
                key={index}
                ref={(el) =>
                  (cardsRef.current[
                    index
                  ] = el)
                }
                className="bg-white rounded-[22px] p-5 border border-slate-200 shadow-sm"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-slate-500 text-sm font-semibold">

                      {item.title}

                    </p>

                    <h2 className="text-[24px] font-black text-[#1e1b4b] mt-2">

                      {item.value}

                    </h2>

                  </div>

                  <div
                    className={`w-14 h-14 rounded-[18px] bg-gradient-to-br ${item.color} flex items-center justify-center text-white`}
                  >

                    <Icon size={24} />

                  </div>

                </div>

              </div>

            );
          }
        )}

      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-[22px] p-4 mb-5 shadow-sm">

        <div className="flex items-center gap-2 mb-4">

          <Filter
            size={18}
            className="text-pink-500"
          />

          <h2 className="text-[15px] font-bold text-[#1e1b4b]">

            Filters

          </h2>

        </div>

        <div className="flex flex-col md:flex-row gap-4">

          {/* WORKER FILTER */}
          <div className="flex flex-col gap-2">

            <label className="text-[12px] font-semibold text-slate-500">

              Worker

            </label>

            <select
              value={
                selectedWorker
              }
              onChange={(e) =>
                setSelectedWorker(
                  e.target.value
                )
              }
              className="
h-[44px]
min-w-[220px]

rounded-xl
border border-slate-200

px-4

text-[14px]
font-medium
text-slate-700

outline-none

focus:border-pink-400
focus:ring-2
focus:ring-pink-100
"
            >

              {workers.map(
                (
                  worker,
                  index
                ) => (

                  <option
                    key={index}
                    value={worker}
                  >

                    {worker}

                  </option>

                )
              )}

            </select>

          </div>

          {/* DATE FILTER */}
          <div className="flex flex-col gap-2">

            <label className="text-[12px] font-semibold text-slate-500">

              Date

            </label>

            <input
              type="date"
              value={
                selectedDate
              }
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
              className="
h-[44px]
min-w-[220px]

rounded-xl
border border-slate-200

px-4

text-[14px]
font-medium
text-slate-700

outline-none

focus:border-pink-400
focus:ring-2
focus:ring-pink-100
"
            />

          </div>

        </div>

      </div>

      {/* TABLE */}
      <div
        ref={tableRef}
        className="
bg-white
rounded-[24px]
border border-slate-200
shadow-[0_10px_35px_rgba(15,23,42,0.06)]
overflow-hidden
"
      >

        {/* TABLE HEADER */}
        <div className="overflow-x-auto w-full">

          <div className="min-w-max">

            <div className="bg-slate-100 border-b border-slate-200">

              <div className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_1.2fr_1fr]">

                <div className="px-6 py-4 text-[12px] font-bold text-slate-600">
                  #
                </div>

                <div className="px-6 py-4 text-[12px] font-bold text-slate-600">
                  Time
                </div>

                <div className="px-6 py-4 text-[12px] font-bold text-slate-600">
                  Worker
                </div>

                <div className="px-6 py-4 text-[12px] font-bold text-slate-600">
                  Action
                </div>

                <div className="px-6 py-4 text-[12px] font-bold text-slate-600">
                  Waste Type
                </div>

                <div className="px-6 py-4 text-[12px] font-bold text-slate-600">
                  RFID Tag
                </div>

                <div className="px-6 py-4 text-[12px] font-bold text-slate-600">
                  Phone
                </div>

              </div>

            </div>

            {/* BODY */}
            <div className="max-h-[650px] overflow-y-auto bg-white">

              {loading ? (

                <div className="h-[300px] flex items-center justify-center text-slate-500 font-semibold">

                  Loading logs...

                </div>

              ) : currentRecords.length === 0 ? (

                <div className="h-[300px] flex items-center justify-center text-red-500 font-semibold">

                  No logs found

                </div>

              ) : (

                currentRecords.map(
                  (
                    log,
                    index
                  ) => (

                    <div
                      key={index}

                      className="
grid
grid-cols-[80px_2fr_1fr_1fr_1fr_1.2fr_1fr]

border-b
border-slate-100

hover:bg-pink-50/40

transition-all
duration-200
"
                    >

                      {/* ID */}
                      <div className="px-6 py-5 text-[13px] font-semibold text-slate-700">

                        {startIndex +
                          index +
                          1}

                      </div>

                      {/* TIME */}
                      <div className="px-6 py-5 text-[13px] text-slate-700">

                        {log.time
                          ? new Date(
                              log.time
                            ).toLocaleString(
                              "en-IN"
                            )
                          : "N/A"}

                      </div>

                      {/* WORKER */}
                      <div className="px-6 py-5">

                        <span className="px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-[12px] font-semibold">

                          {log.worker ||
                            "N/A"}

                        </span>

                      </div>

                      {/* ACTION */}
                      <div className="px-6 py-5">

                        <span className="px-3 py-1.5 rounded-full bg-pink-100 text-pink-600 text-[12px] font-bold">

                          {log.action ||
                            "N/A"}

                        </span>

                      </div>

                      {/* WASTE */}
                      <div className="px-6 py-5 text-[13px] font-medium text-slate-700">

                        {log.wasteType ||
                          "N/A"}

                      </div>

                      {/* RFID */}
                      <div className="px-6 py-5 text-[13px] font-mono text-slate-700 break-all">

                        {log.rfidTag ||
                          "N/A"}

                      </div>

                      {/* PHONE */}
                      <div className="px-6 py-5 text-[13px] text-slate-700">

                        {log.phoneNumber ||
                          "N/A"}

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </div>

        {/* PAGINATION */}
        {!loading &&
          totalPages > 1 && (

            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">

              <p className="text-[13px] text-slate-500 font-medium">

                Showing
                {" "}
                {startIndex + 1}
                {" "}
                -
                {" "}
                {Math.min(
                  endIndex,
                  totalRecords
                )}
                {" "}
                of
                {" "}
                {totalRecords}
                {" "}
                logs

              </p>

              <div className="flex items-center gap-3">

                {/* PREV */}
                <button
                  disabled={
                    currentPage === 1
                  }

                  onClick={() =>
                    setCurrentPage(
                      (
                        prev
                      ) =>
                        prev - 1
                    )
                  }

                  className="
px-5 py-2.5

rounded-xl

bg-white
border border-slate-200

text-slate-700
text-sm
font-bold

shadow-sm

hover:bg-slate-100

disabled:opacity-40
disabled:cursor-not-allowed
"
                >

                  Prev

                </button>

                {/* PAGE */}
                <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold shadow-md min-w-[45px] text-center">

                  {currentPage}

                </div>

                {/* NEXT */}
                <button
                  disabled={
                    currentPage ===
                    totalPages
                  }

                  onClick={() =>
                    setCurrentPage(
                      (
                        prev
                      ) =>
                        prev + 1
                    )
                  }

                  className="
px-5 py-2.5

rounded-xl

bg-white
border border-slate-200

text-slate-700
text-sm
font-bold

shadow-sm

hover:bg-slate-100

disabled:opacity-40
disabled:cursor-not-allowed
"
                >

                  Next

                </button>

              </div>

            </div>

          )}

      </div>

    </div>

  );
};

export default Logs;
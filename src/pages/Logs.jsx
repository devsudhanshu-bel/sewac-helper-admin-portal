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
  Download,
  ChevronDown,
} from "lucide-react";



// =========================================
// DUMMY DATA
// =========================================
const logsData = [
  {
    id: 1,
    time: "10:30:45 AM",
    date: "May 20, 2025",
    worker: "sewac04",
    action: "DISTRIBUTED",
    tag: "E28011606000209F5E6381A",
  },

  {
    id: 2,
    time: "10:30:42 AM",
    date: "May 20, 2025",
    worker: "sewac01",
    action: "SCANNED",
    tag: "E28011606000209F5E63819",
  },

  {
    id: 3,
    time: "10:30:41 AM",
    date: "May 20, 2025",
    worker: "sewac05",
    action: "LOGIN",
    tag: "-",
  },

  {
    id: 4,
    time: "10:30:39 AM",
    date: "May 20, 2025",
    worker: "sewac12",
    action: "LOGOUT",
    tag: "-",
  },

  {
    id: 5,
    time: "10:31:10 AM",
    date: "May 20, 2025",
    worker: "sewac08",
    action: "SCANNED",
    tag: "E28011606000209F5E63820",
  },

  {
    id: 6,
    time: "10:31:22 AM",
    date: "May 20, 2025",
    worker: "sewac03",
    action: "DISTRIBUTED",
    tag: "E28011606000209F5E63821",
  },

  {
    id: 7,
    time: "10:31:50 AM",
    date: "May 20, 2025",
    worker: "sewac06",
    action: "LOGIN",
    tag: "-",
  },

  {
    id: 8,
    time: "10:32:04 AM",
    date: "May 20, 2025",
    worker: "sewac09",
    action: "SCANNED",
    tag: "E28011606000209F5E63822",
  },

  {
    id: 9,
    time: "10:32:15 AM",
    date: "May 20, 2025",
    worker: "sewac11",
    action: "DISTRIBUTED",
    tag: "E28011606000209F5E63823",
  },

  {
    id: 10,
    time: "10:32:33 AM",
    date: "May 20, 2025",
    worker: "sewac02",
    action: "LOGOUT",
    tag: "-",
  },

  {
    id: 11,
    time: "10:33:01 AM",
    date: "May 20, 2025",
    worker: "sewac07",
    action: "SCANNED",
    tag: "E28011606000209F5E63824",
  },

  {
    id: 12,
    time: "10:33:20 AM",
    date: "May 20, 2025",
    worker: "sewac01",
    action: "DISTRIBUTED",
    tag: "E28011606000209F5E63825",
  },
];



// =========================================
// LOGS PAGE
// =========================================
const Logs = () => {

  const pageRef = useRef();

  const cardsRef = useRef([]);

  const tableRef = useRef();



  // =========================================
  // FILTERS
  // =========================================
  const [workerFilter, setWorkerFilter] =
    useState("All");

  const [actionFilter, setActionFilter] =
    useState("All");



  // =========================================
  // PAGINATION
  // =========================================
  const recordsPerPage = 10;

  const [currentPage, setCurrentPage] =
    useState(1);



  // =========================================
  // FILTERED DATA
  // =========================================
  const filteredData =
    logsData.filter((item) => {

      const workerMatch =
        workerFilter === "All"
          ? true
          : item.worker ===
            workerFilter;

      const actionMatch =
        actionFilter === "All"
          ? true
          : item.action ===
            actionFilter;

      return (
        workerMatch &&
        actionMatch
      );
    });



  // =========================================
  // PAGINATION LOGIC
  // =========================================
  const totalRecords =
    filteredData.length;

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
    filteredData.slice(
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
  // STATS
  // =========================================
  const stats = [
    {
      title: "Total Logs",
      value: "12,549",
      icon: FileText,
      color:
        "from-pink-500 to-fuchsia-500",
    },

    {
      title: "Today's Logs",
      value: "248",
      icon: CalendarDays,
      color:
        "from-emerald-500 to-green-400",
    },

    {
      title: "Active Workers",
      value: "15",
      icon: Users,
      color:
        "from-orange-400 to-amber-500",
    },

    {
      title: "Latest Log",
      value: "10:30 AM",
      icon: Clock3,
      color:
        "from-violet-500 to-indigo-500",
    },
  ];



  return (

    <div
      ref={pageRef}
      className="min-h-screen bg-[#f5f7fb] px-0 pt-1 pb-8"
    >

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}
      <div className="flex items-center justify-between mb-4">

        <div>

          <h1 className="text-[26px] font-black text-[#1e1b4b] leading-none">
            Logs
          </h1>

          <p className="text-slate-500 mt-1 font-medium text-[14px]">
            Track all RFID distribution activities
          </p>

        </div>



        <div className="flex items-center gap-3">

          <button className="px-5 py-2.5 rounded-[16px] bg-white border border-slate-200 text-pink-500 font-semibold shadow-[0_2px_8px_rgba(15,23,42,0.04)]">

            ● Live

          </button>



          <button className="px-5 py-2.5 rounded-[16px] bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-semibold shadow-[0_8px_20px_rgba(236,72,153,0.22)] flex items-center gap-2">

            <Download size={17} />

            Export

          </button>

        </div>

      </div>



      {/* ========================================= */}
      {/* STATS */}
      {/* ========================================= */}
      <div className="grid grid-cols-4 gap-4 mb-5">

        {stats.map((item, index) => {

          const Icon = item.icon;

          return (

            <div
              key={index}

              ref={(el) =>
                (cardsRef.current[index] =
                  el)
              }

              className="relative overflow-hidden rounded-[22px] bg-white border border-slate-100 px-5 py-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)]"
            >

              {/* GLOW */}
              <div
                className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${item.color} opacity-10 blur-3xl`}
              />



              {/* CONTENT ROW */}
              <div className="flex items-center justify-between">

                {/* LEFT CONTENT */}
                <div>

                  <p className="text-slate-500 font-semibold text-[13px]">
                    {item.title}
                  </p>

                  <h2 className="text-[24px] font-black text-[#1e1b4b] mt-1 leading-none">
                    {item.value}
                  </h2>

                </div>



                {/* RIGHT ICON */}
                <div
                  className={`w-14 h-14 rounded-[18px] bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-lg shrink-0`}
                >

                  <Icon size={24} />

                </div>

              </div>



              {/* BOTTOM LINE */}
              <div
                className={`absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r ${item.color}`}
              />

            </div>

          );
        })}

      </div>



      {/* ========================================= */}
      {/* FILTER BAR */}
      {/* ========================================= */}
      <div className="bg-white rounded-[22px] px-5 py-4 border border-slate-100 shadow-[0_15px_35px_rgba(15,23,42,0.08)] flex items-center justify-between mb-5">

        <div className="flex items-center gap-4">

          {/* WORKER FILTER */}
          <div className="relative">

            <select
              value={workerFilter}

              onChange={(e) => {
                setWorkerFilter(
                  e.target.value
                );

                setCurrentPage(1);
              }}

              className="appearance-none min-w-[200px] px-5 py-3 rounded-[16px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 outline-none text-slate-700 font-semibold shadow-sm hover:border-violet-300 transition-all cursor-pointer"
            >

              <option value="All">
                All Workers
              </option>

              <option value="sewac01">
                sewac01
              </option>

              <option value="sewac02">
                sewac02
              </option>

              <option value="sewac03">
                sewac03
              </option>

              <option value="sewac04">
                sewac04
              </option>

            </select>



            <ChevronDown
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />

          </div>



          {/* ACTION FILTER */}
          <div className="relative">

            <select
              value={actionFilter}

              onChange={(e) => {
                setActionFilter(
                  e.target.value
                );

                setCurrentPage(1);
              }}

              className="appearance-none min-w-[200px] px-5 py-3 rounded-[16px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 outline-none text-slate-700 font-semibold shadow-sm hover:border-violet-300 transition-all cursor-pointer"
            >

              <option value="All">
                All Actions
              </option>

              <option value="DISTRIBUTED">
                DISTRIBUTED
              </option>

              <option value="SCANNED">
                SCANNED
              </option>

              <option value="LOGIN">
                LOGIN
              </option>

              <option value="LOGOUT">
                LOGOUT
              </option>

            </select>



            <ChevronDown
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />

          </div>

        </div>



        <button className="px-5 py-3 rounded-[16px] bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold flex items-center gap-2 shadow-[0_6px_18px_rgba(139,92,246,0.2)]">

          <Filter size={17} />

          Filter

        </button>

      </div>



      {/* ========================================= */}
      {/* TABLE */}
      {/* ========================================= */}
      <div
        ref={tableRef}
        className="overflow-hidden rounded-[22px] bg-white border border-slate-100 shadow-[0_15px_35px_rgba(15,23,42,0.08)]"
      >

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="text-left px-8 py-5 text-slate-500 text-sm font-semibold">
                #
              </th>

              <th className="text-left px-8 py-5 text-slate-500 text-sm font-semibold">
                Time
              </th>

              <th className="text-left px-8 py-5 text-slate-500 text-sm font-semibold">
                Worker
              </th>

              <th className="text-left px-8 py-5 text-slate-500 text-sm font-semibold">
                Action
              </th>

              <th className="text-left px-8 py-5 text-slate-500 text-sm font-semibold">
                RFID Tag
              </th>

            </tr>

          </thead>



          <tbody>

            {currentRecords.map((log) => (

              <tr
                key={log.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition-all duration-300"
              >

                <td className="px-8 py-5 font-semibold text-slate-700">
                  {log.id}
                </td>



                <td className="px-8 py-5">

                  <div className="flex flex-col">

                    <span className="font-bold text-[#1e1b4b]">
                      {log.time}
                    </span>

                    <span className="text-sm text-slate-500 mt-1">
                      {log.date}
                    </span>

                  </div>

                </td>



                <td className="px-8 py-5">

                  <div className="flex items-center gap-4">

                    <img
                      src={`https://i.pravatar.cc/100?img=${log.id}`}
                      alt=""
                      className="w-10 h-10 rounded-2xl"
                    />



                    <div>

                      <h3 className="font-bold text-[#1e1b4b]">
                        {log.worker}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Worker
                      </p>

                    </div>

                  </div>

                </td>



                <td className="px-8 py-5">

                  <span
                    className={`px-4 py-2 rounded-2xl text-xs font-bold

                    ${
                      log.action ===
                      "DISTRIBUTED"
                        ? "bg-emerald-100 text-emerald-600"

                        : log.action ===
                          "SCANNED"
                        ? "bg-blue-100 text-blue-600"

                        : log.action ===
                          "LOGIN"
                        ? "bg-violet-100 text-violet-600"

                        : "bg-rose-100 text-rose-600"
                    }
                    `}
                  >
                    {log.action}
                  </span>

                </td>



                <td className="px-8 py-5 font-medium text-slate-700 break-all">
                  {log.tag}
                </td>

              </tr>

            ))}

          </tbody>

        </table>



        {/* ========================================= */}
        {/* PAGINATION */}
        {/* ========================================= */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100">

          <div className="text-sm text-slate-500 font-medium">

            Showing{" "}

            <span className="font-bold text-[#1e1b4b]">
              {startIndex + 1}
            </span>

            {" "}to{" "}

            <span className="font-bold text-[#1e1b4b]">
              {Math.min(
                endIndex,
                totalRecords
              )}
            </span>

            {" "}of{" "}

            <span className="font-bold text-[#1e1b4b]">
              {totalRecords}
            </span>

            {" "}records

          </div>



          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.max(prev - 1, 1)
                )
              }

              disabled={currentPage === 1}

              className={`px-5 py-2 rounded-[14px] font-semibold transition-all

              ${
                currentPage === 1
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"

                  : "bg-violet-500 text-white hover:bg-violet-600"
              }
              `}
            >
              Previous
            </button>



            <div className="text-sm font-bold text-[#1e1b4b]">

              Page {currentPage} of {totalPages}

            </div>



            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                )
              }

              disabled={
                currentPage === totalPages
              }

              className={`px-5 py-2 rounded-[14px] font-semibold transition-all

              ${
                currentPage === totalPages
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"

                  : "bg-violet-500 text-white hover:bg-violet-600"
              }
              `}
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Logs;
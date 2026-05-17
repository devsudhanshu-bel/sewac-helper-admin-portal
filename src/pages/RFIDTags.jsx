import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

import {
  Search,
  Filter,
  CheckCircle2,
  Leaf,
  Trash2,
} from "lucide-react";



// =========================================
// DUMMY DATA
// =========================================
const rfidData = [
  {
    id: 1,
    rfid: "RFID1234ABCD",
    phone: "+91 98765 43210",
    wasteType: "Wet",
    status: "Mapped",
  },

  {
    id: 2,
    rfid: "RFID5678EFGH",
    phone: "+91 91234 56789",
    wasteType: "Dry",
    status: "Mapped",
  },

  {
    id: 3,
    rfid: "RFID9101IJKL",
    phone: "+91 99887 76655",
    wasteType: "Wet",
    status: "Unmapped",
  },

  {
    id: 4,
    rfid: "RFID1415MNOP",
    phone: "+91 87654 32109",
    wasteType: "Dry",
    status: "Mapped",
  },

  {
    id: 5,
    rfid: "RFID1617QRST",
    phone: "+91 93456 78901",
    wasteType: "Wet",
    status: "Mapped",
  },

  {
    id: 6,
    rfid: "RFID1819UVWX",
    phone: "+91 90000 11122",
    wasteType: "Dry",
    status: "Unmapped",
  },

  {
    id: 7,
    rfid: "RFID2021YZAB",
    phone: "+91 95555 66777",
    wasteType: "Wet",
    status: "Mapped",
  },

  {
    id: 8,
    rfid: "RFID2223CDEF",
    phone: "+91 88888 12345",
    wasteType: "Dry",
    status: "Mapped",
  },

  {
    id: 9,
    rfid: "RFID2425GHIJ",
    phone: "+91 77777 88888",
    wasteType: "Wet",
    status: "Mapped",
  },

  {
    id: 10,
    rfid: "RFID2627KLMN",
    phone: "+91 66666 99999",
    wasteType: "Dry",
    status: "Mapped",
  },

  {
    id: 11,
    rfid: "RFID2829OPQR",
    phone: "+91 99999 22222",
    wasteType: "Wet",
    status: "Unmapped",
  },

  {
    id: 12,
    rfid: "RFID3031STUV",
    phone: "+91 88888 44444",
    wasteType: "Dry",
    status: "Mapped",
  },
];



// =========================================
// RFID TAGS PAGE
// =========================================
const RFIDTags = () => {

  const pageRef = useRef();

  const tableRef = useRef();



  // =========================================
  // FILTERS
  // =========================================
  const [wasteFilter, setWasteFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
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
    rfidData.filter((item) => {

      const wasteMatch =
        wasteFilter === "All"
          ? true
          : item.wasteType ===
            wasteFilter;

      const statusMatch =
        statusFilter === "All"
          ? true
          : item.status ===
            statusFilter;

      return (
        wasteMatch &&
        statusMatch
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
  // WASTE BADGE
  // =========================================
  const getWasteBadge = (
    type
  ) => {

    if (type === "Wet") {

      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-600 font-semibold text-sm">

          <Leaf size={16} />

          Wet Waste

        </div>
      );
    }



    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 text-blue-600 font-semibold text-sm">

        <Trash2 size={16} />

        Dry Waste

      </div>
    );
  };



  return (

    <div
      ref={pageRef}
      className="min-h-screen bg-[#f5f7fb] px-0 pt-0 pb-8"
    >

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}
      <div className="flex items-center justify-between mb-4">

        <div>

          <h1 className="text-[26px] font-black text-[#1e1b4b] leading-none">
            RFID Tags
          </h1>

          <p className="text-slate-500 mt-1 font-medium text-[14px]">
            View and manage all RFID mappings
          </p>

        </div>



        {/* SEARCH */}
        <div className="relative">

          <input
            type="text"
            placeholder="Search RFID or Phone..."
            className="w-[300px] pl-5 pr-12 py-3 rounded-[16px] border border-slate-200 outline-none bg-white shadow-[0_4px_14px_rgba(15,23,42,0.05)] font-medium"
          />



          <Search
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

        </div>

      </div>



      {/* ========================================= */}
      {/* TABLE CONTAINER */}
      {/* ========================================= */}
      <div
        ref={tableRef}
        className="bg-white rounded-[22px] border border-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.08)] overflow-hidden"
      >

        {/* ========================================= */}
        {/* TOP BAR */}
        {/* ========================================= */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-[16px] bg-violet-100 flex items-center justify-center">

              <span className="text-violet-700 font-black text-xs tracking-wider">
                RFID
              </span>

            </div>



            <div>

              <h2 className="text-[20px] font-black text-[#1e1b4b]">
                All RFID Tags
              </h2>

              <p className="text-slate-500 text-sm font-medium mt-1">
                {totalRecords} Total Tags
              </p>

            </div>

          </div>



          {/* FILTERS */}
          <div className="flex items-center gap-4">

            <select
              value={wasteFilter}

              onChange={(e) => {
                setWasteFilter(
                  e.target.value
                );

                setCurrentPage(1);
              }}

              className="px-5 py-3 rounded-[16px] bg-gradient-to-r from-white to-slate-50 border border-slate-200 outline-none text-slate-700 font-semibold shadow-[0_4px_14px_rgba(15,23,42,0.05)] hover:border-violet-300 transition-all"
            >

              <option value="All">
                All Waste
              </option>

              <option value="Wet">
                Wet
              </option>

              <option value="Dry">
                Dry
              </option>

            </select>



            <select
              value={statusFilter}

              onChange={(e) => {
                setStatusFilter(
                  e.target.value
                );

                setCurrentPage(1);
              }}

              className="px-5 py-3 rounded-[16px] bg-gradient-to-r from-white to-slate-50 border border-slate-200 outline-none text-slate-700 font-semibold shadow-[0_4px_14px_rgba(15,23,42,0.05)] hover:border-violet-300 transition-all"
            >

              <option value="All">
                All Status
              </option>

              <option value="Mapped">
                Mapped
              </option>

              <option value="Unmapped">
                Unmapped
              </option>

            </select>



            <button className="px-5 py-3 rounded-[16px] bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold flex items-center gap-2 shadow-[0_8px_20px_rgba(139,92,246,0.25)]">

              <Filter size={17} />

              Filter

            </button>

          </div>

        </div>



        {/* ========================================= */}
        {/* TABLE */}
        {/* ========================================= */}
        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="text-left px-8 py-5 text-slate-500 text-sm font-semibold">
                Sl No.
              </th>

              <th className="text-left px-8 py-5 text-slate-500 text-sm font-semibold">
                RFID
              </th>

              <th className="text-left px-8 py-5 text-slate-500 text-sm font-semibold">
                Phone No.
              </th>

              <th className="text-left px-8 py-5 text-slate-500 text-sm font-semibold">
                Waste Type
              </th>

              <th className="text-left px-8 py-5 text-slate-500 text-sm font-semibold">
                Status
              </th>

            </tr>

          </thead>



          <tbody>

            {currentRecords.map(
              (item) => (

                <tr
                  key={item.id}
                  className="border-t border-slate-100 hover:bg-slate-50 transition-all duration-300"
                >

                  <td className="px-8 py-5 font-semibold text-slate-700">
                    {item.id}
                  </td>



                  <td className="px-8 py-5 font-bold text-[#1e1b4b]">
                    {item.rfid}
                  </td>



                  <td className="px-8 py-5 font-semibold text-slate-700">
                    {item.phone}
                  </td>



                  <td className="px-8 py-5">

                    {getWasteBadge(
                      item.wasteType
                    )}

                  </td>



                  <td className="px-8 py-5">

                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-sm

                      ${
                        item.status ===
                        "Mapped"

                          ? "bg-emerald-50 text-emerald-600"

                          : "bg-rose-50 text-rose-600"
                      }
                      `}
                    >

                      <CheckCircle2 size={16} />

                      {item.status}

                    </div>

                  </td>

                </tr>
              )
            )}

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

            {" "}entries

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

export default RFIDTags;
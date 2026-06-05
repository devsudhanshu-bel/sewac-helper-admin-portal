import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

import {
  Search,
  CheckCircle2,
  Leaf,
  Trash2,
} from "lucide-react";



// =========================================
// RFID TAGS PAGE
// =========================================
const RFIDTags = () => {

  const pageRef = useRef();

  const tableRef = useRef();



  // =========================================
  // STATES
  // =========================================
  const [rfidData, setRfidData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");



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
  // FETCH RFID DATA
  // =========================================
  useEffect(() => {

    const fetchRFIDData =
      async () => {

        try {

          const token =
            sessionStorage.getItem(
              "token"
            );



          const response =
            await fetch(
              "http://18.60.41.32:5000/api/rfid/all",
              {
                method: "GET",

                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type":
                    "application/json",
                },
              }
            );



          const data =
            await response.json();



          console.log(
            "RFID DATA:",
            data
          );



          setRfidData(
            data?.data || []
          );

        } catch (error) {

          console.error(
            "Failed to fetch RFID data:",
            error
          );

        } finally {

          setLoading(false);

        }
      };



    fetchRFIDData();

  }, []);




  // =========================================
  // FILTERED DATA
  // =========================================
  const filteredData =
    rfidData.filter((item) => {

      // NORMALIZED VALUES
      const normalizedWaste =
        item?.wasteType
          ?.trim()
          ?.toUpperCase();

      const normalizedStatus =
        item?.status
          ?.trim()
          ?.toUpperCase();

      // SEARCH
      const searchMatch =

        item?.phoneNumber
          ?.toLowerCase()
          ?.includes(
            searchTerm.toLowerCase()
          ) ||

        item?.rfid
          ?.toLowerCase()
          ?.includes(
            searchTerm.toLowerCase()
          ) ||

        item?.slno
          ?.toString()
          ?.includes(searchTerm);

      // WASTE FILTER
      const wasteMatch =
        wasteFilter === "All"
          ? true
          : normalizedWaste?.includes(
              wasteFilter
                .trim()
                .toUpperCase()
            );

      // STATUS FILTER
      const statusMatch =
        statusFilter === "All"
          ? true
          : normalizedStatus ===
            statusFilter
              .trim()
              .toUpperCase();

      return (
        searchMatch &&
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

    // NULL / NU
    if (
      !type ||
      type?.toUpperCase() === "NU" ||
      type?.toUpperCase() === "NULL"
    ) {

      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 text-slate-500 font-semibold text-sm">

          NULL

        </div>
      );
    }



    // WET
    if (
      type
        ?.toUpperCase()
        .includes("WET")
    ) {

      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-600 font-semibold text-sm">

          <Leaf size={16} />

          Wet Waste

        </div>
      );
    }



    // DRY
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

      {/* HEADER */}
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

            value={searchTerm}

            onChange={(e) => {

              setSearchTerm(
                e.target.value
              );

              setCurrentPage(1);
            }}

            placeholder="Search SL No, RFID or Phone..."

            className="
            w-[320px]
            pl-5
            pr-12
            py-3
            rounded-[16px]
            border
            border-slate-200
            outline-none
            bg-white
            text-black
            placeholder:text-slate-400
            shadow-[0_4px_14px_rgba(15,23,42,0.05)]
            font-medium
            "
          />



          <Search
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

        </div>

      </div>



      {/* TABLE */}
      <div
        ref={tableRef}
        className="bg-white rounded-[22px] border border-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.08)] overflow-hidden"
      >

        {/* TOP BAR */}
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

              className="px-5 py-3 rounded-[16px] bg-white border border-slate-200 outline-none text-slate-700 font-semibold"
            >

              <option value="All">
                All Waste
              </option>

              <option value="WET">
                Wet
              </option>

              <option value="DRY">
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

              className="px-5 py-3 rounded-[16px] bg-white border border-slate-200 outline-none text-slate-700 font-semibold"
            >

              <option value="All">
                All Status
              </option>

              <option value="MAPPED">
                Mapped
              </option>

              <option value="UNMAPPED">
                Unmapped
              </option>

            </select>

          </div>

        </div>



        {/* TABLE */}
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

            {loading ? (

              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-slate-500 font-semibold"
                >
                  Loading RFID data...
                </td>
              </tr>

            ) : currentRecords.length === 0 ? (

              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-slate-500 font-semibold"
                >
                  No RFID tags found
                </td>
              </tr>

            ) : (

              currentRecords.map(
                (item, index) => (

                  <tr
                    key={index}
                    className="border-t border-slate-100 hover:bg-slate-50 transition-all duration-300"
                  >

                    {/* SL NO */}
                    <td className="px-8 py-5 font-semibold text-slate-700">
                      {item?.slno}
                    </td>



                    {/* RFID */}
                    <td className="px-8 py-5 font-bold text-[#1e1b4b]">
                      {item?.rfid}
                    </td>



                    {/* PHONE */}
                    <td className="px-8 py-5 font-semibold text-slate-700">

                      {
                        item?.phoneNumber === "NU" ||
                        item?.phoneNumber === null ||
                        item?.phoneNumber === ""
                          ? "NULL"
                          : item?.phoneNumber
                      }

                    </td>



                    {/* WASTE */}
                    <td className="px-8 py-5">

                      {getWasteBadge(
                        item?.wasteType
                      )}

                    </td>



                    {/* STATUS */}
                    <td className="px-8 py-5">

                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-sm

                        ${
                          item?.status
                            ?.toUpperCase() ===
                          "MAPPED"

                            ? "bg-emerald-50 text-emerald-600"

                            : "bg-rose-50 text-rose-600"
                        }
                        `}
                      >

                        <CheckCircle2 size={16} />

                        {item?.status}

                      </div>

                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>



        {/* PAGINATION */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100">

          <div className="text-sm text-slate-500 font-medium">

            Showing{" "}

            <span className="font-bold text-[#1e1b4b]">
              {totalRecords === 0
                ? 0
                : startIndex + 1}
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

              Page {currentPage} of {totalPages || 1}

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
                currentPage === totalPages ||
                totalPages === 0
              }

              className={`px-5 py-2 rounded-[14px] font-semibold transition-all

              ${
                currentPage === totalPages ||
                totalPages === 0
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
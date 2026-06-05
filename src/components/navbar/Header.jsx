import React, { useEffect, useRef, useState } from "react";

import { CalendarDays, Download } from "lucide-react";

import gsap from "gsap";

const Header = () => {
  const headerRef = useRef();

  const [exporting, setExporting] = useState(false);

  const titleRef = useRef();

  const subtitleRef = useRef();

  const rightSectionRef = useRef([]);

  // =========================================
  // DYNAMIC DATE
  // =========================================
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // =========================================
  // EXPORT CSV
  // =========================================
  const handleExport = async () => {
    setExporting(true);

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        "http://18.60.41.32:5000/api/dashboard/worker-distribution",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (!result.success || !result.data?.tagsByWorker) {
        return;
      }

      const workers = result.data.tagsByWorker;

      const total = workers.reduce(
        (sum, worker) => sum + worker.distributedTags,
        0,
      );

      const csvRows = [["Worker", "Distributed Tags", "Percentage"]];

      workers.forEach((worker) => {
        csvRows.push([
          worker.username,
          worker.distributedTags,
          ((worker.distributedTags / total) * 100).toFixed(2) + "%",
        ]);
      });

      const csvContent = csvRows.map((row) => row.join(",")).join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `worker-distribution-${
        new Date().toISOString().split("T")[0]
      }.csv`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    // FAST + CLEAN LOAD
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
      },
    });

    // HEADER FADE
    tl.fromTo(
      headerRef.current,

      {
        opacity: 0,
      },

      {
        opacity: 1,
        duration: 0.15,
      },
    )

      // TITLE
      .fromTo(
        titleRef.current,

        {
          y: -20,
          opacity: 0,
        },

        {
          y: 0,
          opacity: 1,
          duration: 0.3,
        },

        "-=0.05",
      )

      // SUBTITLE
      .fromTo(
        subtitleRef.current,

        {
          y: 8,
          opacity: 0,
        },

        {
          y: 0,
          opacity: 1,
          duration: 0.25,
        },

        "-=0.18",
      )

      // RIGHT SIDE
      .fromTo(
        rightSectionRef.current,

        {
          y: -12,
          opacity: 0,
          scale: 0.97,
        },

        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.04,
          duration: 0.25,
        },

        "-=0.18",
      );
  }, []);

  return (
    <div
      ref={headerRef}
      className="w-full flex items-center justify-between mb-6"
    >
      {/* LEFT SIDE */}
      <div>
        {/* TITLE */}
        <h1
          ref={titleRef}
          className="text-[30px] font-bold text-[#1f1f3d] tracking-tight leading-none"
        >
          Dashboard
        </h1>

        {/* SUBTITLE */}
        <p
          ref={subtitleRef}
          className="text-[#8c8ca8] text-[13px] mt-1 font-medium"
        >
          Real-time RFID distribution analytics
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        {/* LIVE STATUS */}
        <div
          ref={(el) => (rightSectionRef.current[0] = el)}
          className="flex items-center gap-2 bg-white border border-purple-100 px-4 py-2.5 rounded-2xl shadow-sm hover:scale-[1.02] transition-all duration-200"
        >
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />

            <div className="absolute inset-0 rounded-full bg-pink-500 animate-ping opacity-70" />
          </div>

          <span className="text-[#2b2b52] font-semibold text-[13px]">Live</span>
        </div>

        {/* DATE */}
        <div
          ref={(el) => (rightSectionRef.current[1] = el)}
          className="flex items-center gap-2 bg-white border border-purple-100 px-4 py-2.5 rounded-2xl shadow-sm hover:scale-[1.02] transition-all duration-200"
        >
          <CalendarDays size={16} className="text-[#9b87f5]" />

          <span className="text-[#2b2b52] font-medium text-[13px]">
            {currentDate}
          </span>
        </div>

        {/* EXPORT BUTTON */}
        <button
          ref={(el) => (rightSectionRef.current[2] = el)}
          onClick={handleExport}
          disabled={exporting}
          className={`
    h-[46px]
    px-5
    rounded-2xl
    bg-gradient-to-r
    from-pink-500
    to-purple-500
    text-white
    font-semibold
    text-[13px]
    flex
    items-center
    gap-2
    cursor-pointer
    transition-all
    duration-200

    shadow-[0_10px_25px_rgba(255,79,163,0.25)]
    hover:shadow-[0_20px_40px_rgba(168,85,247,0.45)]
    hover:-translate-y-0.5
    hover:scale-[1.03]

    active:scale-[0.96]
    active:translate-y-1

    disabled:opacity-70
    disabled:cursor-not-allowed
  `}
        >
          <Download size={16} className={exporting ? "animate-bounce" : ""} />

          {exporting ? "Exporting..." : "Export"}
        </button>
      </div>
    </div>
  );
};

export default Header;

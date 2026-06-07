import API_BASE_URL from "../../services/api";
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Tag,
  CheckCircle2,
  ScanLine,
  Users,
} from "lucide-react";

import gsap from "gsap";

const StatsCards = () => {

  const cardsRef = useRef([]);

  const progressRef = useRef([]);

  // =========================================
  // STATS DATA
  // =========================================
  const [statsData, setStatsData] =
    useState([
      {
        title: "Total RFID Tags",

        value: 0,

        subtitle: "Live RFID count",

        icon: Tag,

        iconBg:
          "from-pink-500 to-rose-500",

        progress:
          "bg-pink-500",

        progressWidth:
          "100%",
      },

      {
        title: "Distributed Tags",

        value: 0,

        subtitle:
          "Live distributed count",

        icon: CheckCircle2,

        iconBg:
          "from-purple-500 to-fuchsia-500",

        progress:
          "bg-purple-500",

        progressWidth:
          "0%",
      },

      {
        title: "Remaining Tags",

        value: 0,

        subtitle:
          "Remaining RFID tags",

        icon: ScanLine,

        iconBg:
          "from-violet-500 to-indigo-500",

        progress:
          "bg-violet-500",

        progressWidth:
          "0%",
      },

      {
        title: "Workers",

        value: 0,

        totalWorkers: 0,

        subtitle:
          "0 Workers",

        icon: Users,

        iconBg:
          "from-orange-400 to-orange-500",

        progress:
          "bg-orange-400",

        progressWidth:
          "0%",
      },
    ]);

  // =========================================
  // COUNTS
  // =========================================
  const [counts, setCounts] =
    useState([0, 0, 0, 0]);

  // =========================================
  // FETCH DASHBOARD DATA
  // =========================================
  useEffect(() => {

    const fetchDashboardData =
      async () => {

        try {

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

            return;
          }

          // =====================================
          // FETCH APIS
          // =====================================
          const [
            totalResponse,
            distributedResponse,
            summaryResponse,
          ] = await Promise.all([

            fetch(
              `${API_BASE_URL}/api/dashboard/total-rfid-tags`,
              {
                method: "GET",

                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type":
                    "application/json",
                },
              }
            ),

            fetch(
              `${API_BASE_URL}/api/dashboard/distributed-tags`,
              {
                method: "GET",

                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type":
                    "application/json",
                },
              }
            ),

            fetch(
              `${API_BASE_URL}/api/logs/summary`,
              {
                method: "GET",

                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type":
                    "application/json",
                },
              }
            ),
          ]);

          // =====================================
          // RESPONSE CHECK
          // =====================================
          if (
            !totalResponse.ok ||
            !distributedResponse.ok ||
            !summaryResponse.ok
          ) {

            console.error(
              "API request failed"
            );

            return;
          }

          // =====================================
          // JSON DATA
          // =====================================
          const totalData =
            await totalResponse.json();

          const distributedData =
            await distributedResponse.json();

          const summaryData =
            await summaryResponse.json();

          console.log(
            "TOTAL RFID:",
            totalData
          );

          console.log(
            "DISTRIBUTED RFID:",
            distributedData
          );

          console.log(
            "SUMMARY:",
            summaryData
          );

          // =====================================
          // VALUES
          // =====================================
          const totalRFID =
            totalData?.data
              ?.totalRFIDTags || 0;

          const distributedRFID =
            distributedData?.data
              ?.distributedTags || 0;

          const remainingRFID =
            totalRFID -
            distributedRFID;

          const activeWorkers =
            summaryData?.data
              ?.activeWorkers || 0;

          const totalWorkers =
            summaryData?.data
              ?.totalWorkers || activeWorkers;

          // =====================================
          // PERCENTAGES
          // =====================================
          const distributedPercentage =
            totalRFID > 0
              ? Math.round(
                  (distributedRFID /
                    totalRFID) *
                    100
                )
              : 0;

          const remainingPercentage =
            totalRFID > 0
              ? Math.round(
                  (remainingRFID /
                    totalRFID) *
                    100
                )
              : 0;

          const activeWorkerPercentage =
            totalWorkers > 0
              ? Math.round(
                  (activeWorkers /
                    totalWorkers) *
                    100
                )
              : 0;

          // =====================================
          // UPDATE STATE
          // =====================================
          setStatsData([
            {
              title:
                "Total RFID Tags",

              value:
                totalRFID,

              subtitle:
                "Live RFID count",

              icon: Tag,

              iconBg:
                "from-pink-500 to-rose-500",

              progress:
                "bg-pink-500",

              progressWidth:
                "100%",
            },

            {
              title:
                "Distributed Tags",

              value:
                distributedRFID,

              subtitle: `${distributedPercentage}% completed`,

              icon:
                CheckCircle2,

              iconBg:
                "from-purple-500 to-fuchsia-500",

              progress:
                "bg-purple-500",

              progressWidth: `${distributedPercentage}%`,
            },

            {
              title:
                "Remaining Tags",

              value:
                remainingRFID,

              subtitle: `${remainingPercentage}% remaining`,

              icon:
                ScanLine,

              iconBg:
                "from-violet-500 to-indigo-500",

              progress:
                "bg-violet-500",

              progressWidth: `${remainingPercentage}%`,
            },

            {
              title:
                "Workers",

              value:
                activeWorkers,

              totalWorkers:
                totalWorkers,

              subtitle:
                `${activeWorkers} current workers`,

              icon: Users,

              iconBg:
                "from-orange-400 to-orange-500",

              progress:
                "bg-orange-400",

              progressWidth: `${activeWorkerPercentage}%`,
            },
          ]);

        } catch (error) {

          console.error(
            "Dashboard fetch failed:",
            error
          );

        }
      };

    fetchDashboardData();

  }, []);

  // =========================================
  // GSAP ANIMATION
  // =========================================
  useEffect(() => {

    // CARD LOAD
    cardsRef.current.forEach(
      (card, index) => {

        if (!card) return;

        gsap.fromTo(
          card,

          {
            y: 35,
            opacity: 0,
            scale: 0.985,
          },

          {
            y: 0,
            opacity: 1,
            scale: 1,

            duration: 0.45,

            delay:
              index * 0.06,

            ease:
              "power3.out",
          }
        );

      }
    );

    // PROGRESS BAR
    progressRef.current.forEach(
      (bar, index) => {

        if (!bar) return;

        gsap.fromTo(
          bar,

          {
            width: "0%",
          },

          {
            width:
              statsData[index]
                .progressWidth,

            duration: 1,

            delay:
              0.2 +
              index * 0.05,

            ease:
              "power3.out",
          }
        );

      }
    );

    // COUNTER
    statsData.forEach(
      (card, index) => {

        const counter = {
          value: 0,
        };

        gsap.to(counter, {

          value: card.value,

          duration: 1.2,

          delay:
            0.15 +
            index * 0.05,

          ease:
            "power2.out",

          onUpdate: () => {

            setCounts(
              (prev) => {

                const updated =
                  [...prev];

                updated[index] =
                  Math.floor(
                    counter.value
                  );

                return updated;
              }
            );

          },
        });

      }
    );

  }, [statsData]);

  return (

    <div className="grid grid-cols-4 gap-4 mb-5">

      {statsData.map(
        (card, index) => {

          const Icon =
            card.icon;

          return (

            <div
              key={index}

              ref={(el) =>
                (cardsRef.current[
                  index
                ] = el)
              }

              className="bg-white border border-purple-100 rounded-[22px] px-5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] hover:shadow-[0_14px_40px_rgba(15,23,42,0.12)] hover:-translate-y-[2px] transition-all duration-300"
            >

              {/* CONTENT */}
              <div className="flex items-center justify-between">

                {/* LEFT */}
                <div>

                  {/* TITLE */}
                  <p className="text-[#7d7d99] text-[13px] font-semibold">

                    {card.title}

                  </p>

                  {/* NUMBER */}
                  <h2 className="text-[30px] font-black text-[#1f1f3d] mt-1 leading-none">

                    {card.title ===
                    "Active Workers"
                      ? `${counts[index]} / ${statsData[index].totalWorkers}`
                      : counts[
                          index
                        ].toLocaleString()}

                  </h2>

                  {/* SUBTITLE */}
                  <p className="text-[#9a9ab3] text-[11px] font-medium mt-2">

                    {card.subtitle}

                  </p>

                </div>

                {/* ICON */}
                <div
                  className={`w-14 h-14 rounded-[18px] bg-gradient-to-br ${card.iconBg} flex items-center justify-center shadow-lg`}
                >

                  <Icon
                    size={24}
                    className="text-white"
                  />

                </div>

              </div>

              {/* PROGRESS */}
              <div className="w-full h-[5px] rounded-full bg-[#ece8f6] mt-4 overflow-hidden">

                <div
                  ref={(el) =>
                    (progressRef.current[
                      index
                    ] = el)
                  }

                  className={`${card.progress} h-full rounded-full`}
                />

              </div>

            </div>
          );
        }
      )}

    </div>

  );
};

export default StatsCards;
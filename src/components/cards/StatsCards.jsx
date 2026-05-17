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

        subtitle: "Live distributed count",

        icon: CheckCircle2,

        iconBg:
          "from-purple-500 to-fuchsia-500",

        progress:
          "bg-purple-500",

        progressWidth:
          "74%",
      },

      {
        title: "Remaining Tags",

        value: 0,

        subtitle: "Remaining RFID tags",

        icon: ScanLine,

        iconBg:
          "from-violet-500 to-indigo-500",

        progress:
          "bg-violet-500",

        progressWidth:
          "25%",
      },

      {
        title: "Active Workers",

        value: 15,

        subtitle: "100% active",

        icon: Users,

        iconBg:
          "from-orange-400 to-orange-500",

        progress:
          "bg-orange-400",

        progressWidth:
          "100%",
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
          // FETCH BOTH APIs
          // =====================================
          const [
            totalResponse,
            distributedResponse,
          ] = await Promise.all([
            fetch(
              "https://sewac-helper-admin-portal.onrender.com/api/dashboard/total-rfid-tags",
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
              "https://sewac-helper-admin-portal.onrender.com/api/dashboard/distributed-tags",
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
          // JSON DATA
          // =====================================
          const totalData =
            await totalResponse.json();

          const distributedData =
            await distributedResponse.json();




          console.log(
            "TOTAL RFID:",
            totalData
          );

          console.log(
            "DISTRIBUTED RFID:",
            distributedData
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



          // =====================================
          // PERCENTAGES
          // =====================================
          const distributedPercentage =
            totalRFID > 0
              ? (
                  (distributedRFID /
                    totalRFID) *
                  100
                ).toFixed(0)
              : 0;



          const remainingPercentage =
            totalRFID > 0
              ? (
                  (remainingRFID /
                    totalRFID) *
                  100
                ).toFixed(0)
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
                "Active Workers",

              value: 15,

              subtitle:
                "100% active",

              icon: Users,

              iconBg:
                "from-orange-400 to-orange-500",

              progress:
                "bg-orange-400",

              progressWidth:
                "100%",
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

              className="bg-white border border-purple-100 rounded-[22px] p-4 shadow-sm hover:shadow-lg hover:-translate-y-[3px] hover:scale-[1.015] transition-all duration-300 will-change-transform transform-gpu"
            >

              {/* TOP */}
              <div className="flex items-start justify-between">

                {/* LEFT */}
                <div>

                  {/* TITLE */}
                  <p className="text-[#7d7d99] text-[12px] font-semibold">

                    {card.title}

                  </p>



                  {/* NUMBER */}
                  <h2 className="text-[28px] font-bold text-[#1f1f3d] mt-2 leading-none">

                    {card.title ===
                    "Active Workers"
                      ? `${counts[index]} / 15`
                      : counts[
                          index
                        ].toLocaleString()}

                  </h2>



                  {/* SUBTITLE */}
                  <p className="text-[#9a9ab3] text-[11px] font-medium mt-2.5">

                    {card.subtitle}

                  </p>

                </div>



                {/* ICON */}
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center shadow-sm`}
                >

                  <Icon
                    size={20}
                    className="text-white"
                  />

                </div>

              </div>



              {/* PROGRESS */}
              <div className="w-full h-[4px] rounded-full bg-[#ece8f6] mt-4 overflow-hidden">

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
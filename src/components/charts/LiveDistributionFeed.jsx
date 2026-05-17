// =========================================
// src/components/charts/LiveDistributionFeed.jsx
// =========================================

import {
  Tag,
} from "lucide-react";

import {
  useEffect,
  useRef,
} from "react";

import gsap from "gsap";



const feeds = [
  {
    tag:
      "E28011606000209F5E63817",

    worker:
      "Worker 02",

    location:
      "Location A",

    time:
      "10:30:45 AM",
  },

  {
    tag:
      "E28011606000209F5E63818",

    worker:
      "Worker 07",

    location:
      "Location A",

    time:
      "10:30:42 AM",
  },

  {
    tag:
      "E28011606000209F5E63819",

    worker:
      "Worker 01",

    location:
      "Location B",

    time:
      "10:30:41 AM",
  },

  {
    tag:
      "E28011606000209F5E6381A",

    worker:
      "Worker 12",

    location:
      "Location C",

    time:
      "10:30:39 AM",
  },
];



const LiveDistributionFeed = () => {

  const cardRef = useRef(null);



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

        delay: 0.25,

        ease: "power3.out",
      }
    );

  }, []);




  return (

    <div
      ref={cardRef}

      className="bg-white rounded-[22px] border border-[#f1ebff] p-5 shadow-sm"
    >

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <h2 className="text-[#2d2a4a] text-[15px] font-bold">

          Live Distribution Feed

        </h2>



        <div className="flex items-center gap-2">

          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />

          <p className="text-green-500 text-[12px] font-semibold">

            Live

          </p>

        </div>

      </div>



      {/* FEED */}
      <div className="mt-5 space-y-4">

        {feeds.map(
          (
            item,
            index
          ) => (

            <div
              key={index}

              className="flex items-start justify-between pb-4 border-b border-[#f5f2ff] last:border-none"
            >

              {/* LEFT */}
              <div className="flex gap-3">

                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">

                  <Tag
                    size={18}
                    className="text-pink-500"
                  />

                </div>



                <div>

                  <h3 className="text-[#2d2a4a] text-[12px] font-bold leading-relaxed">

                    {item.tag}

                  </h3>



                  <p className="text-[#8c88a6] text-[11px] mt-1">

                    {item.worker}
                    {" • "}
                    {item.location}

                  </p>

                </div>

              </div>



              {/* TIME */}
              <p className="text-[#9c98b8] text-[11px] font-medium whitespace-nowrap">

                {item.time}

              </p>

            </div>

          )
        )}

      </div>



      {/* VIEW ALL */}
      <div className="flex justify-center mt-5">

        <button className="text-pink-500 text-[13px] font-bold hover:text-purple-600 transition-all">

          View All

        </button>

      </div>

    </div>

  );
};

export default LiveDistributionFeed;
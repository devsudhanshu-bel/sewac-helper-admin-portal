import React, {
  useEffect,
  useRef,
} from "react";

import {
  LayoutDashboard,
  Logs,
  ScanLine,
} from "lucide-react";

import {
  ShieldCheck,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import gsap from "gsap";



const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },

  {
    name: "Logs",
    icon: Logs,
    path: "/logs",
  },

  {
    name: "RFID Tags",
    icon: ScanLine,
    path: "/rfid-tags",
  },

  {
    name: "Add/View Moderators",
    icon: ShieldCheck,
    path: "/moderators",
  },
];



const Sidebar = () => {

  const sidebarRef = useRef();

  const navItemsRef = useRef([]);

  useEffect(() => {

    // SIDEBAR LOAD
    gsap.fromTo(
      sidebarRef.current,

      {
        x: -100,
        opacity: 0,
      },

      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      }
    );



    // STAGGER NAV ITEMS
    gsap.fromTo(
      navItemsRef.current,

      {
        x: -30,
        opacity: 0,
      },

      {
        x: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.7,
        delay: 0.3,
        ease: "power3.out",
      }
    );

  }, []);



  return (

    <div
      ref={sidebarRef}
      className="w-[280px] h-screen fixed left-0 top-0 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#7b1fa2] via-[#5e35b1] to-[#311b92]"
    >

      {/* TOP AREA */}
      <div>

        {/* LOGO SECTION */}
        <div className="px-7 pt-8 pb-10">

          <div className="flex items-center gap-4">

            {/* LOGO BOX */}
            <div className="relative">

              {/* OUTER GLOW */}
              <div className="absolute inset-0 rounded-3xl bg-pink-500 blur-2xl opacity-40" />

              {/* MAIN LOGO */}
              <div className="relative w-16 h-16 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-[0_10px_40px_rgba(255,79,163,0.35)]">

                <div className="text-white text-lg font-bold tracking-widest">
                  RFID
                </div>

              </div>

            </div>



            {/* TITLE */}
            <div>

              <h1 className="text-white text-[30px] font-bold leading-none tracking-wide">
                SEWAC
              </h1>

              <p className="text-white/70 text-sm mt-2 font-medium">
                RFID Distribution
              </p>

            </div>

          </div>

        </div>



        {/* NAVIGATION */}
        <div className="px-4 flex flex-col gap-3">

          {menuItems.map((item, index) => {

            const Icon = item.icon;

            return (

              <div
                key={index}
                ref={(el) => (navItemsRef.current[index] = el)}
              >

                <NavLink
                  to={item.path}

                  className={({ isActive }) =>
                    `group relative flex items-center gap-4 px-5 py-[18px] rounded-3xl transition-all duration-300 overflow-hidden

                    ${
                      isActive
                        ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-[0_12px_35px_rgba(255,79,163,0.35)]"
                        : "text-white/75 hover:text-white hover:bg-white/10"
                    }
                    `
                  }
                >

                  {({ isActive }) => (
                    <>

                      {/* HOVER EFFECT */}
                      {!isActive && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/5" />
                      )}



                      {/* ICON */}
                      <div
                        className={`
                          relative z-10 transition-all duration-300

                          ${
                            isActive
                              ? "text-white"
                              : "text-white/70 group-hover:text-white"
                          }
                        `}
                      >
                        <Icon
                          size={22}
                          strokeWidth={2.2}
                        />
                      </div>



                      {/* TEXT */}
                      <span className="relative z-10 text-[15px] font-semibold tracking-wide">
                        {item.name}
                      </span>



                      {/* ACTIVE INDICATOR */}
                      {isActive && (
                        <div className="absolute right-4 w-2 h-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                      )}

                    </>
                  )}

                </NavLink>

              </div>

            );
          })}

        </div>

      </div>



      {/* BOTTOM USER CARD */}
      <div className="p-5">

        <div className="relative overflow-hidden rounded-[30px] border border-white/15 bg-white/10 backdrop-blur-2xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.15)]">

          {/* BACKGROUND GLOW */}
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-pink-500/20 blur-3xl" />



          <div className="relative flex items-center gap-4">

            {/* PROFILE */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-[0_8px_25px_rgba(255,79,163,0.35)]">

              <span className="text-white text-lg font-bold">
                A
              </span>

            </div>



            {/* INFO */}
            <div className="flex-1">

              <h2 className="text-white font-semibold text-[15px]">
                Admin
              </h2>

              <p className="text-white/60 text-sm mt-1">
                Super Admin
              </p>

            </div>



            {/* LIVE STATUS */}
            <div className="relative">

              <div className="w-3 h-3 rounded-full bg-green-400" />

              <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-70" />

            </div>

          </div>

        </div>

      </div>

    </div>

  );
};



export default Sidebar;
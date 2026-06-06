import {
  useEffect,
  useRef,
} from "react";

import gsap from "gsap";

import AddModeratorCard from "../components/cards/AddModeratorCard";
import ViewModeratorsCard from "../components/cards/ViewModeratorsCard";

const Moderators = () => {

  const titleRef = useRef(null);

  const subtitleRef = useRef(null);

  const leftCardRef = useRef(null);

  const rightCardRef = useRef(null);

  useEffect(() => {

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    // TITLE
    tl.fromTo(
      titleRef.current,
      {
        y: -20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
      }
    )

      // SUBTITLE
      .fromTo(
        subtitleRef.current,
        {
          y: 10,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
        },
        "-=0.2"
      )

      // LEFT CARD
      .fromTo(
        leftCardRef.current,
        {
          x: -40,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
        },
        "-=0.1"
      )

      // RIGHT CARD
      .fromTo(
        rightCardRef.current,
        {
          x: 40,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
        },
        "-=0.5"
      );

  }, []);

  return (

    <div className="w-full">

      {/* PAGE HEADER */}
      <div className="mb-6">

        <h1
          ref={titleRef}
          className="text-[30px] font-bold text-[#1f1f3d]"
        >

          Moderators

        </h1>

        <p
          ref={subtitleRef}
          className="text-[#8c8ca8] text-[13px] mt-1"
        >

          Create and manage moderator accounts

        </p>

      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-[0.8fr_1.2fr] gap-6 items-stretch">

        <div ref={leftCardRef}>

          <AddModeratorCard />

        </div>

        <div ref={rightCardRef}>

          <ViewModeratorsCard />

        </div>

      </div>

    </div>

  );

};

export default Moderators;
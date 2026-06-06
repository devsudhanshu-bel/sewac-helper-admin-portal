import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const AddModeratorCard = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const elementsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      elementsRef.current,
      {
        opacity: 0,
        y: 15,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
      },
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Username and Password are required");

      return;
    }

    try {
      setCreating(true);

      const token = sessionStorage.getItem("token");

      const response = await fetch(
        "http://18.60.41.32:5000/api/moderators/create",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        },
      );

      const result = await response.json();

      console.log("CREATE MODERATOR:", result);

      if (result.success) {
        alert(`Moderator ${result.data.username} created successfully`);

        setUsername("");

        setPassword("");

        window.location.reload();
      } else {
        alert(result.message || "Failed to create moderator");
      }
    } catch (error) {
      console.error("Create moderator failed:", error);

      alert("Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className="
        bg-white
        rounded-[22px]
        border
        border-[#f1ebff]
        p-6
        shadow-sm
        h-full
        flex
        flex-col
      "
    >
      <h2
        ref={(el) => (elementsRef.current[0] = el)}
        className="text-[22px] font-bold text-[#2d2a4a] mb-6"
      >
        Add Moderator
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        {/* INPUT SECTION */}
        <div className="flex-1 space-y-6">
          <div ref={(el) => (elementsRef.current[1] = el)}>
            <label className="block text-[13px] font-medium text-[#7e7a99] mb-2">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="
  w-full
  h-[48px]
  px-4
  text-[#1f1f3d]
  placeholder:text-[#a1a1b5]

  border
  border-[#ece8ff]
  rounded-xl
  outline-none

  transition-all
  duration-200

  focus:border-purple-400
  focus:ring-4
  focus:ring-purple-100
"
            />
          </div>

          <div ref={(el) => (elementsRef.current[2] = el)}>
            <label className="block text-[13px] font-medium text-[#7e7a99] mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="
  w-full
  h-[48px]
  px-4
  text-[#1f1f3d]
  placeholder:text-[#a1a1b5]

  border
  border-[#ece8ff]
  rounded-xl
  outline-none

  transition-all
  duration-200

  focus:border-purple-400
  focus:ring-4
  focus:ring-purple-100
"
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          ref={(el) => (elementsRef.current[3] = el)}
          type="submit"
          disabled={creating}
          className="
    w-full
    h-[48px]
    rounded-xl
    text-white
    font-semibold
    bg-gradient-to-r
    from-pink-500
    to-purple-500

    shadow-[0_10px_25px_rgba(255,79,163,0.25)]

    hover:shadow-[0_20px_40px_rgba(168,85,247,0.35)]
    hover:scale-[1.02]
    hover:-translate-y-0.5

    active:scale-[0.97]
    active:translate-y-1

    disabled:opacity-70
    disabled:cursor-not-allowed

    transition-all
    duration-200
    cursor-pointer
  "
        >
          {creating ? "Creating..." : "Create Moderator"}
        </button>
      </form>
    </div>
  );
};

export default AddModeratorCard;

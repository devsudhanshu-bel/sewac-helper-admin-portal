import API_BASE_URL from "../../services/api";
import { useEffect, useState } from "react";

const ViewModeratorsCard = () => {
  const [moderators, setModerators] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModerators = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/moderators/all`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const result = await response.json();

        if (result.success) {
          if (result.success && result.data) {
            setModerators(result.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch moderators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModerators();
  }, []);

  return (
    <div
      className="
        bg-white
        rounded-[22px]
        border
        border-[#f1ebff]
        p-6
        shadow-sm

        h-[500px]
        flex
        flex-col
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-bold text-[#2d2a4a]">All Moderators</h2>

        <span
          className="
            bg-[#f7f2ff]
            text-[#7c3aed]
            text-sm
            font-semibold
            px-4
            py-1
            rounded-full
          "
        >
          {moderators.length} Moderators
        </span>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-[#7e7a99]">
          Loading Moderators...
        </div>
      ) : (
        <div
          className="
            flex-1
            overflow-y-auto
            pr-2

            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-[#d9cffd]
            [&::-webkit-scrollbar-thumb]:rounded-full
          "
        >
          <div className="space-y-3">
            {moderators.map((moderator) => (
              <div
                key={moderator.id}
                className="
                    flex
                    items-center
                    justify-between
                    p-5
                    border
                    border-[#f1ebff]
                    rounded-xl

                    hover:bg-[#faf8ff]
                    transition-all
                    duration-200
                  "
              >
                <div>
                  <h3 className="font-bold text-[#2d2a4a] text-[15px]">
                    {moderator.username}
                  </h3>

                  <p className="text-[#8c8ca8] text-sm mt-1">
                    Created on{" "}
                    {new Date(moderator.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewModeratorsCard;
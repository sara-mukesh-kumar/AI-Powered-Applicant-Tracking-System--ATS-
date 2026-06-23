import React, { useEffect, useState } from "react";

const ApplicantNotificationBanner = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  
  // Persist dismissed notification IDs in localStorage so they don't reappear on reload
  const [dismissed, setDismissed] = useState(() => {
    try {
      const saved = localStorage.getItem("applicant_dismissed_broadcasts");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : {};
        
        let role = user.role ? user.role.toLowerCase() : "applicant"; 

        const res = await fetch("/api/admin/broadcasts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (data.success) {
          // Filter broadcasts for the applicant and discard any containing "test" or "demo"
          const filtered = data.broadcasts.filter((b) => {
            const msg = b.message ? b.message.toLowerCase() : "";
            if (msg.includes("test") || msg.includes("demo")) {
              return false;
            }
            const group = b.targetGroup ? b.targetGroup.toLowerCase().trim() : "all";
            return group === "all" || group === "applicant" || group === role;
          });

          setBroadcasts(filtered);
        }
      } catch (err) {
        console.error("Broadcast fetch error:", err);
      }
    };

    fetchBroadcasts();
  }, []);

  const handleDismiss = (id) => {
    setDismissed((prev) => {
      const updated = [...prev, id];
      localStorage.setItem("applicant_dismissed_broadcasts", JSON.stringify(updated));
      return updated;
    });
  };

  const visible = broadcasts.filter((b) => !dismissed.includes(b._id));

  if (visible.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-2 mb-6">
      {visible.map((b) => (
        <div
          key={b._id}
          className="flex items-start gap-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl px-4 py-3 shadow-sm border border-amber-100/60"
        >
          <span className="text-amber-600 text-base mt-0.5 animate-pulse">📢</span>
          <div className="flex-1">
            <p className="text-xs font-bold text-amber-900 leading-relaxed">{b.message}</p>
          </div>
          <button
            onClick={() => handleDismiss(b._id)}
            className="cursor-pointer text-amber-400 hover:text-amber-700 text-sm font-black transition ml-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ApplicantNotificationBanner;

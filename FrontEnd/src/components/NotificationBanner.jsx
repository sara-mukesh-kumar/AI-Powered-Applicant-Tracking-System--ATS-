import React, { useEffect, useState } from "react";

const NotificationBanner = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : {};
        
        let role = user.role ? user.role.toLowerCase().trim() : ""; 

        // 🌟 JWT Token Decode Fallback handler
        if (!role && token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              window.atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const decoded = JSON.parse(jsonPayload);
            if (decoded && decoded.role) role = decoded.role.toLowerCase().trim();
          } catch (e) {
            console.error("Token structure evaluation error:", e);
          }
        }

        // 🌟 Flexible URL Route Scanner (Supports /applicant/dashboard context)
        if (!role) {
          const currentPath = window.location.pathname.toLowerCase();
          if (currentPath.includes("recruiter") || currentPath.includes("employ")) {
            role = "recruiter";
          } else if (currentPath.includes("applicant") || currentPath.includes("user") || currentPath.includes("app")) {
            role = "applicant";
          }
        }

        console.log("Final Unified Audience Filter Role:", role);

        const res = await fetch("/api/admin/broadcasts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        
        if (data.success) {
          console.log("Database response logs array check:", data.broadcasts);
          
          const filtered = data.broadcasts.filter((b) => {
            const group = b.targetGroup ? b.targetGroup.toLowerCase().trim() : "all";
            // Normal fallback matching
            return b.isActive !== false && (group === "all" || group === "applicant" || group === "recruiter" || group === role);
          });

          console.log("Filtered results live mapping count:", filtered.length);
          setBroadcasts(filtered);
        }
      } catch (err) {
        console.error("Broadcast fetch engine critical crash error:", err);
      }
    };

    fetchBroadcasts();
  }, []);

  const handleDismiss = (id) => {
    setDismissed((prev) => [...prev, id]);
  };

  const visible = broadcasts.filter((b) => !dismissed.includes(b._id));

  if (visible.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-2 mb-4">
      {visible.map((b) => (
        <div
          key={b._id}
          className="flex items-start gap-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl px-4 py-3.5 shadow-sm border border-amber-100/60"
        >
          <span className="text-amber-600 text-lg mt-0.5 animate-pulse select-none">📢</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-950 leading-relaxed">{b.message}</p>
          </div>
          <button
            onClick={() => handleDismiss(b._id)}
            className="cursor-pointer text-amber-400 hover:text-amber-800 text-base font-bold transition-colors ml-2 select-none"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationBanner;
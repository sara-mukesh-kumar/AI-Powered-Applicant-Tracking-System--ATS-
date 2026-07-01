import { useState, useEffect } from "react";

export default function AiScoringControl() {
  const [profileType, setProfileType] = useState("software");
  const [weights, setWeights] = useState({
    keywordMatch: 30,
    skillsTaxonomy: 35,
    experienceDuration: 20,
    educationFormatting: 15,
  });
  const [minScore, setMinScore] = useState(60);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStrategyWeights();
  }, [profileType]);

  const fetchStrategyWeights = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/ai-config/${profileType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.config) {
        setWeights(data.config.weights);
        setMinScore(data.config.minimumPassingScore);
      }
    } catch (err) {
      console.error("Configuration payload missing dynamic metrics hooks");
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (field, value) => {
    setWeights((prev) => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  const totalSum =
    weights.keywordMatch +
    weights.skillsTaxonomy +
    weights.experienceDuration +
    weights.educationFormatting;

  const handleSaveStrategy = async (e) => {
    e.preventDefault();
    if (totalSum !== 100) {
      setStatus("error");
      setMessage(`Validation Error: Total allocation criteria weights sum must equal strictly 100%. Current sum: ${totalSum}%`);
      return;
    }

    try {
      setSending(true);
      setStatus("");
      setMessage("");
      const res = await fetch("/api/admin/ai-config/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileType,
          weights,
          minimumPassingScore: minScore,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("AI strategy constraints updated into database collections.");
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to finalize weights configuration rules.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network gateway response timeout updating configurations layer.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">🤖 AI Scoring Governance Center</h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure algorithm matrix constraints, fine-tune ranking profiles weights, and regulate thresholds.
        </p>
      </div>

      <div className="mb-6 bg-gray-50 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Target Strategy Profile</label>
          <select
            className="border border-gray-200 rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={profileType}
            onChange={(e) => setProfileType(e.target.value)}
          >
            <option value="software">Software Engineering Profile</option>
            <option value="freshers">Freshers / Entry-Level Track</option>
            <option value="management">Management & Product Roles</option>
          </select>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-500 block">Matrix Allocation Summary</span>
          <span className={`text-xl font-bold ${totalSum === 100 ? "text-green-600" : "text-red-500"}`}>
            {totalSum} / 100%
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-12 text-sm text-gray-400 font-medium">Synchronizing rules indices...</div>
      ) : (
        <form onSubmit={handleSaveStrategy} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Range Controllers Block */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>🔑 Keyword Match Weight</span>
                  <span>{weights.keywordMatch}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={weights.keywordMatch}
                  onChange={(e) => handleSliderChange("keywordMatch", e.target.value)}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>📊 Skills Taxonomy Density</span>
                  <span>{weights.skillsTaxonomy}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={weights.skillsTaxonomy}
                  onChange={(e) => handleSliderChange("skillsTaxonomy", e.target.value)}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>💼 Experience Duration Depth</span>
                  <span>{weights.experienceDuration}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={weights.experienceDuration}
                  onChange={(e) => handleSliderChange("experienceDuration", e.target.value)}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>🖨️ Education & Layout Formatting</span>
                  <span>{weights.educationFormatting}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={weights.educationFormatting}
                  onChange={(e) => handleSliderChange("educationFormatting", e.target.value)}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* Threshold Block */}
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-2">
                  <span>🛑 Minimum Passing Threshold Score</span>
                  <span className="text-blue-600 font-bold">{minScore} PTS</span>
                </div>
                <input
                  type="number" min="1" max="100" value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                  Candidates failing to match this target matrix metric filter limit will be flagged as "Critical" or auto-filtered in the review dashboard views.
                </p>
              </div>

              {message && (
                <div className={`p-3 mt-4 rounded-lg text-xs font-medium border ${
                  status === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={totalSum !== 100}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Save Parameters Strategy
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
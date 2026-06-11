import React, { useState, useEffect } from "react";

const MOCK_CANDIDATES = [
  {
    id: 1,
    applicantName: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    aiScore: 95,
    extractedSkills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker", "GraphQL"],
    jobRequirements: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
    status: "Offered",
    appliedAt: "2024-01-03",
    experience: "9 years",
    location: "Boston, MA",
    currentCompany: "Netflix",
    matchSummary: {
      overallAssessment: "Perfect match - Exceptional candidate with extensive experience.",
      strengths: ["Expert in React & Node.js", "AWS Certified", "Strong leadership skills"],
      gaps: [],
      recommendation: "Strong Hire - Extend offer immediately"
    }
  },
  {
    id: 2,
    applicantName: "John Smith",
    email: "john.smith@example.com",
    aiScore: 92,
    extractedSkills: ["React", "Node.js", "TypeScript", "MongoDB", "Express", "AWS"],
    jobRequirements: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
    status: "Interview",
    appliedAt: "2024-01-15",
    experience: "8 years",
    location: "New York, NY",
    currentCompany: "Google",
    matchSummary: {
      overallAssessment: "Excellent full-stack engineer with strong cloud experience.",
      strengths: ["Full-stack expertise", "AWS Certified", "Team leadership"],
      gaps: ["Limited GraphQL experience"],
      recommendation: "Strong Hire - Proceed to final round"
    }
  },
  {
    id: 3,
    applicantName: "Emily Davis",
    email: "emily.davis@example.com",
    aiScore: 88,
    extractedSkills: ["React", "Node.js", "GraphQL", "PostgreSQL", "AWS", "Docker"],
    jobRequirements: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
    status: "Interview",
    appliedAt: "2024-01-08",
    experience: "7 years",
    location: "Seattle, WA",
    currentCompany: "Amazon",
    matchSummary: {
      overallAssessment: "Very strong full-stack candidate with cloud expertise.",
      strengths: ["React & Node.js expert", "AWS Certified", "GraphQL experience"],
      gaps: ["Uses PostgreSQL instead of MongoDB"],
      recommendation: "Strong Hire - Schedule technical interview"
    }
  },
  {
    id: 4,
    applicantName: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    aiScore: 78,
    extractedSkills: ["React", "JavaScript", "HTML", "CSS", "Redux", "Jest"],
    jobRequirements: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
    status: "Reviewing",
    appliedAt: "2024-01-12",
    experience: "5 years",
    location: "Austin, TX",
    currentCompany: "Microsoft",
    matchSummary: {
      overallAssessment: "Strong frontend specialist with excellent React skills.",
      strengths: ["Expert in React", "Strong testing practices", "UI/UX focus"],
      gaps: ["Limited backend experience", "No cloud experience"],
      recommendation: "Consider for Frontend Lead role"
    }
  },
  {
    id: 5,
    applicantName: "David Wilson",
    email: "david.wilson@example.com",
    aiScore: 62,
    extractedSkills: ["Angular", "Java", "Spring Boot", "MySQL", "Hibernate"],
    jobRequirements: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
    status: "Reviewing",
    appliedAt: "2024-01-05",
    experience: "10 years",
    location: "Chicago, IL",
    currentCompany: "Bank of America",
    matchSummary: {
      overallAssessment: "Senior engineer with different tech stack.",
      strengths: ["Enterprise experience", "Strong system design", "Team leadership"],
      gaps: ["Different tech stack", "No React/Node.js"],
      recommendation: "Consider - Will need ramp-up time"
    }
  },
  {
    id: 6,
    applicantName: "Michael Chen",
    email: "michael.chen@example.com",
    aiScore: 45,
    extractedSkills: ["Python", "Django", "PostgreSQL", "Redis", "Celery"],
    jobRequirements: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
    status: "Applied",
    appliedAt: "2024-01-10",
    experience: "6 years",
    location: "San Francisco, CA",
    currentCompany: "Stripe",
    matchSummary: {
      overallAssessment: "Excellent backend engineer but doesn't match frontend requirements.",
      strengths: ["Strong Python", "Distributed systems", "PhD background"],
      gaps: ["No frontend experience", "Different tech stack"],
      recommendation: "Not a fit - Recommend for backend roles"
    }
  }
];

const CandidateRanking = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [minScore, setMinScore] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("score");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setCandidates(MOCK_CANDIDATES);
      setLoading(false);
    }, 1000);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreTextColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Offered": return "bg-green-100 text-green-800";
      case "Interview": return "bg-purple-100 text-purple-800";
      case "Reviewing": return "bg-blue-100 text-blue-800";
      case "Applied": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateSkillMatch = (candidateSkills, jobRequirements) => {
    const matched = candidateSkills.filter(skill => 
      jobRequirements.some(req => 
        req.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(req.toLowerCase())
      )
    );
    return {
      matched: matched.length,
      total: jobRequirements.length,
      percentage: Math.round((matched.length / jobRequirements.length) * 100)
    };
  };

  let filteredCandidates = candidates.filter(candidate => {
    if (candidate.aiScore < minScore) return false;
    if (statusFilter !== "All" && candidate.status !== statusFilter) return false;
    if (searchQuery && !candidate.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !candidate.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (sortBy === "score") {
    filteredCandidates.sort((a, b) => b.aiScore - a.aiScore);
  } else if (sortBy === "name") {
    filteredCandidates.sort((a, b) => a.applicantName.localeCompare(b.applicantName));
  } else if (sortBy === "date") {
    filteredCandidates.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">🤖 Candidate Ranking Dashboard</h1>
          <p className="text-blue-100 text-lg">AI-powered candidate evaluation and matching system</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow">
            <p className="text-gray-500 text-sm">Total Candidates</p>
            <h2 className="text-3xl font-bold text-gray-800">{candidates.length}</h2>
            <p className="text-xs text-green-600 mt-1">+12% this week</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow">
            <p className="text-gray-500 text-sm">Top Candidates</p>
            <h2 className="text-3xl font-bold text-green-600">{candidates.filter(c => c.aiScore >= 80).length}</h2>
            <p className="text-xs text-gray-500 mt-1">Score ≥ 80%</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow">
            <p className="text-gray-500 text-sm">Average Score</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {Math.round(candidates.reduce((a, b) => a + b.aiScore, 0) / candidates.length)}%
            </h2>
            <p className="text-xs text-gray-500 mt-1">Across all candidates</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow">
            <p className="text-gray-500 text-sm">Interview Ready</p>
            <h2 className="text-3xl font-bold text-purple-600">
              {candidates.filter(c => c.status === "Interview" || c.status === "Offered").length}
            </h2>
            <p className="text-xs text-gray-500 mt-1">In pipeline</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow">
            <p className="text-gray-500 text-sm">Unique Skills</p>
            <h2 className="text-3xl font-bold text-orange-600">
              {[...new Set(candidates.flatMap(c => c.extractedSkills))].length}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Total tech stack</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow">
            <p className="text-gray-500 text-sm">Hiring Rate</p>
            <h2 className="text-3xl font-bold text-emerald-600">
              {Math.round((candidates.filter(c => c.status === "Offered").length / candidates.length) * 100)}%
            </h2>
            <p className="text-xs text-gray-500 mt-1">Offer acceptance</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">🔍 Search</label>
              <input
                type="text"
                placeholder="Name, email, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📊 Min Score</label>
              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>All Scores</option>
                <option value={90}>90%+ (Excellent)</option>
                <option value={80}>80%+ (Very Good)</option>
                <option value={70}>70%+ (Good)</option>
                <option value={60}>60%+ (Average)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📌 Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Interview">Interview</option>
                <option value="Offered">Offered</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🔄 Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="score">AI Score</option>
                <option value="name">Name</option>
                <option value="date">Application Date</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-3">
            <button
              onClick={() => {
                setMinScore(0);
                setStatusFilter("All");
                setSortBy("score");
                setSearchQuery("");
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300">
                <tr>
                  <th className="p-5 text-left text-sm font-semibold text-gray-700">Candidate</th>
                  <th className="p-5 text-left text-sm font-semibold text-gray-700">AI Score</th>
                  <th className="p-5 text-left text-sm font-semibold text-gray-700">Skills Match</th>
                  <th className="p-5 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-5 text-left text-sm font-semibold text-gray-700">Experience</th>
                  <th className="p-5 text-left text-sm font-semibold text-gray-700">Company</th>
                  <th className="p-5 text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => {
                  const skillMatch = calculateSkillMatch(candidate.extractedSkills, candidate.jobRequirements);
                  const scoreColor = getScoreColor(candidate.aiScore);
                  const scoreTextColor = getScoreTextColor(candidate.aiScore);
                  return (
                    <tr key={candidate.id} className="border-b hover:bg-blue-50 transition-colors">
                      <td className="p-5">
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">{candidate.applicantName}</p>
                          <p className="text-sm text-gray-500">{candidate.email}</p>
                          <p className="text-xs text-gray-400 mt-1">{candidate.location}</p>
                        </div>
                       </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-2">
                          <span className={`inline-flex px-3 py-1 rounded-full text-white font-bold text-sm ${scoreColor} w-20 justify-center`}>
                            {candidate.aiScore}%
                          </span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className={`${scoreColor} h-2 rounded-full`} style={{ width: `${candidate.aiScore}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{skillMatch.percentage}% Match</p>
                          <p className="text-xs text-gray-500">{skillMatch.matched}/{skillMatch.total} skills</p>
                          <div className="w-32 bg-gray-200 rounded-full h-1.5 mt-2">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${skillMatch.percentage}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="p-5 text-sm text-gray-600">{candidate.experience}</td>
                      <td className="p-5 text-sm text-gray-600">{candidate.currentCompany}</td>
                      <td className="p-5 text-center">
                        <button
                          onClick={() => setSelectedCandidate(candidate)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No candidates found matching the criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCandidate.applicantName}</h2>
                  <p className="text-blue-100 mt-1">{selectedCandidate.email}</p>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">AI Match Score</p>
                  <p className={`text-3xl font-bold ${getScoreTextColor(selectedCandidate.aiScore)}`}>
                    {selectedCandidate.aiScore}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedCandidate.experience}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🛠️ Skills Analysis</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Candidate Skills</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedCandidate.extractedSkills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">{skill}</span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.jobRequirements.map((skill, idx) => {
                      const hasSkill = selectedCandidate.extractedSkills.some(s => 
                        s.toLowerCase().includes(skill.toLowerCase())
                      );
                      return (
                        <span key={idx} className={`px-3 py-1 rounded-full text-sm ${hasSkill ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-200 text-gray-500'}`}>
                          {skill} {hasSkill && '✓'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🤖 AI Evaluation</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-700">{selectedCandidate.matchSummary.overallAssessment}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3">✓ Key Strengths</h4>
                  <ul className="space-y-2">
                    {selectedCandidate.matchSummary.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-600">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {selectedCandidate.matchSummary.gaps.length > 0 && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 mb-3">⚠️ Areas for Improvement</h4>
                    <ul className="space-y-2">
                      {selectedCandidate.matchSummary.gaps.map((gap, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-orange-600">•</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">🎯 AI Recommendation</h4>
                <p className="text-gray-700 font-medium">{selectedCandidate.matchSummary.recommendation}</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl border-t flex justify-end gap-3">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateRanking; 
import React from "react";
import RecruiterLayout from "./RecruiterLayout";

const RecruiterDashboard = () => {
  return (
    <RecruiterLayout>
      <div>
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-800">
          Recruiter Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome to the AI Applicant Tracking System
        </p>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg">Total Jobs</h3>
            <p className="text-3xl font-bold mt-2">24</p>
          </div>

          <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg">Applications</h3>
            <p className="text-3xl font-bold mt-2">532</p>
          </div>

          <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg">Shortlisted</h3>
            <p className="text-3xl font-bold mt-2">87</p>
          </div>

          <div className="bg-orange-500 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg">Interviews</h3>
            <p className="text-3xl font-bold mt-2">32</p>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Recent Applications
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Candidate</th>
                <th className="text-left py-3">Position</th>
                <th className="text-left py-3">AI Score</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="py-3">John Smith</td>
                <td>Frontend Developer</td>
                <td>92%</td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    Shortlisted
                  </span>
                </td>
              </tr>

              <tr className="border-b">
                <td className="py-3">Priya Sharma</td>
                <td>UI/UX Designer</td>
                <td>89%</td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    Interview
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3">Rahul Kumar</td>
                <td>Backend Developer</td>
                <td>84%</td>
                <td>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                    Review
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterDashboard;
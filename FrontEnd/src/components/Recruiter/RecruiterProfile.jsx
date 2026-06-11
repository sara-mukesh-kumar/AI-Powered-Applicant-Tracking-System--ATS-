import React from "react";

const RecruiterProfile = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-6">
            <img
              src="https://i.pravatar.cc/150"
              alt="Recruiter"
              className="w-28 h-28 rounded-full border-4 border-blue-500"
            />

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Sarah Johnson
              </h1>

              <p className="text-gray-500 text-lg">
                Senior Talent Acquisition Specialist
              </p>

              <p className="text-gray-400">
                sarah.johnson@company.com
              </p>
            </div>
          </div>
        </div>

        {/* Recruiter Details */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Personal Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="font-medium text-gray-600">
                  Full Name
                </label>

                <input
                  type="text"
                  defaultValue="Sarah Johnson"
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium text-gray-600">
                  Email
                </label>

                <input
                  type="email"
                  defaultValue="sarah.johnson@company.com"
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium text-gray-600">
                  Phone
                </label>

                <input
                  type="text"
                  defaultValue="+91 9876543210"
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Company Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="font-medium text-gray-600">
                  Company Name
                </label>

                <input
                  type="text"
                  defaultValue="Tech Solutions Pvt Ltd"
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium text-gray-600">
                  Designation
                </label>

                <input
                  type="text"
                  defaultValue="Senior Recruiter"
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium text-gray-600">
                  Experience
                </label>

                <input
                  type="text"
                  defaultValue="6 Years"
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recruiter Statistics */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Recruitment Statistics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <h3 className="text-2xl font-bold text-blue-600">
                24
              </h3>
              <p>Jobs Posted</p>
            </div>

            <div className="bg-green-100 rounded-lg p-4 text-center">
              <h3 className="text-2xl font-bold text-green-600">
                532
              </h3>
              <p>Applications</p>
            </div>

            <div className="bg-purple-100 rounded-lg p-4 text-center">
              <h3 className="text-2xl font-bold text-purple-600">
                87
              </h3>
              <p>Shortlisted</p>
            </div>

            <div className="bg-orange-100 rounded-lg p-4 text-center">
              <h3 className="text-2xl font-bold text-orange-600">
                32
              </h3>
              <p>Interviews</p>
            </div>

          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 text-right">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
            Update Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default RecruiterProfile;
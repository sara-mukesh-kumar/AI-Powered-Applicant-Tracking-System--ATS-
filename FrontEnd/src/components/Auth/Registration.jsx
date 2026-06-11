import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("applicant");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("Account created successfully! Please sign in.");
      navigate("/"); 
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 bg-gradient-to-br from-blue-900 to-blue-600 text-white p-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Nexus ATS</h1>
        <p className="text-lg text-blue-100 max-w-md leading-relaxed">
          Join thousands of professionals using AI to accelerate their career and hiring processes.
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center items-center flex-1 p-8 bg-white shadow-2xl lg:shadow-none overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create an Account</h2>
          <p className="text-slate-500 mb-8">Join us as an applicant or a recruiter.</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* Custom Role Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">I want to:</label>
              <div className="flex gap-4">
                <div 
                  onClick={() => setRole("applicant")}
                  className={`flex-1 p-4 border-2 rounded-xl text-center cursor-pointer transition-all duration-200 font-semibold ${
                    role === "applicant" 
                      ? "border-blue-500 bg-blue-50 text-blue-700" 
                      : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-2xl mb-1">🧑‍💼</span>
                  Find a Job
                </div>
                <div 
                  onClick={() => setRole("recruiter")}
                  className={`flex-1 p-4 border-2 rounded-xl text-center cursor-pointer transition-all duration-200 font-semibold ${
                    role === "recruiter" 
                      ? "border-blue-500 bg-blue-50 text-blue-700" 
                      : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-2xl mb-1">🏢</span>
                  Hire Talent
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength="6"
                placeholder="Create a strong password"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-4 disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 font-semibold hover:underline">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
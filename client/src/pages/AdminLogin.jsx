import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {

    if(!email || !password){
      setError("Enter email and password");
      return;
    }

    try{
      setLoading(true);
      setError("");

      const res = await api.post("/admin/login",{email,password});

      localStorage.setItem("token",res.data.token);

      navigate("/dashboard");

    }catch(err){
      setError("Invalid Credentials");
    }finally{
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      {/* Login Card */}
      <div className="bg-white shadow-xl rounded-xl p-10 w-96">

        {/* Logo */}
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          🗳 College Voting
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Admin Authentication
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full border rounded-lg p-3 mb-4 focus:outline-indigo-600"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-6 focus:outline-indigo-600"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

      </div>

    </div>
  );
}
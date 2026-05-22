import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";


export default function VoterLogin(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async()=>{

    if(!email || !password){
      setError("Enter credentials");
      return;
    }

    try{
      setLoading(true);
      setError("");

      const res = await api.post("/voter-auth/login",{
        email,
        password
      });

      localStorage.setItem("voterId",res.data.voterId);
      
      navigate("/verify-otp");

    }catch(err){
      setError("Invalid Login / Election is Inactive / Already Voted");
    }finally{
      setLoading(false);
    }
  };

  return(
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl p-10 w-96">

        <h1 className="text-3xl font-bold text-indigo-600 text-center mb-2">
          🗳 Voter Login
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Secure Election Access
        </p>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <input
          placeholder="Registered Email"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-6"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700"
        >
          {loading ? "Signing In..." : "Login"}
        </button>

      </div>

    </div>
  );
}
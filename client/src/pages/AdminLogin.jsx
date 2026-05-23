
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin(){

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async()=>{

    if(!username || !password){
      setError("Enter all fields");
      return;
    }

    try{

      setLoading(true);
      setError("");

      const res = await api.post("/admin/login",{
        email : username,
        password
      });

      

      localStorage.setItem("token",res.data.token);
      localStorage.setItem("role","admin");

      navigate("/admin/dashboard");

    }catch(err){

      setError(
        err.response?.data?.message ||
        "Invalid Credentials"
      );

    }finally{
      setLoading(false);
    }

  };

  return(

    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 flex items-center justify-center px-4">

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-md text-white">

        <div className="flex justify-center mb-6">

          <div className="bg-white/20 p-4 rounded-full">
            <ShieldCheck size={42} />
          </div>

        </div>

        <h1 className="text-4xl font-bold text-center mb-2">
          Admin Login
        </h1>

        <p className="text-center text-white/70 mb-8">
          Secure election management portal
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-300 text-red-100 p-3 rounded-xl mb-5 text-center">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          className="w-full p-4 rounded-xl bg-white/20 border border-white/20 placeholder-white/70 outline-none mb-5"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full p-4 rounded-xl bg-white/20 border border-white/20 placeholder-white/70 outline-none mb-6"
        />

        <button
          onClick={login}
          className="w-full bg-white text-indigo-700 font-bold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
        >
          {loading ? "Signing In..." : "Login"}
        </button>

      </div>

    </div>

  );
}




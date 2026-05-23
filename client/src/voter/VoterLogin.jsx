import { useState } from "react";
import { Vote } from "lucide-react";
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
      setError("Enter all fields");
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

      setError(
        err.response?.data?.message ||
        "Login failed"
      );

    }finally{
      setLoading(false);
    }

  };

  return(

    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center px-4">

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-md text-white">

        <div className="flex justify-center mb-6">

          <div className="bg-white/20 p-4 rounded-full">
            <Vote size={42} />
          </div>

        </div>

        <h1 className="text-4xl font-bold text-center mb-2">
          Voter Login
        </h1>

        <p className="text-center text-white/70 mb-8">
          Access secure online voting
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-300 text-red-100 p-3 rounded-xl mb-5 text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="College Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
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
          className="w-full bg-white text-emerald-700 font-bold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
        >
          {loading ? "Verifying..." : "Continue"}
        </button>

      </div>

    </div>

  );
}
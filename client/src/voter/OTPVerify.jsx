import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function OTPVerify(){

  const [otp,setOtp] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);
  const [timer,setTimer] = useState(60);

  const navigate = useNavigate();

  /* COUNTDOWN TIMER */

  useEffect(()=>{

    if(timer <= 0) return;

    const interval = setInterval(()=>{

      setTimer(prev=>prev-1);

    },1000);

    return ()=>clearInterval(interval);

  },[timer]);

  /* VERIFY OTP */

  const verify = async()=>{

    if(!otp){

      setError("Enter OTP");

      return;

    }

    try{

      setLoading(true);

      setError("");

      const voterId = localStorage.getItem("voterId");

      const res = await api.post(

        "/voter-auth/verify-otp",

        {
          voterId,
          otp: otp.trim()
        }

      );

      localStorage.setItem("token",res.data.token);

      localStorage.setItem("role",res.data.role);

      navigate("/vote",{ replace:true });

    }catch(err){

      setError(

        err.response?.data ||
        "Invalid OTP"

      );

    }finally{

      setLoading(false);

    }

  };

  return(

    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 flex items-center justify-center px-4">

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-md text-white">

        {/* ICON */}

        <div className="flex justify-center mb-6">

          <div className="bg-white/20 p-4 rounded-full shadow-lg">

            <ShieldCheck size={42} />

          </div>

        </div>

        {/* TITLE */}

        <h1 className="text-4xl font-bold text-center mb-2">

          OTP Verification

        </h1>

        <p className="text-center text-white/70 mb-8">

          Enter the OTP sent to your email

        </p>

        {/* ERROR */}

        {error && (

          <div className="bg-red-500/20 border border-red-300 text-red-100 p-3 rounded-xl mb-5 text-center">

            {error}

          </div>

        )}

        {/* OTP INPUT */}

        <input

          value={otp}

          onChange={(e)=>setOtp(e.target.value)}

          placeholder="Enter OTP"

          maxLength={6}

          className="w-full p-4 rounded-xl bg-white/20 border border-white/20 placeholder-white/70 outline-none mb-6 text-center text-2xl tracking-[10px]"

        />

        {/* TIMER */}

        <div className="text-center mb-6 text-sm text-white/70">

          {timer > 0 ? (

            <p>

              Resend OTP in {timer}s

            </p>

          ) : (

            <button

              className="underline hover:text-white"

              onClick={()=>window.location.reload()}

            >

              Resend OTP

            </button>

          )}

        </div>

        {/* BUTTON */}

        <button

          onClick={verify}

          disabled={loading}

          className="w-full bg-white text-indigo-700 font-bold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg disabled:opacity-60"

        >

          {loading ? "Verifying..." : "Verify OTP"}

        </button>

      </div>

    </div>

  );

}
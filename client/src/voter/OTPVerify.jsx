import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function OTPVerify(){

  const [otp,setOtp] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

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

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);

    navigate("/vote", { replace:true });

  }catch(err){

    setError(
      err.response?.data || "Invalid OTP"
    );

  }finally{

    setLoading(false);

  }

};

  return(
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl p-10 w-96 text-center">

        <h1 className="text-3xl font-bold text-indigo-600 mb-2">
          OTP Verification
        </h1>

        <p className="text-gray-500 mb-6">
          Enter OTP sent to your email
        </p>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <input
          placeholder="Enter OTP"
          className="w-full border p-3 rounded-lg mb-6 text-center text-lg tracking-widest"
          onChange={(e)=>setOtp(e.target.value)}
        />  

        <button
          onClick={verify}
          className="w-full bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

      </div>

    </div>
  );
}
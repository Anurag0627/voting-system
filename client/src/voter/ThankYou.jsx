import { useEffect } from "react";

export default function ThankYou(){

  useEffect(()=>{

  localStorage.removeItem("token");

},[]);

 return(

    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center px-4">

      {/* MAIN CARD */}

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-12 max-w-2xl w-full text-center text-white relative overflow-hidden">

        {/* BACKGROUND EFFECT */}

        <div className="absolute top-0 right-0 text-[180px] opacity-10">

          ✅

        </div>

        {/* ICON */}

        <div className="flex justify-center mb-6">

          <div className="bg-white/20 p-6 rounded-full shadow-2xl animate-bounce">

            <span className="text-6xl">

              ✅

            </span>

          </div>

        </div>

        {/* TITLE */}

        <h1 className="text-5xl font-extrabold mb-4">

          Vote Submitted

        </h1>

        <p className="text-emerald-100 text-xl mb-8">

          Your vote has been securely recorded in the system.

        </p>

        {/* INFO CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">

            <div className="text-4xl mb-3">

              🔒

            </div>

            <h2 className="text-2xl font-bold mb-2">

              Secure Voting

            </h2>

            <p className="text-white/70">

              Your vote is encrypted and protected.

            </p>

          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">

            <div className="text-4xl mb-3">

              🗳

            </div>

            <h2 className="text-2xl font-bold mb-2">

              Successfully Counted

            </h2>

            <p className="text-white/70">

              Your participation has been recorded.

            </p>

          </div>

        </div>

        {/* THANK YOU */}

        <div className="bg-white/10 border border-white/10 rounded-3xl p-6">

          <h3 className="text-2xl font-bold mb-3">

            Thank You for Participating 🎉

          </h3>

          <p className="text-white/80 leading-relaxed">

            Your contribution helps ensure a fair and transparent democratic process within the election system.

          </p>

        </div>

      </div>

    </div>

  );
}
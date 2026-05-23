import { useEffect, useState } from "react";
import {
  Vote,
  Users,
  Trophy,
  CheckCircle
} from "lucide-react";

import AdminLayout from "../layout/AdminLayout";
import api from "../services/api";

export default function AdminDashboard(){

  const [stats,setStats] = useState({

    elections:0,
    voters:0,
    candidates:0,
    votes:0

  });

  useEffect(()=>{

    const loadStats = async()=>{

      try{

        const token = localStorage.getItem("token");

        const res = await api.get(

          "/admin/stats",

          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }

        );

        setStats(res.data);

      }catch(err){

        console.log(err);

      }

    };

    loadStats();

  },[]);

  const cards = [

    {
      title:"Total Elections",
      value:stats.elections,
      icon:<Vote size={32} />,
      color:"from-indigo-500 to-indigo-700"
    },

    {
      title:"Total Voters",
      value:stats.voters,
      icon:<Users size={32} />,
      color:"from-emerald-500 to-emerald-700"
    },

    {
      title:"Candidates",
      value:stats.candidates,
      icon:<Trophy size={32} />,
      color:"from-pink-500 to-pink-700"
    },

    {
      title:"Votes Cast",
      value:stats.votes,
      icon:<CheckCircle size={32} />,
      color:"from-yellow-500 to-orange-600"
    }

  ];

  return(

    <AdminLayout>

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">

          Dashboard Overview

        </h1>

        <p className="text-gray-500 text-lg">

          Monitor elections, voters and voting activity in real-time.

        </p>

      </div>

      {/* STATS GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">

        {cards.map((card,index)=>(

          <div

            key={index}

            className={`

              bg-gradient-to-br
              ${card.color}

              rounded-3xl
              p-8
              text-white
              shadow-2xl
              hover:scale-105
              transition-all
              duration-300

            `}

          >

            <div className="flex justify-between items-center mb-6">

              <div className="bg-white/20 p-4 rounded-2xl">

                {card.icon}

              </div>

            </div>

            <h2 className="text-lg font-medium text-white/80">

              {card.title}

            </h2>

            <h1 className="text-5xl font-extrabold mt-2">

              {card.value}

            </h1>

          </div>

        ))}

      </div>

      {/* WELCOME PANEL */}

      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">

        <div className="flex items-center gap-4 mb-4">

          <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl text-3xl">

            👋

          </div>

          <div>

            <h2 className="text-3xl font-bold text-slate-800">

              Welcome Admin

            </h2>

            <p className="text-gray-500">

              Manage and monitor your election system securely.

            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-slate-100 rounded-2xl p-6">

            <h3 className="font-bold text-lg mb-2">

              🗳 Elections

            </h3>

            <p className="text-gray-600">

              Create and manage live election campaigns.

            </p>

          </div>

          <div className="bg-slate-100 rounded-2xl p-6">

            <h3 className="font-bold text-lg mb-2">

              👥 Voters

            </h3>

            <p className="text-gray-600">

              Add voters securely with OTP verification.

            </p>

          </div>

          <div className="bg-slate-100 rounded-2xl p-6">

            <h3 className="font-bold text-lg mb-2">

              📊 Results

            </h3>

            <p className="text-gray-600">

              Track election results and voting analytics.

            </p>

          </div>

        </div>

      </div>

    </AdminLayout>

  );

}
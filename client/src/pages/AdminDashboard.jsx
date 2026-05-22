import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import DashboardCard from "../components/DashboardCard";
import api from "../services/api";

export default function AdminDashboard(){

  const [stats,setStats] = useState({
    elections:0,
    voters:0,
    candidates:0,
    votes:0
  });

  useEffect(()=>{

    const loadStats = async ()=>{

      const token = localStorage.getItem("token");

      const res = await api.get("/admin/stats",{
        headers:{ Authorization:`Bearer ${token}` }
      });

      setStats(res.data);
    };

    loadStats();

  },[]);

  return(
    <AdminLayout>

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8">
        Dashboard Overview
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-6 mb-10">

        <DashboardCard
          title="Total Elections"
          value={stats.elections}
          icon="🗳"
        />

        <DashboardCard
          title="Total Voters"
          value={stats.voters}
          icon="👥"
        />

        <DashboardCard
          title="Candidates"
          value={stats.candidates}
          icon="🎯"
        />

        <DashboardCard
          title="Votes Cast"
          value={stats.votes}
          icon="✅"
        />

      </div>

      {/* Welcome Panel */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-2">
          Welcome Admin 👋
        </h2>

        <p className="text-gray-600">
          Manage elections, candidates, voters and monitor live results
          from this dashboard.
        </p>

      </div>

    </AdminLayout>
  );
}
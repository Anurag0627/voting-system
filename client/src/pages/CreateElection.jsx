import { useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../services/api";

export default function CreateElection(){

  const [title,setTitle] = useState("");
  const [startTime,setStartTime] = useState("");
  const [endTime,setEndTime] = useState("");
  const [message,setMessage] = useState("");
  const [loading,setLoading] = useState(false);

  const formatDateTimeLocal = (date) => {

    if(!date) return "";

    const d = new Date(date);

    d.setMinutes(
      d.getMinutes() - d.getTimezoneOffset()
    );

    return d.toISOString().slice(0,16);

  };

  const handleCreate = async ()=>{

    if(!title || !startTime || !endTime){
      setMessage("All fields required");
      return;
    }

    try{
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      await api.post(
        "/elections/create",
        {
          title,
          startTime,
          endTime
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setMessage("✅ Election Created Successfully");
      setTitle("");
      setStartTime("");
      setEndTime("");

    }catch(err){
      setMessage("❌ Failed to create election");
    }finally{
      setLoading(false);
    }
  };

  return(
    <AdminLayout>

      <div className="max-w-2xl mx-auto">

        {/* Page Heading */}
        <h1 className="text-3xl font-bold mb-6 pl-45 max-w-xl mx-auto">
          Create Election
        </h1>

        {/* Form Card */}
        <div className="bg-white shadow rounded-xl p-8">

          {message && (
            <p className="mb-4 text-center text-1xl text-red-600">
              {message}
            </p>
          )}

          {/* Title */}
          <label className="block mb-2 font-medium">
            Election Title
          </label>

          <input
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            placeholder="Student Council Election 2026"
            className="w-full border rounded-lg p-3 mb-6 focus:outline-indigo-600"
          />

          {/* Start Time */}
          <label className="block mb-2 font-medium">
            Start Date & Time
          </label>

          <input
            type="datetime-local"
            value={formatDateTimeLocal(startTime)}
            onChange={(e)=>setStartTime(e.target.value)}
            className="w-full border rounded-lg p-3 mb-6 focus:outline-indigo-600"
          />

          {/* End Time */}
          <label className="block mb-2 font-medium">
            End Date & Time
          </label>

          <input
            type="datetime-local"
            value={formatDateTimeLocal(endTime)}
            onChange={(e)=>setEndTime(e.target.value)}
            className="w-full border rounded-lg p-3 mb-8 focus:outline-indigo-600"
          />

          {/* Button */}
          <button
            onClick={handleCreate}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition transform hover:scale-105 active:scale-95
                          active:bg-indigo-900
                          transition-all duration-150"
          >
            {loading ? "Creating..." : "Create Election"}
          </button>

        </div>

      </div>

    </AdminLayout>
  );
}
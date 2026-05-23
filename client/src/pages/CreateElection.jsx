import { useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateElection(){

  const [title,setTitle] = useState("");
  const [startTime,setStartTime] = useState(null);
  const [endTime,setEndTime] = useState(null);
  const [message,setMessage] = useState("");
  const [loading,setLoading] = useState(false);


  const handleCreate = async ()=>{

    if(!title || !startTime || !endTime){

      setMessage("All fields required");

      return;

    }

    try{

      setLoading(true);

      setMessage("");

      const token = localStorage.getItem("token");

      // ✅ CONVERT ONLY ONCE
      const start = new Date(startTime);

      const end = new Date(endTime);

      await api.post(

        "/elections/create",

        {
          title,

          startTime: start,

          endTime: end
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

      console.log(err);

      setMessage("❌ Failed to create election");

    }finally{

      setLoading(false);

    }

  };

  return(

    <AdminLayout>

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-5xl font-extrabold text-slate-800 mb-3">

          🗳 Create Election

        </h1>

        <p className="text-gray-500 text-lg">

          Schedule and launch secure digital elections.

        </p>

      </div>

      {/* MAIN CARD */}

      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* TOP BANNER */}

          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-10 text-white">

            <div className="flex items-center gap-5">

              <div className="bg-white/20 p-5 rounded-3xl text-4xl">

                🚀

              </div>

              <div>

                <h2 className="text-4xl font-extrabold mb-2">

                  Election Setup

                </h2>

                <p className="text-indigo-100 text-lg">

                  Configure election schedule and timings

                </p>

              </div>

            </div>

          </div>

          {/* FORM */}

          <div className="p-10">

            {/* MESSAGE */}

            {message && (

              <div className={`

                mb-6
                p-4
                rounded-2xl
                font-medium

                ${

                  message.includes("✅")

                  ? "bg-emerald-100 text-emerald-700"

                  : "bg-red-100 text-red-700"

                }

              `}>

                {message}

              </div>

            )}

            {/* TITLE */}

            <div className="mb-6">

              <label className="block text-slate-700 font-bold mb-3 text-lg">

                Election Title

              </label>

              <input

                value={title}

                onChange={(e)=>setTitle(e.target.value)}

                placeholder="Student Council Election 2026"

                className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300"

              />

            </div>

            {/* DATE GRID */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* START TIME */}

              <div className="bg-slate-50 border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">

                <div className="flex items-center gap-4 mb-5">

                  <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl text-3xl">

                    🚀

                  </div>

                  <div>

                    <h3 className="text-2xl font-bold text-slate-800">

                      Start Time

                    </h3>

                    <p className="text-gray-500">

                      Election activation time

                    </p>

                  </div>

                </div>

                <input

                  type="datetime-local"

                  value={startTime}

                  onChange={(e)=>setStartTime(e.target.value)}

                  className="w-full bg-white border-2 border-gray-200 p-4 rounded-2xl text-slate-700 text-lg shadow-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 transition-all duration-300"

                />

              </div>

              {/* END TIME */}

              <div className="bg-slate-50 border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">

                <div className="flex items-center gap-4 mb-5">

                  <div className="bg-red-100 text-red-600 p-4 rounded-2xl text-3xl">

                    ⏱

                  </div>

                  <div>

                    <h3 className="text-2xl font-bold text-slate-800">

                      End Time

                    </h3>

                    <p className="text-gray-500">

                      Election closing time

                    </p>

                  </div>

                </div>

                <input

                  type="datetime-local"

                  value={endTime}

                  onChange={(e)=>setEndTime(e.target.value)}

                  className="w-full bg-white border-2 border-gray-200 p-4 rounded-2xl text-slate-700 text-lg shadow-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all duration-300"

                />

              </div>

            </div>

            {/* INFO PANEL */}

            <div className="mt-8 bg-slate-100 rounded-3xl p-6">

              <h3 className="font-bold text-slate-800 text-xl mb-3">

                📌 Election Guidelines

              </h3>

              <ul className="space-y-2 text-gray-600">

                <li>

                  • Ensure election timings are accurate

                </li>

                <li>

                  • Voters can login only during active election

                </li>

                <li>

                  • Results become available after election ends

                </li>

                <li>

                  • OTP verification is required for voting

                </li>

              </ul>

            </div>

            {/* BUTTON */}

            <button

              onClick={handleCreate}

              className={`

                w-full
                mt-8
                py-4
                rounded-2xl
                text-white
                text-lg
                font-bold
                shadow-2xl
                transition-all
                duration-300

                ${

                  loading

                  ? "bg-gray-400 cursor-not-allowed"

                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-90 hover:scale-105 active:scale-95"

                }

              `}

            >

              {

                loading

                ? "Creating Election..."

                : "Create Election"

              }

            </button>

          </div>

        </div>

      </div>

    </AdminLayout>

  );
}
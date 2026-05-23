import {
  LayoutDashboard,
  Vote,
  Users,
  Trophy,
  BarChart3,
  LogOut
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout({ children }){

  const location = useLocation();

  const navigate = useNavigate();

  const logout = ()=>{

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    navigate("/");

  };

  const menu = [

    {
      name:"Dashboard",
      path:"/admin/dashboard",
      icon:<LayoutDashboard size={22} />
    },

    {
      name:"Create Election",
      path:"/admin/create-election",
      icon:<Vote size={22} />
    },

    {
      name:"Manage Elections",
      path:"/admin/manage-elections",
      icon:<Vote size={22} />
    },

    {
      name:"Add Candidates",
      path:"/admin/add-candidate",
      icon:<Trophy size={22} />
    },

    {
      name:"Manage Candidates",
      path:"/admin/manage-candidates",
      icon:<Trophy size={22} />
    },

    {
      name:"Manage Voters",
      path:"/admin/manage-voters",
      icon:<Users size={22} />
    },

    {
      name:"Results",
      path:"/admin/results",
      icon:<BarChart3 size={22} />
    }

  ];

  return(

    <div className="flex min-h-screen bg-slate-100">

      {/* SIDEBAR */}

      <div className="w-72 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl flex flex-col justify-between p-6">

        {/* TOP */}

        <div>

          {/* LOGO */}

          <div className="mb-12">

            <h1 className="text-3xl font-extrabold tracking-wide">

              🗳 VoteSys

            </h1>

            <p className="text-gray-400 mt-2">

              Admin Control Panel

            </p>

          </div>

          {/* MENU */}

          <div className="space-y-3">

            {menu.map((item,index)=>(

              <Link

                key={index}

                to={item.path}

                className={`

                  flex
                  items-center
                  gap-4
                  px-5
                  py-4
                  rounded-2xl
                  transition-all
                  duration-300
                  font-medium

                  ${

                    location.pathname === item.path

                    ? "bg-indigo-500 shadow-lg"

                    : "hover:bg-white/10"

                  }

                `}

              >

                {item.icon}

                {item.name}

              </Link>

            ))}

          </div>

        </div>

        {/* LOGOUT */}

        <button

          onClick={logout}

          className="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 transition-all duration-300 py-4 rounded-2xl font-bold shadow-lg"

        >

          <LogOut size={20} />

          Logout

        </button>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 p-10 overflow-y-auto">

        {children}

      </div>

    </div>

  );

}
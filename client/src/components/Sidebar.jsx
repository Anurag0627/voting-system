import { Link, useLocation } from "react-router-dom";

export default function Sidebar(){

  const location = useLocation();

  const menu = [
    {name:"Dashboard", path:"/dashboard"},
    {name:"Create Election", path:"/create-election"},
    {name:"Manage Elections", path:"/manage-elections"},
    {name:"Add Candidate", path:"/add-candidate"},
    {name:"Manage Candidates", path:"/manage-candidates"},
    {name:"Manage Voters", path:"/add-voter"},
    {name:"Results", path:"/results"},
  ];

  return(
    <div className="w-64 h-screen bg-indigo-950 text-white p-6">

  <h1 className="text-2xl font-bold mb-10">
    🗳 Voting Admin
  </h1>

  <div className="space-y-2">

    {menu.map((item) => {
      const active = location.pathname === item.path;

      return (
        <Link
          key={item.path}
          to={item.path}
          className={`relative block p-3 rounded-lg transition-all duration-200 transform
          ${
            active
              ? "bg-indigo-700 shadow-lg"
              : "hover:bg-indigo-600 hover:translate-x-2 active:scale-95"
          }`}
        >

          {/* Active indicator */}
          {active && (
            <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r"></span>
          )}

          {item.name}

        </Link>
      );
    })}

  </div>

</div>
  );
}
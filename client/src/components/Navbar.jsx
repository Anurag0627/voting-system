import { useNavigate } from "react-router-dom";

export default function Navbar(){

  const navigate = useNavigate();

  const logout = ()=>{

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");

  };

  return(

    <div className="bg-white shadow flex justify-between items-center p-4 rounded-2xl">

      <h2 className="text-xl font-semibold text-gray-700">

        Admin Dashboard

      </h2>

      <button

        onClick={logout}

        className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-150 shadow-lg"

      >

        Logout

      </button>

    </div>

  );

}
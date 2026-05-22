export default function Navbar(){

  return(
    <div className="bg-white shadow flex justify-between items-center p-4">

      <h2 className="text-xl font-semibold text-gray-700">
        Admin Dashboard
      </h2>

      <button
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transform hover:scale-105 active:scale-95
  active:bg-red-900
  transition-all duration-150"
        onClick={()=>{
          localStorage.clear();
          window.location="/";
        }}
      >
        Logout
      </button>

    </div>
  );
}
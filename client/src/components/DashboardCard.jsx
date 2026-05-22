export default function DashboardCard({title,value,icon}){

  return(
    <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">

      <div>
        <p className="text-gray-500">{title}</p>
        <h1 className="text-3xl font-bold text-gray-800">
          {value}
        </h1>
      </div>

      <div className="text-4xl">{icon}</div>

    </div>
  );
}
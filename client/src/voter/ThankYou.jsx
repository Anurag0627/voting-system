export default function ThankYou(){

  useEffect(()=>{

  localStorage.removeItem("token");

},[]);

  return(
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl p-10 text-center">

        <div className="text-6xl mb-4">✅</div>

        <h1 className="text-3xl font-bold text-indigo-600">
          Vote Submitted Successfully
        </h1>

        <p className="text-gray-600 mt-4">
          Thank you for participating in the election.
        </p>

        <p className="text-sm text-gray-400 mt-2">
          Your vote has been securely recorded.
        </p>

      </div>

    </div>
  );
}
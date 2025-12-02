import { useState, useEffect,} from "react";
import Supabase from "../../Supabase";

const EmotionCard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emotionData, setEmotionData] = useState([]);
  
    useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

      const { data, error } = await Supabase.from('userDetails').select(`
            "*",
            emotion!emotion_user_id_fkey ("*")
          `)
          .order("created_at", { ascending: true });

      setEmotionData(data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load employee data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto p-4 bg-white rounded shadow">
  <div className="grid grid-flow-col auto-cols-[minmax(200px,1fr)] sm:auto-cols-[minmax(250px,1fr)]">
    {emotionData.length === 0 ? (
      <div className="col-span-full text-center py-12 text-gray-500">
        No employees found.
      </div>
    ) : (
      emotionData.map((emp) => {
        return (
          <div
            key={emp.id}
            className="cursor-pointer transition-transform hover:scale-105"
          >
            <div className="text-center">
              <div className="relative inline-block mb-2">
                <img
                  className="rounded-full h-20 w-20 object-cover border-2 border-gray-200"
                  src={emp.image || "/default-avatar.png"}
                  alt={`${emp.first_name}'s avatar`}
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center text-lg">
                  {emp.emotion[0].emotion || "😐"}
                </div>
              </div>
              <div className="font-bold text-lg">
                {emp.first_name} {emp.last_name}
              </div>
              <div className="text-xs text-gray-600 mt-1 italic">
                {emp.position || "No position"}
              </div>
            </div>
          </div>
        );
      })
    )}
  </div>
</div>
    </>
  );
};

export default EmotionCard;
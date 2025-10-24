import UserModal from "../../components/UserModal";
import TaskModal from "../../components/TaskModal";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Supabase from "../../Supabase";

const EmotionCard = () => {
  const [emotionData, setEmotion] = useState([]);
  const [userData, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  const modalRef = useRef();

  // Fetch data with error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [usersResponse, emotionsResponse] = await Promise.all([
          Supabase.from("userDetails").select("*"),
          Supabase.from("emotion").select("*")
        ]);

        if (usersResponse.error) throw usersResponse.error;
        if (emotionsResponse.error) throw emotionsResponse.error;

        setUsers(usersResponse.data || []);
        setEmotion(emotionsResponse.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load employee data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoized filtered employees
  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return userData;
    
    const search = searchTerm.toLowerCase();
    return userData.filter((emp) =>
      emp.first_name?.toLowerCase().includes(search) ||
      emp.last_name?.toLowerCase().includes(search) ||
      emp.position?.toLowerCase().includes(search)
    );
  }, [userData, searchTerm]);

  // Get current emotion for an employee
  const getEmployeeEmotion = useCallback((employeeId) => {
    const employeeEmotions = emotionData.filter(
      (emotion) => emotion.user_id === employeeId
    );
    
    // Get the most recent emotion
    const latestEmotion = employeeEmotions
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .find((emotion) => emotion.emotion != null);
    
    return latestEmotion?.emotion || "😐";
  }, [emotionData]);

  // Handle employee click
  const handleEmployeeClick = useCallback((employee) => {
    setSelectedEmployee(employee);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 p-4 bg-white rounded shadow">
        {filteredEmployees.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No employees found matching your search.
          </div>
        ) : (
          filteredEmployees.map((emp) => {
            const currentEmotion = getEmployeeEmotion(emp.id);

            return (
              <div
                key={emp.id}
                onClick={() => handleEmployeeClick(emp)}
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
                      {currentEmotion}
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

      {selectedEmployee && (
        <UserModal
          ref={modalRef}
          patient={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          showTasks
        />
      )}

      <TaskModal ref={modalRef} onClose={() => {}} />
    </>
  );
};

export default EmotionCard;
import { useRef, useState, useEffect } from "react";
import Supabase from "../../Supabase";


const user = JSON.parse(sessionStorage.getItem("user"));


const Activity = () => {
  const modalRef = useRef(null);
  const [TaskData, setTasks] = useState([]);
   

  const fetchTasks = async () => {
    const { data } = await Supabase.from("tasks").select("*");
    const completedTasks = data.filter(task => task.user_id === user.id && task.status != "completed");
    setTasks(completedTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  const riskLevelStyles = {
    High: "bg-red-200 text-red-600",
    Moderate: "bg-yellow-200 text-yellow-700",
    Low: "bg-green-300 text-green-700",
  };

  return (
    <div className="bg-white p-4 sm:p-6 mt-8 rounded-lg shadow-md overflow-y-auto h-[50h]">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-base-content mb-1">
          Upcoming Deadlines
        </h1>
        <p className="text-sm text-base-content/70">
          Tasks with approaching deadlines
        </p>
      </div>
      <div className="space-y-4 overflow-y-auto h-[50vh]">
        {TaskData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No upcoming tasks
            </h3>
            <p className="text-sm text-gray-500">
              You're all caught up! No pending deadlines at the moment.
            </p>
          </div>
        ) : (
          TaskData.map((task) => (
            <div
              key={task.id}
              className="card border border-base-300 rounded-md"
            >
              <div className="card-body p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-base-content text-sm sm:text-base">
                        {task.title}
                      </h3>
                      <p className="text-xs text-red-400">
                        {task.deadline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Activity;
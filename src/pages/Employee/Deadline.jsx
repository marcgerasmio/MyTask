import { useRef, useState } from "react";
import { tasksDone } from "../../lib/data";
import { FetchTasks } from "../../lib/data";


const user = JSON.parse(sessionStorage.getItem("user"));
const TaskData = await FetchTasks().then(data => data.filter(task => task.user_id === user.id && task.status != "completed")).catch(() => 0);

const Activity = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const modalRef = useRef(null);


  const riskLevelStyles = {
    High: "bg-red-200 text-red-600",
    Moderate: "bg-yellow-200 text-yellow-700",
    Low: "bg-green-300 text-green-700",
  };

  return (
    <div className="bg-white p-4 sm:p-6 mt-8 rounded-lg shadow-md">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-base-content mb-1">
          Upcoming Deadlines
        </h1>
        <p className="text-sm text-base-content/70">
            Tasks with approaching deadlines
        </p>
      </div>
      <div className="space-y-4 overflow-y-auto">
        {TaskData.map((task) => (
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
          ))}
      </div>
    </div>
  );
};

export default Activity;

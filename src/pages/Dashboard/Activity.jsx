import { useRef, useState } from "react";
import { tasksDone } from "../../lib/data";
import { FetchTasks, FetchUsers } from "../../lib/data";
import { useEffect } from "react";


const Activity = () => {
  const [UserData, setUsers] = useState([]);
  const [TaskData, setTasks] = useState([]);
    useEffect(() => {
    FetchTasks()
      .then(data => {
        const completedTasks = data.filter(task => task.status === 'completed');
        setTasks(completedTasks);
      })
      .catch(err => {
        console.error("Error fetching tasks:", err);
        setTasks([]); 
      });
  }, []);
    useEffect(() => {
    FetchUsers().then(setUsers);
    }, []);

  
  const modalRef = useRef(null);
  const riskLevelStyles = {
    High: "bg-red-200 text-red-600",
    Moderate: "bg-yellow-200 text-yellow-700",
    Low: "bg-green-300 text-green-700",
  };

  const tasksArray = new Map(UserData.map(obj => [obj.id, obj]));

  const result = TaskData.map(obj2 => {
      const matchingObj1 = tasksArray.get(obj2.user_id);
      return matchingObj1 ? { ...matchingObj1, ...obj2 } : obj2;
  });

  return (
    <div className="bg-white p-4 sm:p-6 mt-8 rounded-lg shadow-md">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-base-content mb-1">
          Recent Tasks
        </h1>
        <p className="text-sm text-base-content/70">
          Latest Tasks Completed
        </p>
      </div>
      <div className="space-y-4">
        {result.map((task) => (
            <div
              key={task.id}
              className="card border border-base-300 rounded-md"
            >
              <div className="card-body p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      className="w-12 h-12 rounded-full object-cover"
                      src={task.image}
                      alt="user"
                    />
                    <div>
                      <h3 className="font-semibold text-base-content text-sm sm:text-base">
                     {task.title}
                      </h3>
                      <p className="text-xs text-base-content/90">
                        Assigned To: {task.first_name} {task.last_name}
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

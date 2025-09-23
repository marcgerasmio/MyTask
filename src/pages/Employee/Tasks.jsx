import { useParams } from "react-router-dom";
import { useState } from "react";
import { usersData, tasksData } from "../../lib/data";
import Sidebar from "../../components/Sidebar";
import { IoIosAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FetchTasks } from "../../lib/data";


const STATUS_TABS = [
  { label: "Ongoing", value: "ongoing" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  
];
const TAB_COLORS = {
  ongoing: "bg-blue-500 text-white",
  pending: "bg-yellow-500 text-white",
  completed: "bg-green-600 text-white",
  default: "bg-gray-200 text-gray-700"
};

const TasksData = await FetchTasks();


const Tasks = () => {
  
  const location = useLocation();
    const { employeeData } = location.state || {};
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = Number(user.id);
    const employee = usersData.find((emp) => emp.id === employeeId);
    const employeeTasks = TasksData.filter((task) => task.user_id === employeeId);

  const [activeTab, setActiveTab] = useState("ongoing");

  const filteredTasks = employeeTasks.filter((task) => task.status.toLowerCase() === activeTab);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 pt-20 sm:p-6 lg:pt-6 lg:ml-64">
        <div className="bg-white p-4 rounded shadow">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
              <img src={user.image} alt="Avatar" className="rounded-full h-16 w-16" />
              <div>
                <div className="font-bold text-xl">{user.first_name} {user.last_name}</div>
                <div className="text-sm text-gray-500">{user.position}</div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </div>
            </div>
        </div>
        </div>
        <div className="min-h-screen bg-gray-100 p-6">
          <h2 className="font-bold text-lg mb-2">All Tasks</h2>
          <div className="flex gap-2 mb-4">
             {STATUS_TABS.map((tab) => {
                const isActive = activeTab === tab.value;
                const colorClass = isActive ? TAB_COLORS[tab.value] : TAB_COLORS.default;
                return (
                <button
                    key={tab.value}
                    className={`px-4 py-2 rounded ${colorClass}`}
                    onClick={() => setActiveTab(tab.value)}
                >
                    {tab.label}
                </button>
                );
            })}
          </div>
          <div className="grid gap-4">
            {filteredTasks.length === 0 ? (
              <div className="text-gray-500">No tasks in this category.</div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="bg-gray-50 rounded p-4 shadow flex justify-between items-center">
                <div>
                  <div className="font-bold">{task.title}</div>
                  <div className="text-s text-gray-600">{task.description}</div>
                  <div className="text-xs text-red-400">{task.deadline}</div>
                </div>
                <button className="bg-green-900 text-white btn rounded-lg"
                onClick={() => {modalRef.current?.open();}}>
                Action
                </button>
                 </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
    
  );
};

export default Tasks;
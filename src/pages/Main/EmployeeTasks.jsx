import { useParams } from "react-router-dom";
import { useState } from "react";
import { usersData, tasksData } from "../../lib/data";
import Sidebar from "../../components/Sidebar";
import { FaBackward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


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


const EmployeeTasks = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const employeeId = Number(id);
    const employee = usersData.find((emp) => emp.id === employeeId);
    const employeeTasks = tasksData.filter((task) => task.assignedTo === employeeId);

  const [activeTab, setActiveTab] = useState("ongoing");

  if (!employee) {
    return <div className="p-6">Employee not found.</div>;
  }

  const filteredTasks = employeeTasks.filter((task) => task.status.toLowerCase() === activeTab);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 pt-20 sm:p-6 lg:pt-6 lg:ml-64">
        <div className="bg-white p-4 rounded shadow">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
              <img src={employee.image} alt="Avatar" className="rounded-full h-16 w-16" />
              <div>
                <div className="font-bold text-xl">{employee.name}</div>
                <div className="text-sm text-gray-500">{employee.position}</div>
                <div className="text-xs text-gray-400">{employee.email}</div>
              </div>
            </div>
                    <div className="flex flex-col sm:flex-row gap-2 align-center">
                      <button
                        className="bg-green-900 text-white btn rounded-lg mb-5"
                        onClick={() => navigate(`/tasks`)}>
                        <FaBackward className="h-4 w-4 mr-2" />
                        Back to Task Lists
                    </button>
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
                <div key={task.id} className="bg-gray-50 rounded p-4 shadow">
                  <div className="font-bold">{task.title}</div>
                  <div className="text-s text-gray-600">{task.description}</div>
                    <div className="text-xs text-gray-400">{task.dateCreated}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
    
  );
};

export default EmployeeTasks;
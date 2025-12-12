import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { usersData, tasksData } from "../../lib/data";
import Sidebar from "../../components/Sidebar";
import { FaBackward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import { deleteFunction } from "../../lib/functions";
import { FaRegEdit } from "react-icons/fa";
import Supabase from "../../Supabase";
import EditTaskModal from "../../components/EditTaskModal";
import TaskRemarksModal from "../../components/RemarksModal";


const STATUS_TABS = [
  { label: "Ongoing", value: "ongoing" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  
];
const TAB_COLORS = {
  ongoing: "bg-orange-500 text-white",
  pending: "bg-yellow-500 text-white",
  completed: "bg-green-600 text-white",
  default: "bg-gray-200 text-gray-700"
};



const EmployeeTasks = () => {
  const [TasksData, setTasks] = useState([]);
  const [AllTasksData, setAllTasks] = useState([]); // Store all tasks
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const modalRef = useRef();
  const remarksModalRef = useRef();


  // Get current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Fetch all tasks on component mount
  const fetchAllTasks = async () => {
    const { data } = await Supabase.from("tasks").select("*");
    setAllTasks(data || []);
  };

  const fetchTasks = async (start, end) => {
    const { data } = await Supabase.from("tasks").select("*")
      .gte('created_at', start)
      .lte('created_at', end);
    setTasks(data || []);
  };

  function GetFirstAndLastDate(year, month) {
    const firstDayOfMonth = new Date(year, month - 1, 2);
    const lastDayOfMonth = new Date(year, month, 1);
    console.log('First Day: ' + firstDayOfMonth.toISOString());
    console.log('Last Day: ' + lastDayOfMonth.toISOString());
    const start = firstDayOfMonth.toISOString();
    const end = lastDayOfMonth.toISOString();
    fetchTasks(start, end);
  }

  function getCurrentMonthAndYear() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[currentDate.getMonth()];

    return {
      monthNumber: month,
      monthName: monthName,
      year: year
    };
  }

  function handleTask() {
    const { monthNumber, year } = getCurrentMonthAndYear();
    setMonth(monthNumber);
    setYear(year);
    GetFirstAndLastDate(year, monthNumber);
  }

  useEffect(() => {
    fetchAllTasks(); // Fetch all tasks for ongoing/pending
    handleTask();
  }, []);
  
  const location = useLocation();
  const { employeeData } = location.state || {};
  const navigate = useNavigate();
  const { id } = useParams();
  const employeeId = Number(id);
  const employee = usersData.find((emp) => emp.id === employeeId);
  
  const [activeTab, setActiveTab] = useState("ongoing");
  
  // Filter employee tasks based on active tab
  const employeeTasks = (() => {
    if (activeTab === 'ongoing' || activeTab === 'pending') {
      // For ongoing and pending, use all tasks
      return AllTasksData.filter((task) => task.user_id === employeeData.id);
    } else {
      // For completed, use date-filtered tasks
      return TasksData.filter((task) => task.user_id === employeeData.id);
    }
  })();

  const filteredTasks = employeeTasks.filter((task) => task.status.toLowerCase() === activeTab);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    remarksModalRef.current?.open();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col p-4 pt-20 sm:p-6 lg:pt-6 lg:ml-64 overflow-hidden">
        <div className="bg-white p-4 rounded shadow flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={employeeData.image} alt="Avatar" className="rounded-full h-16 w-16" />
              <div>
                <div className="font-bold text-xl">{employeeData.first_name} {employeeData.last_name}</div>
                <div className="text-sm text-gray-500">{employeeData.position}</div>
                <div className="text-xs text-gray-400">{employeeData.email}</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 align-center">
              <select 
                defaultValue="Month" 
                className="select" 
                onChange={(e) => setMonth(e.target.value)} 
                value={month}
              >
                <option disabled={true}>Month</option>
                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
                <option value={7}>July</option>
                <option value={8}>August</option>
                <option value={9}>September</option>
                <option value={10}>October</option>
                <option value={11}>November</option>
                <option value={12}>December</option>
              </select>
              <select 
                defaultValue="Year" 
                className="select w-25" 
                onChange={(e) => setYear(e.target.value)} 
                value={year}
              >
                <option disabled={true}>Year</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
              <button 
                className="bg-green-900 text-white btn rounded-lg" 
                onClick={() => GetFirstAndLastDate(year, month)}
              >
                Display
              </button>
              <button
                className="bg-green-900 text-white btn rounded-lg"
                onClick={() => navigate(`/tasks`)}>
                <FaBackward className="h-4 w-4 mr-2" />
                Back to Employee Tasks
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 p-6 flex-1 flex flex-col overflow-hidden">
          <h2 className="font-bold text-lg mb-2 flex-shrink-0">All Tasks</h2>
          <div className="flex gap-2 mb-4 flex-shrink-0">
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
          
          <div className="flex-1 overflow-y-auto">
            <div className="grid gap-4">
              {filteredTasks.length === 0 ? (
                <div className="text-gray-500">No tasks in this category.</div>
              ) : (
                filteredTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="bg-gray-50 rounded p-4 shadow flex justify-between items-start cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleTaskClick(task)}
                  >
                    <div> 
                      <div className="flex items-center gap-2 mb-1">
                        
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${TAB_COLORS[task.status.toLowerCase()] || TAB_COLORS.default}`}>
          {task.category}
        </span>
        <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          TASK ID: {task.id}
                        </span>
                      </div>
                      <div className="font-bold">{task.title}</div>
                      <div className="text-s text-gray-600">{task.description}</div>
                      <div className="text-xs text-red-400">Deadline: {task.deadline}</div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="btn btn-ghost text-yellow-500 hover:bg-white border-none shadow-none btn-xs"
                        onClick={() => {
                          modalRef.current?.open();
                          setSelectedTask(task);
                        }}
                      >
                        <FaRegEdit size={14} />
                      </button>
                      <button 
                        className="btn btn-ghost text-red-500 hover:bg-white border-none shadow-none btn-xs"
                        onClick={() => deleteFunction("tasks", task.id)}
                      >
                           <FaRegTrashCan
                        className="text-red-600 cursor-pointer"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this task?")) {
                            deleteFunction("tasks", task.id);
                          }
                        }}
                      />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <EditTaskModal
          ref={modalRef}
          task={selectedTask}
          onClose={() => {}}
        />

        <TaskRemarksModal
          ref={remarksModalRef}
          task={selectedTask}
          currentUser={currentUser}
        />
      </main>
    </div>
  );
};

export default EmployeeTasks;
import Sidebar from "../../components/Sidebar";
import { CiSearch } from "react-icons/ci";
import { IoIosAddCircle } from "react-icons/io";
import UserModal from "../../components/UserModal";
import TaskModal from "../../components/TaskModal";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FetchUsers, FetchTasks} from "../../lib/data";

const Tasklists = () => {
  const [TasksData, setTasks] = useState([]);
  const [UserData, setUsers] = useState([]);
    useEffect(() => {
    FetchTasks().then(setTasks);
    }, []);
    useEffect(() => {
    FetchUsers().then(setUsers);
    }, []);
  
  const navigate = useNavigate();
  const modalRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

 
  const filteredEmployees = UserData.filter((emp) => {
    const search = searchTerm.toLowerCase();
    return emp.first_name.toLowerCase().includes(search);
  });
  const getOngoingTask = (tasksData) =>
    tasksData?.find((task) => task.status === "ongoing");

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 pt-20 sm:p-6 lg:pt-6 lg:ml-64">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">
              Employees & Tasks
              <span className="block font-normal text-sm sm:text-base text-gray-600">
                View employees and their ongoing tasks.
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="input rounded-md bg-white flex items-center gap-2">
                <CiSearch className="opacity-50" />
                <input
                  type="search"
                  className="w-full"
                  required
                  placeholder="Search employee name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
              <button
                className="bg-green-900 text-white btn rounded-lg"
                onClick={() => {
                  modalRef.current?.open();
                }}
              >
                <IoIosAddCircle className="h-4 w-4 mr-2" />
                Create Task
              </button>
            </div>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredEmployees.map((emp) => {
              const employeeTasks = TasksData.filter(
                (task) => task.user_id === emp.id
              );
              const ongoingTask = employeeTasks.find(
                (task) => task.status === "ongoing"
              );
              return (
                <div
                  key={emp.id}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition hover:scale-[1.02]"
                  onClick={() => navigate(`/employee/tasks`, { state: { employeeData: emp} })}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="rounded-full h-12 w-12">
                        <img src={emp.image} alt="Avatar" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-lg">{emp.first_name} {emp.last_name}</div>
                      <div className="text-sm text-gray-500">{emp.position}</div>
                      
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-1">Ongoing Task:</div>
                    {ongoingTask ? (
                      <div className="bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs font-medium">
                        {ongoingTask.title}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-xs">No ongoing task</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
      {selectedEmployee && (
        <UserModal
          ref={modalRef}
          patient={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          showTasks 
        />
      )}
        <TaskModal
           ref={modalRef}
          onClose={() => {}}
        />
    </>
  );
};

export default Tasklists;
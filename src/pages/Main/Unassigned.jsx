import Sidebar from "../../components/Sidebar";
import { CiSearch } from "react-icons/ci";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import TaskModal from "../../components/TaskModal";
import AssignModal from "../../components/AsssignModal";
import { useState, useRef, useEffect } from "react";
import { deleteFunction } from "../../lib/functions";
import Supabase from "../../Supabase";



const UnAssigned = () => {
  const modalRef = useRef();
  const taskRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [TasksData, setTasks] = useState([]);
  const fetchTasks = async () => {
    const { data } = await Supabase.from("tasks").select("*");
    const unassignedTasks = data.filter(task => task.user_id === null);
    setTasks(unassignedTasks);
  };

   useEffect(() => {
      fetchTasks();
    }, []);



  const adminStyle = {
    false: "bg-yellow-100 text-yellow-700",
    true: "bg-green-200 text-green-700",
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 pt-20 sm:p-6 lg:pt-6 lg:ml-64">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">
              Available Tasks
              <span className="block font-normal text-sm sm:text-base text-gray-600">
                Manage tasks that is currently available.
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-2">
               <button className="bg-green-900 text-white btn rounded-lg"
               onClick={() => {
                            modalRef.current?.open();
                          }}>
                   <IoIosAddCircle className="h-4 w-4 mr-2" />
                    Create Task
                </button>
            </div>
          </div>
          <div className="overflow-x-auto p-6 bg-white mt-6 rounded-md shadow-md">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs sm:text-sm">
                  <th>Category</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {TasksData.map((tasks) => (
                  <tr key={tasks.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="text-sm sm:text-base">
                          {tasks.category}
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{tasks.title}</td>
                       <td className="text-sm">{tasks.description}</td>
                          <td className="text-sm">{tasks.deadline}</td>
                    <td>
                      <div className="flex items-center gap-1">
                       <button className="bg-yellow-600 text-white btn rounded-lg"
                        onClick={() => {
                            setSelectedTask(tasks)
                            taskRef.current?.open();
                        }}>
                        <FaUsers className="h-4 w-4 mr-2" />
                            Assign To
                        </button>
                        <button className="bg-red-800 text-white btn rounded-lg"
                        onClick={() => deleteFunction("tasks", tasks.id)}>
                        <FaRegTrashCan className="h-4 w-4 mr-2" />
                            Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-500 mt-2 sm:hidden">
              Scroll horizontally to view full table →
            </div>
          </div>
        </main>
      </div>
      <TaskModal
        ref={modalRef}
        onClose={() => {}}
      />

        <AssignModal
        ref={taskRef}
        task={selectedTask}
        onClose={() => {}}
      />
    </>
  );
};

export default UnAssigned;

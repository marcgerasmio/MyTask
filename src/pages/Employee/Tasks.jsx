import { useState, useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../Supabase";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskModal from "../../components/TaskModal";
import Sidebar from "../../components/Sidebar"; 
import TaskRemarksModal from "../../components/RemarksModal";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaLink, FaUserEdit, FaSave, FaTimes } from "react-icons/fa";

const STATUS_TABS = [
  { label: "Ongoing", value: "ongoing" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

const TAB_COLORS = {
  ongoing: "bg-orange-400 text-white",
  pending: "bg-gradient-to-br from-yellow-300 to-yellow-500 text-white",
  completed: "bg-green-800 text-white",
  default: "bg-gray-200 text-gray-700"
};

const BORDER_COLORS = {
  ongoing: "border-orange-800",
  pending: "border-yellow-400",
  completed: "border-green-400",
  default: "border-gray-300"
};

const ItemTypes = {
  TASK: "task",
};

const BOARD_HEIGHT = "60vh";

async function updateTaskStatusInSupabase(taskId, newStatus) {
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').replace('Z', '');
  const { error } = await supabase
    .from("tasks")
    .update({ status: newStatus, updated_at: timestamp })
    .eq("id", taskId);

  if (error) {
    console.error("Failed to update task status:", error.message);
  }
}

function TaskCard({ task, index, onTaskClick, onReassignClick }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, index, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (!isDragging) {
      onTaskClick(task);
    }
  };

  const handleReassignClick = (e) => {
    e.stopPropagation();
    onReassignClick(task);
  };

  function formatDate(datetimeString) {
    const date = new Date(datetimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div
      ref={drag}
      onClick={handleCardClick}
      className={`transition-all duration-200 bg-white rounded-xl shadow-lg p-4 mb-4 border-l-4 ${BORDER_COLORS[task.status.toLowerCase()] || BORDER_COLORS.default} hover:scale-105 hover:shadow-2xl ${isDragging ? "opacity-50" : "opacity-100"}`}
      style={{ cursor: isDragging ? "grabbing" : "pointer" }}
    >
      <div className="flex justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded">
          TASK ID: {task.id}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${TAB_COLORS[task.status.toLowerCase()] || TAB_COLORS.default}`}>
          {task.category}
        </span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-lg text-gray-800">{task.title}</span>
        <button
          onClick={handleReassignClick}
          className="p-1.5 hover:bg-blue-100 rounded-full transition-colors"
          title="Reassign Task"
        >
          <FaUserEdit className="h-4 w-4 text-black" />
        </button>
      </div>
      <div className="text-gray-600 mb-2">{task.description}</div>
      <div className="flex items-center justify-between">
        <div className="flex">  
          {task.link === null || task.link === "" || task.link === 'N/A' ? ( <></>) : (
            <a 
              className="text-black" 
              href={task.link} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <FaLink className="h-4 w-4 mr-2"/>
            </a>
          )}
          <span className="text-xs text-black">
            {task.status === 'completed' ? 'Completed At' : 
            task.status === 'pending' ? 'Posted' : 
            task.status === 'ongoing' ? 'Started Working On' :
            'Updated At'}: {formatDate(task.status === 'pending' ? task.created_at : task.updated_at)}
          </span>
        </div>
        <span className="text-xs text-red-400">Deadline: {task.deadline}</span>
      </div>
    </div>
  );
}

function TaskColumn({ status, tasks, moveTask, onTaskClick, onReassignClick, children }) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => {
      if (item.status !== status) {
        moveTask(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[300px] mx-2 rounded-2xl shadow-xl transition-all duration-200 ${TAB_COLORS[status]} ${isOver && canDrop ? "ring-4 ring-white scale-105" : ""}`}
      style={{
        height: BOARD_HEIGHT,
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem 1rem",
        width: '20vw'
      }}
    >
      <div className="flex items-center mb-4">
        <span className="text-xl font-bold tracking-wide">{children}</span>
        <span className="ml-2 bg-white/30 px-2 py-1 rounded-full text-xs font-semibold">
          {tasks.length}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingRight: "0.25rem",
        }}
      >
        {tasks.length === 0 ? (
          <div className="text-white/70 text-center mt-8">No tasks</div>
        ) : (
          tasks.map((task, idx) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              index={idx} 
              onTaskClick={onTaskClick}
              onReassignClick={onReassignClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Reassign Modal Component
const ReassignModal = forwardRef(({ task, onReassign }, ref) => {
  const dialogRef = useRef(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      dialogRef.current?.showModal();
      fetchEmployees();
    },
    close: () => dialogRef.current?.close(),
  }));

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from("userDetails")
      .select("*");

    if (error) {
      console.error("Error fetching employees:", error);
    } else {
      setEmployees(data || []);
    }
  };

  const handleClose = () => {
    dialogRef.current?.close();
    setSelectedEmployee('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }

    setLoading(true);
    await onReassign(task?.id, parseInt(selectedEmployee));
    setLoading(false);
    setSelectedEmployee('');
    handleClose();
  };

  return (
    <dialog ref={dialogRef} className="modal backdrop-blur-xs">
      <div className="modal-box w-full max-w-2xl max-h-[90vh] p-0 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        <div className="bg-green-800 p-6 text-white flex-shrink-0">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 text-white hover:bg-white hover:bg-opacity-20"
            onClick={handleClose}
          >
            <FaTimes />
          </button>
          <h1 className="text-2xl font-bold">Reassign Task</h1>
          <div className="flex justify-between items-center mb-2">
            <p className="text-white mt-1">Selected Task: {task?.title}</p>
                 <span className={`px-2 py-1 rounded text-xs font-bold uppercase bg-white text-green-800`}>
          {task?.category}
        </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
               <p className="text-md text-black mt-1">{task?.description}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Select Employee
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="">Choose an employee...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name} - {emp.position}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-end sm:flex-row gap-2 pt-4 border-t mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:bg-green-400"
                disabled={loading}
              >
                <FaSave className="h-4 w-4" />
                {loading ? 'Reassigning...' : 'Reassign Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
});

const Tasks = () => {
  const [TasksData, setTasksData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [status, setSelectedStatus] = useState('');
  const [setId, setSelectedId] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [taskToReassign, setTaskToReassign] = useState(null);
  const modalRef = useRef();
  const remarksModalRef = useRef();
  const reassignModalRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));
  const employeeId = Number(user.id);
  const isAdmin = user.isAdmin;
  
  useEffect(() => {
    setCurrentUser(user);
  }, []);

  const fetchTasks = async (start, end) => {
    const { data: completedTasks } = await supabase
      .from("tasks")
      .select("*")
      .eq('status', 'completed')
      .gte('created_at', start)
      .lte('created_at', end);

    const { data: ongoingPendingTasks } = await supabase
      .from("tasks")
      .select("*")
      .in('status', ['ongoing', 'pending']);

    const allTasks = [...(completedTasks || []), ...(ongoingPendingTasks || [])];
    setTasksData(allTasks);
  };

  useEffect(() => {
    handleTask();
  }, []);

  useEffect(() => {
    const employeeTasks = TasksData.filter(
      (task) => task.user_id === employeeId && task.status !== "tba"
    );
    setTasks(employeeTasks);
  }, [TasksData, employeeId]);

  const moveTask = useCallback(async (taskId, newStatus) => {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').replace('Z', '');
    
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus, updated_at: timestamp } : task
      )
    );
    
    await updateTaskStatusInSupabase(taskId, newStatus);
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    remarksModalRef.current?.open();
  };

  const handleReassignClick = (task) => {
    setTaskToReassign(task);
    reassignModalRef.current?.open();
  };

  const handleReassign = async (taskId, newUserId) => {
    try {
      const now = new Date();
      const timestamp = now.toISOString().replace('T', ' ').replace('Z', '');
      
      const { error } = await supabase
        .from("tasks")
        .update({ 
          user_id: newUserId,
          updated_at: timestamp 
        })
        .eq("id", taskId);

      if (error) {
        console.error("Failed to reassign task:", error.message);
        alert("Failed to reassign task");
      } else {
        const { monthNumber, year } = getCurrentMonthAndYear();
        GetFirstAndLastDate(year, monthNumber);
      }
    } catch (error) {
      console.error("Error reassigning task:", error);
      alert("An error occurred while reassigning the task");
    }
  };

  function GetFirstAndLastDate(year, month) {
    const firstDayOfMonth = new Date(year, month-1, 2);
    const lastDayOfMonth = new Date(year, month, 1);
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

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-green-100">
      <Sidebar />
      <main className="flex-1 p-4 pt-20 sm:p-8 lg:pt-8 lg:ml-64">
        <div className="bg-white/90 p-6 rounded-xl shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-center">
            <div className="flex items-center gap-4">
              <img src={user.image} alt="Avatar" className="rounded-full h-20 w-20 border-4 shadow" />
              <div>
                <div className="font-bold text-2xl text-gray-800">{user.first_name} {user.last_name}</div>
                <div className="text-sm text-green-900">{user.position}</div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <select defaultValue="Month" className="select" onChange={(e) => setMonth(e.target.value)} value={month}>
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
              <select defaultValue="Year" className="select w-25" onChange={(e) => setYear(e.target.value)} value={year}>
                <option disabled={true}>Year</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
              <button className="bg-green-900 text-white btn rounded-lg" onClick={() => GetFirstAndLastDate(year, month)}>Display</button>
              {!isAdmin && (
                <button 
                  className="bg-white-900 text-green-900 btn rounded-lg"
                  onClick={() => {
                    modalRef.current?.open();
                    setSelectedStatus("tba")
                    setSelectedId(user.id)
                  }}
                >
                  <IoMdAddCircleOutline className="h-4 w-4 mr-2"/>
                  Create Task
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="p-2">
          <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col md:flex-row gap-6">
              {STATUS_TABS.map((tab) => (
                <TaskColumn
                  key={tab.value}
                  status={tab.value}
                  tasks={tasks.filter((task) => task.status.toLowerCase() === tab.value)}
                  moveTask={moveTask}
                  onTaskClick={handleTaskClick}
                  onReassignClick={handleReassignClick}
                >
                  {tab.label}
                </TaskColumn>
              ))}
            </div>
          </DndProvider>
        </div>
      </main>
      
      <TaskModal
        ref={modalRef}
        status={status}
        setId={setId}
        onClose={() => {}}
      />

      <TaskRemarksModal
        ref={remarksModalRef}
        task={selectedTask}
        currentUser={currentUser}
      />

      <ReassignModal
        ref={reassignModalRef}
        task={taskToReassign}
        onReassign={handleReassign}
      />
    </div>
  );
};

export default Tasks;
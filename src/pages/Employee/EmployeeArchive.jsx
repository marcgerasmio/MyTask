import Sidebar from "../../components/Sidebar";
import UserModal from "../../components/UserModal";
import { useState, useRef, useEffect } from "react";
import Supabase from "../../Supabase";
import { FaUsers } from "react-icons/fa";


const EmployeeArchive = () => {
const user = JSON.parse(localStorage.getItem("user"));
  const modalRef = useRef();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [taskData, setTaskData] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [filter, setFilter] = useState('tba');

   const fetchData = async (start, end) => {
    const { data } = await Supabase.from("tasks").select(`
            "*",
            userDetails!id ("*")
          `)
            .gte('created_at', start)
    .lte('created_at', end)
    .eq('status', filter)
    .eq('user_id', user.id)

   setTaskData(data || []);
  }

   useEffect(() => {
      handleTask();
    }, []);


    function GetFirstAndLastDate(year, month)
{
const firstDayOfMonth = new Date(year, month-1, 2);
const lastDayOfMonth = new Date(year, month, 1);
console.log('First Day: ' + firstDayOfMonth.toISOString());
console.log('Last Day: ' + lastDayOfMonth.toISOString());
const start = firstDayOfMonth.toISOString();
const end = lastDayOfMonth.toISOString();
fetchData(start, end);
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

function handleTask(){
 const { monthNumber, year } = getCurrentMonthAndYear();
 setMonth(monthNumber);
 setYear(year);
 GetFirstAndLastDate(year, monthNumber);
}

   const adminStyle = {
    pending: "bg-yellow-500 text-white",
    ongoing: "bg-orange-400 text-white",
    completed: "bg-green-800 text-white",
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 pt-20 sm:p-6 lg:pt-6 lg:ml-64">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">
             Tasks Archive
              <span className="block font-normal text-sm sm:text-base text-gray-600">
                Review all tasks that have been assigned to you.
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-2">
                   <div className="flex gap-2 mt-4 sm:mt-0">
                <select defaultValue={filter} className="select" onChange={(e) => setFilter(e.target.value)} value={filter}>
                <option disabled={true}>Status</option>
                <option value="completed">Completed</option>
                   <option value="tba">For Approval</option>
                      <option value="pending">Pending</option>
                         <option value="ongoing">OnGoing</option>
                         <option value="declined">Declined</option>
              </select>
              <select defaultValue="Month" className="select" onChange={(e) => setMonth(e.target.value)} value={month}>
                <option disabled={true}>Month</option>
                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
                <option value={7}>July</option>
                <option value={8} >August</option>
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
              <button className="bg-green-900 text-white btn rounded-lg"  onClick={() => GetFirstAndLastDate(year, month)}>Display</button>
            </div>
            </div>
          </div>
            {taskData.length === 0 ? (
                                  <div className="text-center py-12 bg-white mt-6 rounded-md shadow-md">
                                    <div className="flex justify-center mb-4">
                                      <FaUsers className="h-16 w-16 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                      No availabe task for this filter.
                                    </h3>
                                  </div>
                                ) : (
          <div className="overflow-x-auto p-6 bg-white mt-6 rounded-md shadow-md overflow-y-auto h-[80vh]">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs sm:text-sm">
                  <th>Task Title</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {taskData.map((task) => (
                  <tr key={task.id}>
                    <td className="text-sm">{task.title}</td>
                     <td className="text-sm">{task.description}</td>
                       <td>
                      <span
                        className={`btn border-none cursor-auto ${
                          adminStyle[task.status]
                        } btn-xs`}
                      >
                        {task.status.toString().toUpperCase()}
                      </span>
                    </td>
                    <td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-500 mt-2 sm:hidden">
              Scroll horizontally to view full table →
            </div>
          </div>)}
        </main>
      </div>
      <UserModal
        ref={modalRef}
        patient={selectedPatient}
        onClose={() => {}}
      />
    </>
  );
};

export default EmployeeArchive;

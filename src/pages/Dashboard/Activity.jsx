import { useState, useEffect } from "react";
import Supabase from "../../Supabase";

const Activity = () => {
  const [TaskData, setTasks] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [filter, setFilter] = useState('completed');
 
  const fetchTask = async (start, end) => {
    const { data } = await Supabase.from("tasks").select(`
            "*",
            userDetails!id ("*")
          `)
            .gte('created_at', start)
    .lte('created_at', end)
    .eq('status', filter)
    .order('created_at', { ascending: false });

   setTasks(data || []);
  }

  function GetFirstAndLastDate(year, month) {
    const firstDayOfMonth = new Date(year, month - 1, 2);
    const lastDayOfMonth = new Date(year, month, 1);
    const start = firstDayOfMonth.toISOString();
    const end = lastDayOfMonth.toISOString();
    fetchTask(start, end);
  }

  function getCurrentMonthAndYear() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return {
      monthNumber: month,
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
    handleTask();
  }, []);


  return (
    <div className="bg-white p-4 sm:p-6 mt-8 rounded-lg shadow-md">
      <div className="mb-6 sm:mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-base-content mb-1">
         Tasks List
        </h1>
      </div>


      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <select 
          className="select select-bordered select-sm" 
          onChange={(e) => setFilter(e.target.value)} 
          value={filter}
        >
          <option disabled>Status</option>
          <option value="completed">Completed</option>
          <option value="tba">For Approval</option>
          <option value="pending">Pending</option>
          <option value="ongoing">OnGoing</option>
        </select>
        
        <select 
          className="select select-bordered select-sm" 
          onChange={(e) => setMonth(e.target.value)} 
          value={month}
        >
          <option disabled>Month</option>
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
          className="select select-bordered select-sm" 
          onChange={(e) => setYear(e.target.value)} 
          value={year}
        >
          <option disabled>Year</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
        
        <button 
          className="btn btn-sm bg-green-900 text-white hover:bg-green-800"
          onClick={() => GetFirstAndLastDate(year, month)}
        >
          Display
        </button>
      </div>

      <div className="space-y-4 h-[42vh] overflow-y-auto">
        {TaskData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base-content/70 text-sm sm:text-base">
              No tasks found for the selected filters
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
                    <img
                      className="w-12 h-12 rounded-full object-cover"
                      src={task.userDetails.image}
                      alt="user"
                    />
                    <div>
                      <h3 className="font-semibold text-base-content text-sm sm:text-base">
                        {task.title}
                      </h3>
                      <p className="text-xs text-base-content/90">
                        Assigned To: {task.userDetails.first_name} {task.userDetails.last_name}
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
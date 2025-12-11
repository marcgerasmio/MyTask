import Supabase from "../../Supabase";
import { useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoWarningOutline } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdFileDownloadDone } from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";
import { IoFileTrayFull } from "react-icons/io5";


const DashCard = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

      const { data, error } = await Supabase.from('tasks').select()

      setTasks(data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load employee data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const cards = [
  {
    id: 1,
    title: "Total Tasks",
    icon: IoFileTrayFull,
    count: tasks.length,
    color: "card shadow-md rounded-lg hover:shadow-lg transition hover:scale-[1.02] bg-gray-500 text-white",
  },
   {
    id: 2,
    title: "Ongoing Tasks",
    icon: MdOutlinePendingActions,
    count: tasks.filter(task => task.status === 'ongoing').length,
    color: "card shadow-md rounded-lg hover:shadow-lg transition hover:scale-[1.02] bg-orange-400 text-white",
  },
  {
    id: 3,
    title: "Pending Tasks",
    icon: IoWarningOutline,
    count: tasks.filter(task => task.status === 'pending').length,
    color: "card shadow-md rounded-lg hover:shadow-lg transition hover:scale-[1.02] bg-yellow-500 text-white",
  },
 
  {
    id: 4,
    title: "Total Completed",
    icon: MdFileDownloadDone,
    count: tasks.filter(task => task.status === 'completed').length,
    color: "card shadow-md rounded-lg hover:shadow-lg transition hover:scale-[1.02] bg-green-800 text-white",
  },
];

  return (
   <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 tracking-widest">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.id} 
            className={`p-6 rounded-lg shadow-md hover:shadow-lg transition hover:scale-[1.02] ${card.color} text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{card.title}</p>
                <p className="text-3xl font-bold">{card.count}</p>
              </div>
              {Icon && <Icon className="text-4xl" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashCard;

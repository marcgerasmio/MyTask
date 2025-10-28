import Supabase from "../../Supabase";
import { useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoWarningOutline } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";



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
    icon: LuUsers,
    count: tasks.length,
    color: "card shadow-md rounded-lg hover:shadow-lg transition hover:scale-[1.02] bg-gray-500 text-white",
  },
   {
    id: 2,
    title: "Ongoing Tasks",
    icon: IoCalendarClearOutline,
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
    icon: FaArrowTrendUp,
    count: tasks.filter(task => task.status === 'completed').length,
    color: "card shadow-md rounded-lg hover:shadow-lg transition hover:scale-[1.02] bg-green-800 text-white",
  },
];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 tracking-widest">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className={card.color}>
            <div className="card-body">
              <h2 className="font-semibold flex justify-between tracking-normal">
                {card.title}
                {Icon && (
                  <Icon
                    size={17}
                   className={card.color}
                  />
                )}
              </h2>
              <p
                className={`text-2xl font-extrabold text-white ${
                  card.title === "High Risk Cases"
                    ? "text-red-500"
                    : card.title === "Success Rate"
                    ? "text-green-600"
                    : "text-black"
                }`}
              >
                {card.count}
                <span className="block font-normal text-xs text-gray-600 tracking-normal">
                  {card.detail}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashCard;

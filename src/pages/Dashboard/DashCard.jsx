import { LuUsers } from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";
import { IoCalendarClearOutline } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";

const DashCard = () => {
  const Cards = [
    {
      id: 1,
      title: "Total Patients",
      icon: LuUsers,
      count: 58,
      detail: "+2 from last week",
    },
    {
      id: 2,
      title: "High Risk Cases",
      icon: IoWarningOutline,
      count: 12,
      detail: "Require immediate attention",
    },
    {
      id: 3,
      title: "This Week",
      icon: IoCalendarClearOutline,
      count: 23,
      detail: "Analysis completed",
    },
    {
      id: 4,
      title: "Success Rate",
      icon: FaArrowTrendUp,
      count: "94.2%",
      detail: "Accurate predictions",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 tracking-widest">
      {Cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className="card shadow-md bg-white rounded-lg">
            <div className="card-body">
              <h2 className="font-semibold flex justify-between tracking-normal">
                {card.title}
                {Icon && (
                  <Icon
                    size={17}
                    className={
                      card.title === "High Risk Cases"
                        ? "text-red-500"
                        : card.title === "Success Rate"
                        ? "text-green-600"
                        : "text-gray-600"
                    }
                  />
                )}
              </h2>
              <p
                className={`text-2xl font-extrabold ${
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

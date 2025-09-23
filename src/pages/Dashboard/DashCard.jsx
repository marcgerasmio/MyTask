import { cards } from "../../lib/data";

const DashCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 tracking-widest">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className="card shadow-md bg-white rounded-lg hover:shadow-lg transition hover:scale-[1.02]">
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

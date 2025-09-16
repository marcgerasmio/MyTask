import ResultModal from "../Patient/ResultModal";
import { useRef, useState } from "react";
import { tasksDone } from "../../lib/data";

const Activity = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const modalRef = useRef(null);

  const riskLevelStyles = {
    High: "bg-red-200 text-red-600",
    Moderate: "bg-yellow-200 text-yellow-700",
    Low: "bg-green-300 text-green-700",
  };

  return (
    <div className="bg-white p-4 sm:p-6 mt-8 rounded-lg shadow-md">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-base-content mb-1">
          Recent Tasks
        </h1>
        <p className="text-sm text-base-content/70">
          Latest Employees Activities
        </p>
      </div>
      <div className="space-y-4">
        {tasksDone
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 4)
          .map((task) => (
            <div
              key={task.id}
              className="card border border-base-300 rounded-md"
            >
              <div className="card-body p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      className="w-12 h-12 rounded-full object-cover"
                      src={task.image}
                      alt="user"
                    />
                    <div>
                      <h3 className="font-semibold text-base-content text-sm sm:text-base">
                        {task.name}
                      </h3>
                      <p className="text-sm text-base-content/60">
                        Task: {task.task} &nbsp; • &nbsp;
                        {task.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <span
                      className={`btn border-none cursor-auto ${
                        riskLevelStyles[task.level]
                      } btn-sm`}
                    >
                      {task.level}
                    </span>
                    <button
                      className="btn btn-sm border-none"
                      onClick={() => {
                        setSelectedPatient(patient);
                        modalRef.current?.open();
                      }}
                    >
                      View Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <ResultModal
        ref={modalRef}
        patient={selectedPatient}
        onClose={() => {}}
      />
    </div>
  );
};

export default Activity;

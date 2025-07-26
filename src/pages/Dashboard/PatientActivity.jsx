import ResultModal from "../Patient/ResultModal";
import { useRef, useState } from "react";

const PatientActivity = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const modalRef = useRef(null);

  const patient = [
    {
      id: 1,
      image: "https://img.daisyui.com/images/profile/demo/3@94.webp",
      patient: "Marc Dominic Gerasmio Jr.",
      age: 25,
      lastCheckup: "May 8, 2025",
      riskLevel: "High",
    },
    {
      id: 2,
      image: "https://img.daisyui.com/images/profile/demo/2@94.webp",
      patient: "Marion Jotohot",
      age: 24,
      lastCheckup: "May 10, 2025",
      riskLevel: "Moderate",
    },
    {
      id: 3,
      image: "https://img.daisyui.com/images/profile/demo/4@94.webp",
      patient: "John Elro Karl Estoque",
      age: 23,
      lastCheckup: "May 12, 2025",
      riskLevel: "Low",
    },
  ];

  const riskLevelStyles = {
    High: "bg-red-200 text-red-600",
    Moderate: "bg-yellow-200 text-yellow-700",
    Low: "bg-green-300 text-green-700",
  };

  return (
    <div className="bg-white p-6 mt-8 rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-base-content mb-2">
          Recent Activity
        </h1>
        <p className="text-base-content/70 text-sm">
          Latest patient analyses and results
        </p>
      </div>
      <div className="space-y-4">
        {patient.map((patient) => (
          <div
            key={patient.id}
            className="card border border-base-300 rounded-md"
          >
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    src={patient.image}
                    alt="user"
                  />
                  <div>
                    <h3 className="font-bold text-base-content mb-1">
                      {patient.patient}
                    </h3>
                    <p className="text-base-content/60 text-sm">
                      Age: {patient.age} • {patient.lastCheckup}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`btn border-none cursor-auto ${
                      riskLevelStyles[patient.riskLevel]
                    } btn-sm`}
                  >
                    {patient.riskLevel}
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

export default PatientActivity;

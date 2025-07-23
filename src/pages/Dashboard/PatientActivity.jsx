const PatientActivity = () => {
  const patients = [
    {
      id: 1,
      name: "Marc Dominic Gerasmio",
      age: 23,
      date: "May 10, 2025",
      riskLevel: "High Risk",
      riskColor: "bg-red-500",
    },
    {
      id: 2,
      name: "Marion Jotohot",
      age: 24,
      date: "May 12, 2025",
      riskLevel: "Low Risk",
      riskColor: "btn-success",
    },
    {
      id: 3,
      name: "John Elro Karl Estoque",
      age: 24,
      date: "May 13, 2025",
      riskLevel: "Moderate",
      riskColor: "btn-warning",
    },
  ];

  const getRiskBadgeClass = (riskColor) => {
    return `btn ${riskColor} btn-sm text-white`;
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
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="card border border-base-300 rounded-md"
          >
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="user"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-base-content mb-1">
                      {patient.name}
                    </h3>
                    <p className="text-base-content/60 text-sm">
                      Age: {patient.age} • {patient.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={getRiskBadgeClass(patient.riskColor)}>
                    {patient.riskLevel}
                  </span>
                  <button className="btn btn-sm">View Report</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientActivity;

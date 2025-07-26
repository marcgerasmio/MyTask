import Sidebar from "../../components/Sidebar";
import { CiSearch } from "react-icons/ci";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import ResultModal from "./ResultModal";
import { useState, useRef } from "react";

const PatientList = () => {
  const modalRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const patient = [
    {
      id: 1,
      image: "https://img.daisyui.com/images/profile/demo/2@94.webp",
      patient: "Marc Dominic Gerasmio Jr.",
      age: "25",
      riskLevel: "High",
      lastCheckup: "May 8, 2025",
    },
    {
      id: 2,
      image: "https://img.daisyui.com/images/profile/demo/3@94.webp",
      patient: "Marion Jotohot",
      age: "24",
      riskLevel: "Moderate",
      lastCheckup: "May 10, 2025",
    },
    {
      id: 3,
      image: "https://img.daisyui.com/images/profile/demo/4@94.webp",
      patient: "John Elro Karl Estoque",
      age: "23",
      riskLevel: "Low",
      lastCheckup: "May 12, 2025",
    },
    {
      id: 4,
      image: "https://img.daisyui.com/images/profile/demo/4@94.webp",
      patient: "Krizia Marie Dapal",
      age: "22",
      riskLevel: "Low",
      lastCheckup: "May 11, 2025",
    },
    {
      id: 5,
      image: "https://img.daisyui.com/images/profile/demo/2@94.webp",
      patient: "Joralyn Cantero",
      age: "21",
      riskLevel: "High",
      lastCheckup: "May 10, 2025",
    },
    {
      id: 6,
      image: "https://img.daisyui.com/images/profile/demo/2@94.webp",
      patient: "Vevencio Gupana Jr.",
      age: "25",
      riskLevel: "Moderate",
      lastCheckup: "May 9, 2025",
    },
  ];

  const filteredPatients = patient.filter((p) => {
    const search = searchTerm.toLowerCase();
    const matchesNameOrAge =
      p.patient.toLowerCase().includes(search) ||
      p.age.toString().includes(search);
    const matchesRisk = riskFilter === "" || p.riskLevel === riskFilter;
    return matchesNameOrAge && matchesRisk;
  });

  const riskLevelStyles = {
    High: "bg-red-100 text-red-600",
    Moderate: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-200 text-green-700",
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <h1 className="text-3xl font-extrabold">
              Patient Management
              <span className="block font-normal text-lg text-gray-600">
                Manage your patient records and analysis.
              </span>
            </h1>
            <div className="flex gap-2">
              <select
                className="select rounded-md bg-white mt-2"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Moderate">Moderate</option>
                <option value="Low">Low Risk</option>
              </select>
              <label className="input rounded-md mt-2 bg-white">
                <CiSearch className="opacity-50" />
                <input
                  type="search"
                  className="w-50"
                  required
                  placeholder="Search by name or age"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="overflow-x-auto p-5 bg-white mt-7 rounded-md shadow-md">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Risk Level</th>
                  <th>Last Checkup</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="rounded-full h-10 w-10">
                            <img src={patient.image} alt="Avatar" />
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">{patient.patient}</div>
                        </div>
                      </div>
                    </td>
                    <td>{patient.age}</td>
                    <td>
                      <button
                        className={`btn border-none cursor-auto ${
                          riskLevelStyles[patient.riskLevel]
                        } btn-xs`}
                      >
                        {patient.riskLevel}
                      </button>
                    </td>
                    <td>{patient.lastCheckup}</td>
                    <th>
                      <button
                        className="btn btn-ghost hover:bg-white border-none shadow-none btn-xs"
                        onClick={() => {
                          setSelectedPatient(patient);
                          modalRef.current?.open();
                        }}
                      >
                        <IoEyeOutline size={19} />
                      </button>
                      <button className="btn btn-ghost hover:bg-white border-none shadow-none btn-xs">
                        <FaRegEdit size={16} />
                      </button>
                      <button className="btn btn-ghost btn-xs hover:bg-white border-none shadow-none text-red-500">
                        <FaRegTrashCan size={14} />
                      </button>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <ResultModal
        ref={modalRef}
        patient={selectedPatient}
        onClose={() => {}}
      />
    </>
  );
};

export default PatientList;

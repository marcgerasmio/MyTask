import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
import DashCard from "./DashCard";
import PatientActivity from "./PatientActivity";

const Dashboard = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-3 pt-20 lg:p-6 lg:pt-6 lg:ml-64">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold">
              Welcome back, Dr. Juan!
              <span className="block font-normal text-sm sm:text-base text-gray-600">
                Here's what's happening with your patients today.
              </span>
            </h1>
            <div className="flex justify-around sm:justify-start gap-2 mt-1">
              <Link to="/add">
                <button className="btn-neutral btn rounded-lg">
                  + Add Patient
                </button>
              </Link>
              <Link to="/patients">
                <button className="btn bg-white rounded-lg border-none shadow-md">
                  View All Patients
                </button>
              </Link>
            </div>
          </div>
          <DashCard />
          <PatientActivity />
        </main>
      </div>
    </>
  );
};

export default Dashboard;

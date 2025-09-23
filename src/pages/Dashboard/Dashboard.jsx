import Sidebar from "../../components/Sidebar";
import DashCard from "./DashCard";
import Activity from "./Activity"
import MyCalendar from "../../components/Calendar";

const Dashboard = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-3 pt-20 lg:p-6 lg:pt-6 lg:ml-64">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold">
              Welcome back!
              <span className="block font-normal text-sm sm:text-base text-gray-600">
                Here's what's happening today.
              </span>
            </h1>
          </div>
        <DashCard />
        <div className="grid grid-cols-2 gap-4">
        <Activity />
        <MyCalendar />
          </div>
      
        </main>
      </div>
    </>
  );
};

export default Dashboard;

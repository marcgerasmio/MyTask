import Sidebar from "../../components/Sidebar";
import { IoIosAddCircle } from "react-icons/io";
import ActivityModal from "../../components/ActivityModal";
import { useState, useRef, useEffect } from "react";
import MyCalendar from "../../components/Calendar";
import supabase from "../../Supabase";

const ActivityList = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [showButton, setShowButton] = useState(true);
  const modalRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [UserData, setUsers] = useState([]);
  const fetchUsers = async () => {
    const { data } = await supabase.from("userDetails").select("*");
    setUsers(data);
  };

   useEffect(() => {
      fetchUsers();
    }, []);


  const filteredPatients = UserData.filter((p) => {
    const search = searchTerm.toLowerCase();
    const matchesNameOrAge =
      p.first_name.toLowerCase().includes(search) || 
      p.last_name.toLowerCase().includes(search);
    const matchesRisk = riskFilter === "" || p.riskLevel === riskFilter;
    return matchesNameOrAge && matchesRisk;
  });

  const adminStyle = {
    false: "bg-yellow-100 text-yellow-700",
    true: "bg-green-200 text-green-700",
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <Sidebar />
    <main className="flex-1 p-4 pt-20 sm:p-6 lg:pt-6 lg:ml-64 min-w-0 overflow-x-hidden">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">
           Activities List
              <span className="block font-normal text-sm sm:text-base text-gray-600">
                Manage activities within CSU.
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="bg-green-900 text-white btn rounded-lg"
               onClick={() => {
                            modalRef.current?.open();
                          }}>
                   <IoIosAddCircle className="h-4 w-4 mr-2" />
                    Add Activity
                </button>
           
            </div>
          </div>
         <MyCalendar />
        </main>
      </div>
      <ActivityModal
        ref={modalRef}
        patient={selectedPatient}
        onClose={() => {}}
      />
    </>
  );
};

export default ActivityList;

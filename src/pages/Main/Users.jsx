import Sidebar from "../../components/Sidebar";
import { CiSearch } from "react-icons/ci";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import UserModal from "../../components/UserModal";
import { useState, useRef, useEffect } from "react";
import { deleteFunction } from "../../lib/functions";
import Supabase from "../../Supabase";



const Users = () => {
  const modalRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [UserData, setUserData] = useState([]);

    const fetchUsers = async () => {
    const { data } = await Supabase.from("userDetails").select("*");
    setUserData(data);
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
        <main className="flex-1 p-4 pt-20 sm:p-6 lg:pt-6 lg:ml-64">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">
              Users Management
              <span className="block font-normal text-sm sm:text-base text-gray-600">
                Manage your employee records.
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="input rounded-md bg-white flex items-center gap-2">
                <CiSearch className="opacity-50" />
                <input
                  type="search"
                  className="w-full"
                  required
                  placeholder="Search name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
               <button className="bg-green-900 text-white btn rounded-lg"
               onClick={() => {
                            modalRef.current?.open();
                          }}>
                   <IoIosAddCircle className="h-4 w-4 mr-2" />
                    Add User
                </button>
            </div>
          </div>
          <div className="overflow-x-auto p-6 bg-white mt-6 rounded-md shadow-md">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs sm:text-sm">
                  <th>Name</th>
                  <th>Position</th>
                  <th>Admin Access</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((UserData) => (
                  <tr key={UserData.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                            <img src={UserData.image} alt="No Image" />
                          </div>
                        </div>
                        <div className="text-sm sm:text-base">
                          {UserData.first_name} {UserData.last_name}
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{UserData.position}</td>
                    <td>
                      <span
                        className={`btn border-none cursor-auto ${
                          adminStyle[UserData.isAdmin]
                        } btn-xs`}
                      >
                        {UserData.isAdmin.toString().toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-500 mt-2 sm:hidden">
              Scroll horizontally to view full table →
            </div>
          </div>
        </main>
      </div>
      <UserModal
        ref={modalRef}
        patient={selectedPatient}
        onClose={() => {}}
      />
    </>
  );
};

export default Users;

import Sidebar from "../../components/Sidebar";
import UserModal from "../../components/UserModal";
import { useState, useRef, useEffect } from "react";
import Supabase from "../../Supabase";
import { FaUsers } from "react-icons/fa";


const ForApproval = () => {
  const modalRef = useRef();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [TaskData, setTaskData] = useState([]);

     const fetchData = async () => {
    const { data } = await Supabase.from("tasks").select(`
            "*",
            userDetails!id ("*")
          `)
          .eq('status', 'tba');
   setTaskData(data || []);
  }

   useEffect(() => {
    fetchData();
    }, []);

const updateTask = async (status, task_id,) => {
const { error } = await Supabase
 .from("tasks")
  .update({ status: status })
  .eq('id', task_id)
  .select()
window.location.reload();
};


   const adminStyle = {
    pending: "bg-yellow-500 text-white",
    ongoing: "bg-orange-400 text-white",
    completed: "bg-green-800 text-white",
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 pt-20 sm:p-6 lg:pt-6 lg:ml-64">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">
             For Approval
              <span className="block font-normal text-sm sm:text-base text-gray-600">
                Tasks created by employees pending approval.
              </span>
            </h1>
          </div>
                {TaskData.length === 0 ? (
                        <div className="text-center py-12 bg-white mt-6 rounded-md shadow-md">
                          <div className="flex justify-center mb-4">
                            <FaUsers className="h-16 w-16 text-gray-300" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            No Pending for Approval Tasks.
                          </h3>
                        </div>
                      ) : (
          <div className="overflow-x-auto p-6 bg-white mt-6 rounded-md shadow-md overflow-y-auto h-[80vh]">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs sm:text-sm">
                <th>Request By</th>
                  <th>Task Title</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {TaskData.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                            <img src={task.userDetails.image} alt="No Image" />
                          </div>
                        </div>
                        <div className="text-sm sm:text-base">
                          {task.userDetails.first_name}
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{task.title}</td>
                     <td className="text-sm">{task.description}</td>
                       <td>
                      <button className="bg-red-600 text-white btn rounded-lg btn-m"
                      onClick={() => updateTask('declined', task.id)}>
                      Decline
                    </button>
                      <button className="bg-green-900 text-white btn rounded-lg btn-m"
                       onClick={() => updateTask('pending', task.id)}>
                      Approve
                    </button>
                    </td>
                    <td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-500 mt-2 sm:hidden">
              Scroll horizontally to view full table →
            </div>
          </div>
                      )}
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

export default ForApproval;

import Sidebar from "../../components/Sidebar";
import MemoModal from "../../components/MemoModal";
import { useState, useRef, useEffect } from "react";
import Supabase from "../../Supabase";
import { IoIosAddCircle } from "react-icons/io";
import { CiMemoPad } from "react-icons/ci";


const MemoTracker = () => {
  const modalRef = useRef();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [memoData, setMemoData] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [filter, setFilter] = useState('completed');

   const fetchData = async (start, end) => {
    const { data } = await Supabase.from("memo").select("*");

   setMemoData(data || []);
  }

   useEffect(() => {
      fetchData();
    }, []);

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
             Memo Tracker
              <span className="block font-normal text-sm sm:text-base text-gray-600">
              </span>
            </h1>
                 <button
                            className="bg-green-900 text-white btn rounded-lg"
                            onClick={() => {
                              modalRef.current?.open();
                            }}
                          >
                            <IoIosAddCircle className="h-4 w-4 mr-2" />
                           Add Memo
                          </button>
          </div>
            {memoData.length === 0 ? (
                                  <div className="text-center py-12 bg-white mt-6 rounded-md shadow-md">
                                    <div className="flex justify-center mb-4">
                                      <CiMemoPad className="h-16 w-16 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                 No memos found.
                                    </h3>
                                  </div>
                                ) : (
          <div className="overflow-x-auto p-6 bg-white mt-6 rounded-md shadow-md overflow-y-auto h-[80vh]">
            <table className="table table-sm">
              <thead>
                <tr className="text-x1 text-black sm:text-sm">
                <th>Memo Number</th>
                  <th>Title/Content</th>
                  <th>Date Created</th>
                </tr>
              </thead>
              <tbody>
                {memoData.map((memo) => (
                  <tr key={memo.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="text-sm sm:text-base">
                          {memo.id}
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{memo.title}</td>
                     <td className="text-sm">{memo.date}</td>
                    <td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-500 mt-2 sm:hidden">
              Scroll horizontally to view full table →
            </div>
          </div>)}
        </main>
      </div>
      <MemoModal
        ref={modalRef}
        onClose={() => {}}
      />
    </>
  );
};

export default MemoTracker;

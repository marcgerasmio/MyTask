import Sidebar from "../../components/Sidebar";
import MemoModal from "../../components/MemoModal";
import { useState, useRef, useEffect } from "react";
import Supabase from "../../Supabase";
import { IoIosAddCircle } from "react-icons/io";
import { CiMemoPad } from "react-icons/ci";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";

const MemoTracker = () => {
  const modalRef = useRef();
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [memoData, setMemoData] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [filter, setFilter] = useState('completed');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memoToDelete, setMemoToDelete] = useState(null);

  const fetchData = async (start, end) => {
    const { data } = await Supabase
      .from("memo")
      .select("*")
      .gte('created_at', start)
      .lte('created_at', end)
      .order('memo_id', { ascending: true });
    setMemoData(data || []);
  }

  useEffect(() => {
    handleTask();
  }, []);

  function handleTask() {
    const { year } = getCurrentMonthAndYear();
    setYear(year);
    GetFirstAndLastDate(year);
  }

  const handleEdit = (memo) => {
    setSelectedMemo(memo);
    modalRef.current?.open();
  }

  const handleDeleteClick = (memo) => {
    setMemoToDelete(memo);
    setShowDeleteModal(true);
  }

  const handleDeleteConfirm = async () => {
    if (!memoToDelete) return;

    try {
      const { error } = await Supabase
        .from("memo")
        .delete()
        .eq('id', memoToDelete.id);

      if (error) throw error;

      GetFirstAndLastDate(year);
      setShowDeleteModal(false);
      setMemoToDelete(null);
    } catch (error) {
      console.error("Error deleting memo:", error);
      alert("Failed to delete memo. Please try again.");
    }
  }

  const handleModalClose = () => {
    setSelectedMemo(null);
    GetFirstAndLastDate(year);
  }

  const adminStyle = {
    pending: "bg-yellow-500 text-white",
    ongoing: "bg-orange-400 text-white",
    completed: "bg-green-800 text-white",
  };

  function getCurrentMonthAndYear() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[currentDate.getMonth()];

    return {
      monthNumber: month,
      monthName: monthName,
      year: year
    };
  }

  function GetFirstAndLastDate(year) {
    // First day of the year at 00:00:00
    const firstDayOfYear = new Date(year, 0, 1, 0, 0, 0);
    // Last day of the year at 23:59:59
    const lastDayOfYear = new Date(year, 11, 31, 23, 59, 59);
    
    console.log('First Day: ' + firstDayOfYear.toISOString());
    console.log('Last Day: ' + lastDayOfYear.toISOString());
    
    const start = firstDayOfYear.toISOString();
    const end = lastDayOfYear.toISOString();
    fetchData(start, end);
  }

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
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex gap-2 mt-4 sm:mt-0">
                <select 
                  className="select w-25" 
                  onChange={(e) => setYear(parseInt(e.target.value))} 
                  value={year}
                >
                  <option disabled value="">Year</option>
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                </select>
                <button 
                  className="bg-green-900 text-white btn rounded-lg" 
                  onClick={() => GetFirstAndLastDate(year)}
                >
                  Display
                </button>
                <button
                  className="bg-green-900 text-white btn rounded-lg"
                  onClick={() => {
                    setSelectedMemo(null);
                    modalRef.current?.open();
                  }}
                >
                  <IoIosAddCircle className="h-4 w-4 mr-2" />
                  Add Memo
                </button>
              </div>
            </div>

          </div>

          {memoData.length === 0 ? (
            <div className="text-center py-12 bg-white mt-6 rounded-md shadow-md">
              <div className="flex justify-center mb-4">
                <CiMemoPad className="h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No memos found for the selected period.
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {memoData.map((memo) => (
                    <tr key={memo.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="text-sm sm:text-base">
                            {memo.memo_id}
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">{memo.title}</td>
                      <td className="text-sm">{memo.date}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(memo)}
                            className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50"
                            title="Edit memo"
                          >
                            <FaRegEdit className="text-black h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(memo)}
                            className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50"
                            title="Delete memo"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
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

      <MemoModal
        ref={modalRef}
        memo={selectedMemo}
        onClose={handleModalClose}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete memo #{memoToDelete?.id} - "{memoToDelete?.title}"?
              This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowDeleteModal(false);
                  setMemoToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemoTracker;
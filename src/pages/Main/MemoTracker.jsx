import Sidebar from "../../components/Sidebar";
import MemoModal from "../../components/MemoModal";
import { useState, useRef, useEffect } from "react";
import Supabase from "../../Supabase";
import { IoIosAddCircle } from "react-icons/io";
import { CiMemoPad } from "react-icons/ci";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const MemoTracker = () => {
  const modalRef = useRef();
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [memoData, setMemoData] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [filter, setFilter] = useState('completed');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memoToDelete, setMemoToDelete] = useState(null);

  const fetchData = async () => {
    const { data } = await Supabase.from("memo").select("*").order('id', { ascending: true })
    ;
    setMemoData(data || []);
  }

  useEffect(() => {
    fetchData();
  }, []);

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

      await fetchData();
      setShowDeleteModal(false);
      setMemoToDelete(null);
    } catch (error) {
      console.error("Error deleting memo:", error);
      alert("Failed to delete memo. Please try again.");
    }
  }

  const handleModalClose = () => {
    setSelectedMemo(null);
    fetchData(); 
  }

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
                setSelectedMemo(null);
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
                    <th>Actions</th>
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
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(memo)}
                            className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50"
                            title="Edit memo"
                          >
                            <FiEdit2 className="h-4 w-4" />
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
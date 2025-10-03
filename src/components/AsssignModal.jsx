import { useRef, forwardRef, useImperativeHandle } from "react";
import { FetchUsers } from "../lib/data";
import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { updateTaskFunction } from "../lib/functions";


const UserData = await FetchUsers();
const AssignModal = forwardRef(({ onClose, task }, ref) => {
  const dialogRef = useRef(null);
  const [user_id, setUserId] = useState('');

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  const handleClose = () => {
    dialogRef.current?.close();
    onClose?.();
  };

  function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
   <dialog ref={dialogRef} className="modal">
      <div className="modal-box w-full max-w-5xl p-0 sm:p-4">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
          onClick={handleClose}
        >
          ✕
        </button>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div className="p-2 sm:p-4 space-y-4 max-h-[90vh] overflow-y-auto">
          {task ? (
            <>
            
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Task Details
              </h1>
               <h2 className="text-1 sm:text-xl font-semi-bold text-gray-900">
                {task.title}
              </h2>
              <p className="text-gray-600 text-l sm:text-base mt-1">
                {task.description}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {formatDate(task.deadline)}
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-center">No task selected.</p>
          )}
        </div>
             <div className="p-2 sm:p-4 space-y-4 max-h-[90vh] overflow-y-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Assign Task to</h1>
                  <div className="space-y-2">
                        <div className="relative flex items-center">
                           <select name={UserData} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={user_id} onChange={(e) => setUserId(e.target.value)}>
                            <option>Select Employee</option>
                            {UserData.map(users =>
                            <option key={users.id} value={users.id}>{users.first_name} {users.last_name} </option>
                            )};
                        </select>
                                </div>
                                </div>
                                <div className="flex flex-col justify-end sm:flex-row gap-2">
                                    <button className="bg-green-900 text-white btn rounded-lg"
                                     onClick={() => updateTaskFunction("tasks", task.id, user_id)}>
                                    <FaSave className="h-4 w-4 mr-2" /> Save
                                    </button>
                                </div>
                                      
        </div>
          </div>
      </div>
    </dialog>
  );
});

export default AssignModal;

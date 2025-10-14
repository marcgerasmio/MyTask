import { useRef, forwardRef, useImperativeHandle } from "react";
import { FaSave } from "react-icons/fa";
import { useState } from "react";
import { usersData } from "../lib/data";
import supabase from "../Supabase";


const ActivityModal = forwardRef(({onClose }, ref) => {
  const dialogRef = useRef(null);

 const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);
    return retVal;
}

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  const handleClose = () => {
    dialogRef.current?.close();
    onClose?.();
  };

  const createTask = async () => {
   const { data, error } = await supabase
  .from('activities')
  .insert({ 
    activityName,
    description,
    startDate,
    endDate,
  });
  window.location.reload();
};


  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box w-full max-w-5xl p-0 sm:p-4">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
          onClick={handleClose}
        >
          ✕
        </button>
        <div className="p-2 sm:p-4 space-y-4 max-h-[90vh] overflow-y-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Add Activity
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Fill up necessary information below.
            </p>
        </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="firstName"
                        >
                        Activity Name
                        </label>
                        <input
                          id="firstName"
                          placeholder="Activity Title"
                          className="w-full border rounded-md p-2"
                          value={activityName}
                          onChange={(e) => setActivityName(e.target.value)
                          }
                        />
                      </div> 
                    </div>
                   <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="phone">
                          Description
                        </label>
                        <textarea
                          id="phone"
                          placeholder="Activty Description"
                          className="w-full border rounded-md p-2"
                          rows={6}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)
                          }
                        />
                      </div>
                      </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="phone">
                         Deadline
                        </label>
                        <input
                        type="datetime-local"
                        className="w-full border rounded-md p-2"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)
                        }
                        />
                      </div>
                             <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="phone">
                         Deadline
                        </label>
                        <input
                        type="datetime-local"
                        className="w-full border rounded-md p-2"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)
                        }
                        />
                      </div>
                    </div>

                         <div className="flex flex-col justify-end sm:flex-row gap-2">
                                   <button className="bg-green-900 text-white btn rounded-lg"
                                   onClick={createTask}>
                                       <FaSave className="h-4 w-4 mr-2" />
                                        Save
                                    </button>
                                </div>
                             </div>
                             </div>
                             </dialog>
  );
});

export default ActivityModal;

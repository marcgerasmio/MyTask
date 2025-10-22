import { useRef, forwardRef, useImperativeHandle } from "react";
import { FaSave } from "react-icons/fa";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import supabase from "../Supabase";


const ActivityModal = forwardRef(({onClose }, ref) => {
  const dialogRef = useRef(null);

 const [activityName, setActivityName] = useState('');
 const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  const handleClose = () => {
    dialogRef.current?.close();
    onClose?.();
  };

  const createTask = async (e) => {
  e.preventDefault();
   const { data, error } = await supabase
  .from('activities')
  .insert({ 
    activityName,
    description,
    startDate,
    endDate,
    category,
  });
  window.location.reload();
};


  return (
    <dialog ref={dialogRef} className="modal backdrop-blur-xs">
      <div className="modal-box w-full max-w-4xl p-0 shadow-2xl rounded-2xl overflow-hidden">
     <div className="bg-green-800 p-6 text-white">
                  <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 text-white hover:bg-white hover:bg-opacity-20"
                    onClick={handleClose}
                  >
                    <FaTimes />
                  </button>
                  <h1 className="text-2xl font-bold">Add Activity</h1>
                  <p className="text-green-100 mt-1">Fill up necessary information below.</p>
                </div>
                
        <form onSubmit={createTask}>
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
                          required
                        />
                      </div>
                          <div className="space-y-2">
                <label className="block text-sm font-medium">Activity Category</label>
                <div className="flex flex-wrap gap-4">
                  {["University Activities", "Visitation", "Meeting", "Urgent", "Photo/Video", "Ma'am Aquessa",].map((cat) => (
                    <label key={cat} className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={category === cat}
                        onChange={() => setCategory(category === cat ? "" : cat)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
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
                          required
                        />
                      </div>
                      </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="phone">
                         Start
                        </label>
                        <input
                        type="datetime-local"
                        className="w-full border rounded-md p-2"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)
                        }
                        required
                        />
                      </div>
                             <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="phone">
                         End
                        </label>
                        <input
                        type="datetime-local"
                        className="w-full border rounded-md p-2"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)
                        }
                        required
                        />
                      </div>
                    </div>

                         <div className="flex flex-col justify-end sm:flex-row gap-2">
                          <button
                          className="bg-green-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                          type="submit"
                        >
                          <FaSave className="text-lg" />
                          <span>Save Changes</span>
                        </button>
                                </div>
                             </div>
                             </form>
                             </div>
                             </dialog>
  );
});

export default ActivityModal;

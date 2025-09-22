import { useRef, forwardRef, useImperativeHandle } from "react";
import { FaSave } from "react-icons/fa";
import { useState } from "react";
import { usersData } from "../lib/data";
import { FetchUsers } from "../lib/data";
import supabase from "../Supabase";

const UserData = await FetchUsers();

const TaskModal = forwardRef(({onClose }, ref) => {
  const dialogRef = useRef(null);

  const [password, setPassword] = useState('');
  const [user_id, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

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
  .from('tasks')
  .insert({ 
    user_id,
    title,
    description,
    deadline,
    status: 'ongoing',
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
              Create Task
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Fill up necessary information for creating task.
            </p>
        </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="firstName"
                        >
                        Title
                        </label>
                        <input
                          id="firstName"
                          placeholder="Task Title"
                          className="w-full border rounded-md p-2"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)
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
                          placeholder="Task Description"
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
                        type="date"
                        className="w-full border rounded-md p-2"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)
                        }
                        />
                      </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium ">Assign To</label>
                        <div className="relative flex items-center">
                           <select name={UserData} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={user_id} onChange={(e) => setUserId(e.target.value)}>
                            <option>Select Employee</option>
                            {UserData.map(users =>
                            <option key={users.id} value={users.id}>{users.first_name} {users.last_name} </option>
                            )};
                        </select>
                                </div>
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

export default TaskModal;

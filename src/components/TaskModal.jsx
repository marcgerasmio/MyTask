import { useRef, forwardRef, useImperativeHandle } from "react";
import { FaSave } from "react-icons/fa";
import { useState, useEffect } from "react";
import { usersData } from "../lib/data";
import supabase from "../Supabase";
import { FaTimes } from "react-icons/fa";


const TaskModal = forwardRef(({onClose, status, setId }, ref) => {
  const dialogRef = useRef(null);
  const [password, setPassword] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]); // Changed to array
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [link, setLink] = useState('');
  const [UserData, setUserData] = useState([]);

    const fetchUsers = async () => {
    const { data } = await supabase.from("userDetails").select("*");
    setUserData(data);
  };

   useEffect(() => {
      fetchUsers();
    }, []);

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

  // Handle checkbox selection for multiple users
  const handleUserSelection = (userId) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

const createTask = async (e) => {
   e.preventDefault();
   
   // Determine which users to assign the task to
   const userIdsToAssign = setId != null ? [setId] : selectedUserIds;
   
   if (userIdsToAssign.length === 0) {
     alert('Please select at least one user to assign the task to.');
     return;
   }
   
   // Create a task for each selected user
   const taskPromises = userIdsToAssign.map(userId => 
     supabase
       .from('tasks')
       .insert({ 
         user_id: userId,
         title,
         description,
         deadline,
         category,
         status,
         link,
       })
   );
   
   try {
     const results = await Promise.all(taskPromises);
     
     // Check if any insertions failed
     const errors = results.filter(result => result.error);
     
     if (errors.length > 0) {
       console.error('Error creating tasks:', errors);
       alert(`Failed to create ${errors.length} task(s). Please try again.`);
       return;
     }
     
     window.location.reload();
   } catch (error) {
     console.error('Error creating tasks:', error);
     alert('Failed to create tasks. Please try again.');
   }
};


  return (
    <dialog ref={dialogRef} className="modal backdrop-blur-xs">
     <div className="modal-box w-full max-w-4xl max-h-[90vh] p-0 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
     <div className="bg-green-800 p-6 text-white flex-shrink-0">
                  <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 text-white hover:bg-white hover:bg-opacity-20"
                    onClick={handleClose}
                  >
                    <FaTimes />
                  </button>
                  <h1 className="text-2xl font-bold">Create Task</h1>
                  <p className="text-green-100 mt-1">Fill up necessary information below.</p>
                </div>
                
        <form onSubmit={createTask} className="flex flex-col flex-1 overflow-hidden">
                  <div className="p-4 space-y-4 overflow-y-auto flex-1">
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
                          required
                        />
                      </div> 
                    </div>
                <div className="space-y-2">
                <label className="block text-sm font-medium">Task Category</label>
                <div className="flex flex-wrap gap-4">
                  {["Publication Material", "Press Release", "Photo Coverage", "Video Production", "Correspondence",
                  "Committee Tasks", "Merchandise Design", "Data Retrieval", "Audio Recording", "Graphic Illustration", 
                  "Document Trailing",  "Website Update", "Others"].map((cat) => (
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
                   <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="phone">
                          Description
                        </label>
                        <textarea
                          id="phone"
                          placeholder="Task Description"
                          className="w-full border rounded-md p-2"
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)
                          }
                        />
                      </div>
                      </div>
                          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="firstName"
                        >
                        Link (leave blank if not applicable)
                        </label>
                        <input
                          id="firstName"
                          placeholder="Task Link"
                          className="w-full border rounded-md p-2"
                          value={link}
                          onChange={(e) => setLink(e.target.value)
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
                          required
                        />
                      </div>
                        <div>
                          {setId != null ? (
                            <div>
                            </div>
                          ) : 
                          <div className="space-y-2">
                                  <label className="block text-sm font-medium">Assign To (Select Multiple)</label>
                                  <div className="border rounded-md p-3 max-h-48 overflow-y-auto bg-white">
                                    {UserData.map(user => (
                                      <label key={user.id} className="flex items-center space-x-2 py-2 hover:bg-gray-50 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={selectedUserIds.includes(user.id)}
                                          onChange={() => handleUserSelection(user.id)}
                                          className="form-checkbox h-4 w-4 text-green-600"
                                        />
                                        <span className="text-sm">{user.first_name} {user.last_name}</span>
                                      </label>
                                    ))}
                                  </div>
                                  {selectedUserIds.length > 0 && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      {selectedUserIds.length} user(s) selected
                                    </p>
                                  )}
                          </div>}    
                    
                        </div>
                    
                    </div>

                         <div className="flex flex-col justify-end sm:flex-row gap-2 pt-4 border-t mt-4">
                                   <button className="bg-green-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                  type="submit">
                                       <FaSave className="h-4 w-4 mr-2" />
                                        Save
                                    </button>
                                </div>
                             </div>
                             </form>
                             </div>
                             </dialog>
  );
});

export default TaskModal;
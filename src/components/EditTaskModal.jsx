import { useRef, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import { useState, useEffect } from "react";
import supabase from "../Supabase";


const EditTaskModal = forwardRef(({onClose, task }, ref) => {
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [user_id, setUserId] = useState(null);
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
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDeadline(task.deadline || '');
      setCategory(task.category || '');
      setLink(task.link || '');
    }
  }, [task]);

  useEffect(() => {
    fetchUsers();
  }, []);
    
  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  const handleClose = () => {
    dialogRef.current?.close();
    onClose?.();
  };

  const updateTask = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        title: title,
        description: description,
        deadline: deadline,
        category: category,
        link: link,
      })
      .eq('id', task.id);
    
    if (error) {
      console.error('Error updating task:', error);
      return;
    }
    
    handleClose();
    navigate("/tasks");
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
              Edit Task
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Fill up necessary information for editing task.
            </p>
        </div>
        {task ? (
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
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div> 
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Task Category</label>
              <div className="flex flex-wrap gap-4">
                {["Publication Material", "Press Release", "Photo Coverage", "Video Production", 
                  "Committee Tasks", "Merchandise Design", "Data Retrieval", "Audio Recording", 
                  "Graphic Illustration", "Document Trailing", "Website Update", "Others"].map((cat) => (
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
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="firstName"
                        >
                        Link
                        </label>
                        <input
                          id="firstName"
                          placeholder="Task Link"
                          className="w-full border rounded-md p-2"
                          value={link}
                          onChange={(e) => setLink(e.target.value)
                          }
                          required
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
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col justify-end sm:flex-row gap-2">
              <button 
                className="bg-green-900 text-white btn rounded-lg"
                onClick={updateTask}
              >
                <FaSave className="h-4 w-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </dialog>
  );
});

export default EditTaskModal;
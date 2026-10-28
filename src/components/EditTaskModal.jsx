import { useRef, forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTimes } from "react-icons/fa";
import supabase from "../Supabase";

const CATEGORIES = [
  "Publication Material",
  "Press Release",
  "Photo Coverage",
  "Video Production",
  "Correspondence",
  "Committee Tasks",
  "Merchandise Design",
  "Data Retrieval",
  "Audio Recording",
  "Graphic Illustration",
  "Document Trailing",
  "Website Update",
  "Others",
];

const EditTaskModal = forwardRef(({ onClose, task }, ref) => {
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDeadline(task.deadline || "");
      setCategory(task.category || "");
      setLink(task.link || "");
    }
  }, [task]);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  const handleClose = () => {
    dialogRef.current?.close();
    onClose?.();
  };

  const updateTask = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // guard against rapid double submits
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          title,
          description,
          deadline,
          category,
          link,
        })
        .eq("id", task.id);

      if (error) {
        console.error("Error updating task:", error);
        alert("Failed to update task. Please try again.");
        return;
      }

      handleClose();
      navigate("/tasks");
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal backdrop-blur-xs">
      <div className="modal-box w-full max-w-4xl max-h-[90vh] p-0 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        <div className="bg-green-800 p-6 text-white flex-shrink-0">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 text-white hover:bg-white hover:bg-opacity-20"
            onClick={handleClose}
          >
            <FaTimes />
          </button>
          <h1 className="text-2xl font-bold">Edit Task</h1>
          <p className="text-green-100 mt-1">
            Fill up necessary information for editing task.
          </p>
        </div>

        {task ? (
          <form
            onSubmit={updateTask}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* Title */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="editTaskTitle">
                    Title
                  </label>
                  <input
                    id="editTaskTitle"
                    placeholder="Task Title"
                    className="w-full border rounded-md p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Task Category</label>
                <div className="flex flex-wrap gap-4">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat}
                      className="inline-flex items-center space-x-2"
                    >
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

              {/* Description */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="editTaskDescription"
                  >
                    Description
                  </label>
                  <textarea
                    id="editTaskDescription"
                    placeholder="Task Description"
                    className="w-full border rounded-md p-2"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Link */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="editTaskLink">
                    Link (leave blank if not applicable)
                  </label>
                  <input
                    id="editTaskLink"
                    placeholder="Task Link"
                    className="w-full border rounded-md p-2"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
              </div>

              {/* Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="editTaskDeadline"
                  >
                    Deadline
                  </label>
                  <input
                    id="editTaskDeadline"
                    type="date"
                    className="w-full border rounded-md p-2"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Save */}
              <div className="flex flex-col justify-end sm:flex-row gap-2 pt-4 border-t mt-4">
                <button
                  className="bg-green-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <FaSave className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-6">Loading...</div>
        )}
      </div>
    </dialog>
  );
});

export default EditTaskModal;
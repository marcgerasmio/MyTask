import { useRef, forwardRef, useImperativeHandle, useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import supabase from "../Supabase";

const CATEGORIES = [
  "University Activities",
  "Visitation",
  "Meeting",
  "Urgent",
  "Photo/Video",
  "Ma'am Aquessa",
];

const ActivityModal = forwardRef(({ onClose }, ref) => {
  const dialogRef = useRef(null);

  const [activityName, setActivityName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (isSubmitting) return; // guard against rapid double submits
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("activities").insert({
        activityName,
        description,
        startDate,
        endDate,
        category,
      });

      if (error) {
        console.error("Error creating activity:", error);
        alert("Failed to create activity. Please try again.");
        setIsSubmitting(false); // re-enable on failure
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Error creating activity:", error);
      alert("Failed to create activity. Please try again.");
      setIsSubmitting(false); // re-enable on failure
    }
  };

  return (
    <dialog ref={dialogRef} className="modal backdrop-blur-xs">
      <div className="modal-box w-full max-w-4xl p-0 shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-green-800 p-6 text-white">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 text-white hover:bg-white hover:bg-opacity-20"
            onClick={handleClose}
          >
            <FaTimes />
          </button>
          <h1 className="text-2xl font-bold">Add Activity</h1>
          <p className="text-green-100 mt-1">
            Fill up necessary information below.
          </p>
        </div>

        <form onSubmit={createTask}>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Activity name */}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="activityName">
                  Activity Name
                </label>
                <input
                  id="activityName"
                  placeholder="Activity Title"
                  className="w-full border rounded-md p-2"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Activity Category
                </label>
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
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium"
                  htmlFor="activityDescription"
                >
                  Description
                </label>
                <textarea
                  id="activityDescription"
                  placeholder="Activity Description"
                  className="w-full border rounded-md p-2"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Start / End */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="activityStart">
                  Start
                </label>
                <input
                  id="activityStart"
                  type="datetime-local"
                  className="w-full border rounded-md p-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="activityEnd">
                  End
                </label>
                <input
                  id="activityEnd"
                  type="datetime-local"
                  className="w-full border rounded-md p-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Save */}
            <div className="flex flex-col justify-end sm:flex-row gap-2">
              <button
                className="bg-green-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md"
                type="submit"
                disabled={isSubmitting}
              >
                <FaSave className="text-lg" />
                <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
});

export default ActivityModal;
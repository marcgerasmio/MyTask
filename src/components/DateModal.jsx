import { useRef, forwardRef, useImperativeHandle, useState } from "react";
import { FaSave, FaCalendarAlt, FaClock, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import supabase from "../Supabase";

const DateModal = forwardRef(({ onClose, event }, ref) => {
  const dialogRef = useRef(null);
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";
  const [isEditing, setIsEditing] = useState(false);
  
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useImperativeHandle(ref, () => ({
    open: () => {
      dialogRef.current?.showModal();
      setIsEditing(false);
    },
    close: () => {
      dialogRef.current?.close();
      setIsEditing(false);
    },
  }));

  const handleClose = () => {
    dialogRef.current?.close();
    setIsEditing(false);
    onClose?.();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setActivityName(event.activityName);
    setDescription(event.description);
    setStartDate(formatDateForInput(event.startDate));
    setEndDate(event.endDate ? formatDateForInput(event.endDate) : '');
  };

  const updateActivity = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('activities')
      .update({ 
        activityName,
        description,
        startDate,
        endDate,
      })
      .eq('id', event.id);
    
    if (!error) {
      window.location.reload();
    }
  };

  const deleteActivity = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this activity?");
    if (confirmed) {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', event.id);
      
      if (!error) {
        window.location.reload();
      }
    }
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

  function formatDateShort(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  function formatDateForInput(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }


 return (
    <dialog ref={dialogRef} className="modal backdrop-blur-xs">
      <div className="modal-box w-full max-w-4xl p-0 shadow-2xl rounded-2xl overflow-hidden">
        {!isEditing ? (
          <div className="relative">
            <div className="bg-green-800 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 text-white hover:bg-white hover:bg-opacity-20"
                onClick={handleClose}
              >
                <FaTimes />
              </button>
              
              {event ? (
                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2 leading-tight">
                        {event.activityName}
                      </h1>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Content */}
            <div className="p-8">
              {event ? (
                <div className="space-y-6">
                  {/* Date and Time Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-200 rounded-xl p-5 border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                          <FaCalendarAlt className="text-white text-lg" />
                        </div>
                        <h3 className="font-semibold text-gray-700">Start Date</h3>
                      </div>
                      <p className="text-gray-900 font-medium ml-11">{formatDateShort(event.startDate)}</p>
                      <div className="flex items-center gap-2 ml-11 mt-1">
                        <FaClock className="text-blue-600 text-sm" />
                        <p className="text-gray-600 text-sm">{formatTime(event.startDate)}</p>
                      </div>
                    </div>

                    {event.endDate && (
                      <div className="bg-gray-200 rounded-xl p-5 border border-purple-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-purple-600 p-2 rounded-lg">
                            <FaCalendarAlt className="text-white text-lg" />
                          </div>
                          <h3 className="font-semibold text-gray-700">End Date</h3>
                        </div>
                        <p className="text-gray-900 font-medium ml-11">{formatDateShort(event.endDate)}</p>
                        <div className="flex items-center gap-2 ml-11 mt-1">
                          <FaClock className="text-purple-600 text-sm" />
                          <p className="text-gray-600 text-sm">{formatTime(event.endDate)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description Section */}
                  <div className="bg-gray-200 rounded-xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-3 text-lg">Description</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                      <button
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        onClick={handleEdit}
                      >
                        <FaEdit className="text-lg" />
                        <span>Edit Activity</span>
                      </button>
                      <button
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        onClick={deleteActivity}
                      >
                        <FaTrash className="text-lg" />
                        <span>Delete Activity</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FaCalendarAlt className="text-6xl mx-auto" />
                  </div>
                  <p className="text-gray-500 text-lg">No event selected.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="bg-green-800 p-6 text-white">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 text-white hover:bg-white hover:bg-opacity-20"
                onClick={handleClose}
              >
                <FaTimes />
              </button>
              <h1 className="text-2xl font-bold">Edit Activity</h1>
              <p className="text-green-100 mt-1">Update the information below.</p>
            </div>
            
            <form onSubmit={updateActivity}>
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="activityName">
                    Activity Name
                  </label>
                  <input
                    id="activityName"
                    placeholder="Enter activity title"
                    className="w-full border-2 border-gray-300 focus:border-green-500 rounded-lg p-3 transition-colors outline-none"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter activity description"
                    className="w-full border-2 border-gray-300 focus:border-green-500 rounded-lg p-3 transition-colors outline-none resize-none"
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="startDate">
                      Start Date & Time
                    </label>
                    <input
                      id="startDate"
                      type="datetime-local"
                      className="w-full border-2 border-gray-300 focus:border-green-500 rounded-lg p-3 transition-colors outline-none"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="endDate">
                      End Date & Time
                    </label>
                    <input
                      id="endDate"
                      type="datetime-local"
                      className="w-full border-2 border-gray-300 focus:border-green-500 rounded-lg p-3 transition-colors outline-none"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 p-6 bg-gray-50 border-t border-gray-200">
                <button
                  type="button"
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-green-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  type="submit"
                >
                  <FaSave className="text-lg" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
});

export default DateModal
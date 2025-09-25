import { useRef, forwardRef, useImperativeHandle } from "react";

const DateModal = forwardRef(({ event, onClose }, ref) => {
  const dialogRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  const handleClose = () => {
    dialogRef.current?.close();
    onClose?.();
  };

  function formatDate(isoString) {
    if (!isoString) return "";
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

  if (!event) return null; // don’t render anything if no event is selected

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
            {event.activityName}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            {event.description}
          </p>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            {formatDate(event.startDate)} – {formatDate(event.endDate)}
          </p>
        </div>
      </div>
    </dialog>
  );
});

export default DateModal;

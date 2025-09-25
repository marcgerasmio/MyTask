import { useRef, forwardRef, useImperativeHandle } from "react";

const DateModal = forwardRef(({ onClose, event }, ref) => {
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
      <div className="modal-box w-80 max-w-5xl p-0 sm:p-4">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
          onClick={handleClose}
        >
          ✕
        </button>
        <div className="p-2 sm:p-4 space-y-4 max-h-[90vh] overflow-y-auto">
          {event ? (
            <>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {event.activityName}
              </h1>
              <p className="text-gray-600 text-l sm:text-base mt-1">
                {event.description}
              </p>
              <p className="text-gray-500 text-xs sm:text-base mt-1">
                {formatDate(event.startDate)}
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-center">No event selected.</p>
          )}
        </div>
      </div>
    </dialog>
  );
});

export default DateModal;

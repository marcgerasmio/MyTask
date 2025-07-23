const Modal = ({ modalId, title, message, confirmLabel, onConfirm, color }) => {
  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => document.getElementById(modalId)?.close()}
        >
          ✕
        </button>
        <h3 className="font-bold">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            className={`btn ${color} text-white`}
            onClick={() => {
              onConfirm?.();
              document.getElementById(modalId)?.close();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;

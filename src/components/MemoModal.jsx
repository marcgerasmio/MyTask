import { useRef, forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import supabase from "../Supabase";

const MemoModal = forwardRef(({ memo, onClose }, ref) => {
  const dialogRef = useRef(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [memo_id, setMemoId] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (memo) {
      setTitle(memo.title || '');
      setDate(memo.date || '');
      setMemoId(memo.memo_id || '');
    } else {
      setTitle('');
      setDate('');
      setMemoId('');
    }
  }, [memo]);

  const handleSave = async () => {
    try {
      if (memo) {
        // Update existing memo
        const { error } = await supabase
          .from('memo')
          .update({
            title,
            date,
            memo_id
          })
          .eq('id', memo.id);

        if (error) throw error;
      } else {
        // Insert new memo
        const { error } = await supabase
          .from('memo')
          .insert({
            title,
            date,
            memo_id
          });

        if (error) throw error;
      }

      handleClose();
    } catch (error) {
      console.error("Error saving memo:", error);
      alert("Failed to save memo. Please try again.");
    }
  };

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  const handleClose = () => {
    dialogRef.current?.close();
    setTitle('');
    setDate('');
    setMemoId('');
    onClose?.();
  };

  return (
    <dialog ref={dialogRef} className="modal backdrop-blur-xs">
      <div className="modal-box w-full max-w-4xl p-0 shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-green-800 p-6 text-white relative">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-white hover:bg-white hover:bg-opacity-20"
            onClick={handleClose}
          >
            <FaTimes />
          </button>

          <h1 className="text-2xl font-bold">
            {memo ? 'Edit Memo' : 'Add Memo'}
          </h1>
          <p className="text-green-100 mt-1">
            Fill up necessary information below.
          </p>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Title / Content
            </label>
            <textarea
              rows={2}
              placeholder="Sample Memo Content"
              className="w-full border rounded-md p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Date + Memo ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Date
              </label>
              <input
                type="date"
                className="w-full border rounded-md p-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Memo Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Memo Number (Format: 2026-00001)
              </label>
              <input
                type="text"
                placeholder="2026-00001"
                className="w-full border rounded-md p-2"
                value={memo_id}
                onChange={(e) => setMemoId(e.target.value)}
              />
            </div>

          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              className="bg-green-800 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg"
              onClick={handleSave}
            >
              <FaSave className="h-4 w-4" />
              Save
            </button>
          </div>

        </div>
      </div>
    </dialog>
  );
});

export default MemoModal;
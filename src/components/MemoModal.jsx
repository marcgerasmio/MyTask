import { useRef, forwardRef, useImperativeHandle } from "react";
import { FaSave } from "react-icons/fa";
import { useState } from "react";
import supabase from "../Supabase";
import { FaTimes } from "react-icons/fa";

const MemoModal = forwardRef(({onClose }, ref) => {
    const dialogRef = useRef(null);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');


const handleSave = async () => {
   const { data, error } = await supabase
  .from('memo')
  .insert({ 
 title,
 date
  });
window.location.reload();
};

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  const handleClose = () => {
    dialogRef.current?.close();
    onClose?.();
  };


  return (
    <dialog ref={dialogRef} className="modal backdrop-blur-xs">
      <div className="modal-box w-full max-w-4xl p-0 shadow-2xl rounded-2xl overflow-hidden">
     <div className="bg-green-800 p-6 text-white">
                  <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 text-white hover:bg-white hover:bg-opacity-20"
                    onClick={handleClose}
                  >
                    <FaTimes />
                  </button>
                  <h1 className="text-2xl font-bold">Add Memo</h1>
                  <p className="text-green-100 mt-1">Fill up necessary information below.</p>
                </div>
                
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="firstName"
                        >
                          Title/Content
                        </label>
                        <textarea
                          id="firstName"
                        rows={2}
                          placeholder="Sample Memo Content"
                          className="w-full border rounded-md p-2"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)
                          }
                        />
                      </div>
                    </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="phone">
                          Date
                        </label>
                        <input
                          id="phone"
                          type="date"
                          placeholder="user@carsu.edu.ph"
                          className="w-full border rounded-md p-2"
                          value={date}
                          onChange={(e) => setDate(e.target.value)
                          }
                        />
                      </div>
                      </div>
                         <div className="flex flex-col justify-end sm:flex-row gap-2">
                                   <button className="bg-green-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                   onClick={handleSave}>
                                       <FaSave className="h-4 w-4 mr-2" />
                                        Save
                                    </button>
                                </div>
                             </div>
                             </div>
                             </dialog>
  );
});

export default MemoModal;

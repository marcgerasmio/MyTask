import { useRef, forwardRef, useImperativeHandle } from "react";
import { FaSave } from "react-icons/fa";
import { useState } from "react";
import supabase from "../Supabase";

const PasswordModal = forwardRef(({onClose }, ref) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const uuid = user.user_id;
  const dialogRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSavePassword = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.updateUser({
    password: password,
    })
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
              Change Password
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Fill up necessary information.
            </p>
        </div>
                  <div className="p-4 space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="phone">
                          Email Address
                        </label>
                        <input
                          id="phone"
                          placeholder="user@carsu.edu.ph"
                          className="w-full border rounded-md p-2"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)
                          }
                        />
                      </div>
                      </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="phone">
                        New Password
                        </label>
                        <input
                        type="password"
                        value={password}
                        placeholder="*******"
                         onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-md p-2"
                        />
                      </div>
                    </div>

                         <div className="flex flex-col justify-end sm:flex-row gap-2">
                                   <button className="bg-green-900 text-white btn rounded-lg"
                                   onClick={handleSavePassword}>
                                       <FaSave className="h-4 w-4 mr-2" />
                                        Save
                                    </button>
                                </div>
                             </div>
                             </div>
                             </dialog>
  );
});

export default PasswordModal;

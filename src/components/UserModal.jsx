import { useRef, forwardRef, useImperativeHandle } from "react";
import { FaSave } from "react-icons/fa";
import { useState } from "react";
import supabase from "../Supabase";
import { FaTimes } from "react-icons/fa";

const UserModal = forwardRef(({onClose }, ref) => {
  const dialogRef = useRef(null);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [isAdmin, setIsAdmin] = useState('');
  const [password, setPassword] = useState('');

  function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);
    return retVal;
}

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  handleUserDetails(data.user.id);
};


const handleUserDetails = async (user_id) => {
   const { data, error } = await supabase
  .from('userDetails')
  .insert({ 
    user_id,
    first_name,
    last_name,
    position,
    isAdmin,
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
                  <h1 className="text-2xl font-bold">Add User</h1>
                  <p className="text-green-100 mt-1">Fill up necessary information below.</p>
                </div>
                
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="firstName"
                        >
                          First Name
                        </label>
                        <input
                          id="firstName"
                          placeholder="Juan"
                          className="w-full border rounded-md p-2"
                          value={first_name}
                          onChange={(e) => setFirstName(e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="lastName"
                        >
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          placeholder="Dela Cruz"
                          className="w-full border rounded-md p-2"
                          value={last_name}
                          onChange={(e) => setLastName(e.target.value)
                          }
                        />
                      </div>
                    </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="title">
                          Position
                        </label>
                        <input
                          id="title"
                          placeholder="Employee"
                          className="w-full border rounded-md p-2"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)
                          }
                        />
                      </div>
                      </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="phone">
                         Password
                        </label>
                        <input
                        value={password}
                        placeholder="*******"
                         onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-md p-2"
                        />
                      </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium ">Give Admin Access?</label>
                        <div className="relative flex items-center">
                            <select id="isAdmin" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={isAdmin} onChange={(e) => setIsAdmin(e.target.value)}>
                                <option value="" disabled="">Select option</option>
                                <option value="TRUE">Yes</option>
                                <option value="FALSE">No</option></select>
                                </div>
                                </div>
                    </div>

                         <div className="flex flex-col justify-between sm:flex-row gap-2">
                                    <button className="btn-accent btn rounded-lg"
                                    onClick={generatePassword}>
                                        Generate Password
                                    </button>

                                   <button className="bg-green-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                   onClick={handleCreateAccount}>
                                       <FaSave className="h-4 w-4 mr-2" />
                                        Save
                                    </button>
                                </div>
                             </div>
                             </div>
                             </dialog>
  );
});

export default UserModal;

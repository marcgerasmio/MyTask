import { useState, useRef} from "react";
import Sidebar from "../../components/Sidebar";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import Supabase from "../../Supabase";
import PasswordModal from "../../components/PasswordModal";

const Profile = () => {
    const modalRef = useRef();
    const user = JSON.parse(sessionStorage.getItem("user"));
    const email = sessionStorage.getItem("email");

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

  const [newFirstName, setNewFirstName] = useState(user.first_name);
  const [newLastName, setNewLastName] = useState(user.last_name);
  const [newPosition, setNewPosition] = useState(user.position);
  
  
const updateUserDetails = async () => {
    const {data,  error } = await Supabase
    .from("userDetails")
    .update({ 'first_name': newFirstName, 'last_name' : newLastName, 'position' : newPosition})
    .eq('id', user.id)
    .select()
    sessionStorage.setItem("user", JSON.stringify(data[0]));
    window.location.reload();
};
  
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Profile Settings
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your account information and preferences
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg lg:col-span-1">
                <div className="text-center p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full mx-auto flex items-center justify-center mb-4">
                    <img
                      src={user.image}
                      alt="User"
                      className="rounded-full border-2"
                    />
                  </div>
                  <h2 className="text-xl font-semibold">{user.first_name} {user.last_name}</h2>
                  <p className="text-gray-600">{user.position}</p>
                </div>
                <div className="px-6 pb-6 space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">Member since</p>
                    <p className="font-semibold">{formatDate(user.created_at)}</p>
                  </div>
                  <hr />
                    <div className="flex flex-col justify-center sm:flex-row gap-2">
                        <button className="bg-yellow-500 text-white btn rounded-lg"
                             onClick={() => {
                            modalRef.current?.open();
                          }}>
                        <RiLockPasswordFill className="h-4 w-4 mr-2" />
                        Change Password
                        </button>
                    </div>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white shadow rounded-lg">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold">
                      Personal Information
                    </h3>
                    <p className="text-sm text-gray-600">
                      Update your personal details and contact information
                    </p>
                  </div>
                  <div className="p-6 space-y-4">
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
                          value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                          className="w-full border rounded-md p-2"
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
                            value={newLastName}
                            onChange={(e) => setNewLastName(e.target.value)}
                            className="w-full border rounded-md p-2"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        disabled={true}
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="title">
                          Position
                        </label>
                        <input
                            id="title"
                            value={newPosition}
                            onChange={(e) => setNewPosition(e.target.value)}
                          className="w-full border rounded-md p-2"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-end sm:flex-row gap-2">
                        <button className="bg-green-900 text-white btn rounded-lg"
                        onClick={updateUserDetails}>
                        <FaEdit className="h-4 w-4 mr-2" />
                        Edit Profile
                        </button>
                    </div>
                 
                  </div>
                </div>
              </div>
            </div>
          </div>
            <PasswordModal
        ref={modalRef}
        onClose={() => {}}
      />
        </main>
      </div>
    </>
  );
};

export default Profile;

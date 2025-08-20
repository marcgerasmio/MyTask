import Sidebar from "../components/Sidebar";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit } from "react-icons/fa";

const Profile = () => {
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
              <button className="btn-neutral btn rounded-lg">
                <FaEdit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg lg:col-span-1">
                <div className="text-center p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full mx-auto flex items-center justify-center mb-4">
                    <img
                      src="https://placehold.co/400"
                      alt="User"
                      className="rounded-full border-2"
                    />
                  </div>
                  <h2 className="text-xl font-semibold">Dr. Juan Dela Cruz</h2>
                  <p className="text-gray-600">Ophthalmologist</p>
                </div>
                <div className="px-6 pb-6 space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">Member since</p>
                    <p className="font-semibold">January 2023</p>
                  </div>
                  <hr />
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">juandelacruz@hospital.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaPhone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">(123) 456-7890</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Manila, Philippines</span>
                    </div>
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
                          defaultValue="Juan"
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
                          defaultValue="Dela Cruz"
                          className="w-full border rounded-md p-2"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        defaultValue="juandelacruz@hospital.com"
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="phone">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          defaultValue="(123) 456-7890"
                          className="w-full border rounded-md p-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="title">
                          Professional Title
                        </label>
                        <input
                          id="title"
                          defaultValue="Ophthalmologist, PhD"
                          className="w-full border rounded-md p-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow rounded-lg">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold">
                      Professional Information
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your medical credentials and specializations
                    </p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="license"
                        >
                          Medical License
                        </label>
                        <input
                          id="license"
                          defaultValue="MD-12345-PH"
                          className="w-full border rounded-md p-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="hospital"
                        >
                          Hospital/Clinic
                        </label>
                        <input
                          id="hospital"
                          defaultValue="Manila General Hospital"
                          className="w-full border rounded-md p-2"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium"
                        htmlFor="specialization"
                      >
                        Specialization
                      </label>
                      <input
                        id="specialization"
                        defaultValue="Retinal Diseases, Diabetic Retinopathy"
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium"
                        htmlFor="experience"
                      >
                        Years of Experience
                      </label>
                      <input
                        id="experience"
                        defaultValue="15 years"
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;

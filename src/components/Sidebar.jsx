import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { RiLogoutCircleLine } from "react-icons/ri";
import Modal from "./Modal";
import UserInfo from "./UserInfo";
import { navItems, navItemsEmployee } from "../lib/data";


 const user = JSON.parse(localStorage.getItem("user"));


const Sidebar = () => {
  const isAdmin = localStorage.getItem("isAdmin");
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const navItemsToUse = isAdmin === "true" ? navItems : navItemsEmployee;

  return (
    <aside className="flex flex-col md:flex-row max-h-screen lg:fixed lg:h-screen overflow-y-auto">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-green-900">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={toggleSidebar} className="p-2 rounded-md text-white">
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8 w-8 object-contain rounded-full bg-white p-1 border-2 border-gray-600"
            />
            <div className="text-xl font-bold text-white">Tasky</div>
          </div>
          <img
            src={user.image}
            alt="User"
            className="w-8 h-8 rounded-full border-2 border-gray-600"
          />
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Desktop Sidebar */}
      <div
        className={`fixed md:static flex flex-col h-screen bg-white shadow-4xl w-64 z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } top-0 left-0 md:translate-x-0 md:w-64`}
      >
        <div className="bg-green-900 flex items-center justify-center gap-3 p-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-12 w-12 object-contain rounded-full bg-white p-1 border-2 border-gray-600"
          />
          <h1 className="text-2xl text-white font-extrabold">
            Tasky
            <span className="block font-normal text-xs text-white">
              Task Management System
            </span>
          </h1>
        </div>
        <div className="border-t border-gray-300"></div>
        <nav className="flex-1 p-4 items-center justify-center py-4">
          <ul className="space-y-2 text-sm">
            {navItemsToUse.map(({ count, label, path, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  reloadDocument={true}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 font-semibold rounded-lg ${
                      isActive ? "bg-green-900 text-white" : "hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon className="mr-3" size={16} />
                  {label}
                  {count && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium ml-1 px-1.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                      {count}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
            <li>
              <div
                className="flex items-center px-4 font-semibold py-2.5 cursor-pointer hover:bg-gray-100 hover:rounded-lg"
                onClick={() => {
                  if (modalRef.current && !modalRef.current.open) {
                    modalRef.current.showModal();
                  }
                }}
              >
                <RiLogoutCircleLine className="mr-3" size={16} />
                Sign out
              </div>
            </li>
          </ul>
        </nav>
        <UserInfo />
      </div>

      <Modal
        ref={modalRef}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Yes, Logout."
        color="bg-red-500"
        onConfirm={() => {
          localStorage.clear();
          if (modalRef.current?.open) modalRef.current.close();
          setTimeout(() => navigate("/"), 100);
        }}
      />
    </aside>
  );
};

export default Sidebar;
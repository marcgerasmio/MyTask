import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { RiLogoutCircleLine } from "react-icons/ri";
import Modal from "./Modal";
import UserInfo from "./UserInfo";
import { navItems, navItemsEmployee } from "../lib/data";

const Sidebar = () => {
  const isAdmin = sessionStorage.getItem("isAdmin");
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
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-40 bg-green-900">
        <div className="bg-green-900 flex items-center justify-between px-4 py-3">
          <button onClick={toggleSidebar} className="p-2 rounded-md">
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <div className="text-xl font-bold">Taskly</div>
          <img
            src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
            alt="User"
            className="w-8 h-8 rounded-full border-2 border-gray-600"
          />
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed md:static flex flex-col h-screen bg-white shadow-4xl w-64 z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } top-0 left-0 md:translate-x-0 md:w-64`}
      >
        <div className="bg-green-900 flex items-center justify-center gap-3 p-4">
          <img
            src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
            alt=""
            className="h-12 w-12 object-contain rounded-full hidden md:block"
          />
          <h1 className="text-2xl text-white font-extrabold">
            Taskly
            <span className="block font-normal text-xs text-white">
              Task Management System
            </span>
          </h1>
        </div>
        <div className="border-tborder-gray-300"></div>
        <nav className="flex-1 p-4 items-center justify-center py-4">
          <ul className="space-y-2 text-sm">
            {navItemsToUse.map(({ label, path, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 font-semibold rounded-lg ${
                      isActive ? "bg-green-900 text-white" : "hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon className="mr-3" size={16} />
                  {label}
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
        confirmLabel="Yes, Logout"
        color="bg-red-500"
        onConfirm={() => {
          sessionStorage.clear();
          if (modalRef.current?.open) modalRef.current.close();
          setTimeout(() => navigate("/"), 100);
        }}
      />
    </aside>
  );
};

export default Sidebar;

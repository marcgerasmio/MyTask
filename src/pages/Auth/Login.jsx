import { useState, useRef } from "react";
import InputField from "../../components/InputField";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { loginInputs } from "../../lib/data";
import Supabase from "../../Supabase";

const Login = () => {
  const [url, setURL] = useState("");
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [modalData, setModalData] = useState({
    isOpen: false,
    type: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const { data, error } = await Supabase.auth.signInWithPassword({
    email,
    password,
  })
 if (error) {
      setModalData({
        isOpen: true,
        type: "error",
        message: "Invalid email or password.",
      });
      setTimeout(() => {
        modalRef.current?.showModal();
      }, 0);
    } else {
      console.log(data);
      handleUserDetails(data.user.id)
    }
};

  const handleUserDetails = async (id) => {
    const { data, error } = await Supabase.from("userDetails").select("*").eq("user_id", id).single();
    console.log(data);
    const isAdmin = data.isAdmin;
    sessionStorage.setItem("isAdmin", data.isAdmin);
    sessionStorage.setItem("user", JSON.stringify(data));
    if (isAdmin === true) {
      setURL("/dashboard");
      setModalData({
        isOpen: true,
        type: "success",
        message: "Login Successfully!",
      });
      setTimeout(() => {
        modalRef.current?.showModal();
      }, 0);
    } else {
      setURL("/employee/dashboard");
      setModalData({
        isOpen: true,
        type: "success",
        message: "Login Successfully!",
      });
      setTimeout(() => {
        modalRef.current?.showModal();
      }, 0);
    }
};

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-2"
      style={{
        backgroundImage: "url(bg.jpg)",
        backgroundSize: "cover",
      }}
    >
      <div className="w-100 max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-1 h-full">
          <div className="p-6 lg:p-12 flex flex-col justify-center">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">Welcome Back</h2>
              <p className="text-gray-600">Sign in your personal account</p>
            </div>
            <form className="space-y-4">
              {loginInputs.map((field) => (
                <InputField
                  key={field.id}
                  {...field}
                  type={
                    field.id === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : field.type
                  }
                  value={formData[field.id]}
                  onChange={handleChange}
                />
              ))}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showPassword"
                  className="h-4 w-4 text-blue-500 border-gray-300 rounded"
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <label htmlFor="showPassword" className="text-sm">
                  Show password
                </label>
              </div>
              <button
                onClick={handleLogin}
                className="btn bg-green-900 hover:bg-green-700 text-white border-none rounded-md w-full"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>

      {modalData.isOpen && (
        <Modal
          ref={modalRef}
          title={modalData.type === "success" ? "Success" : "Error"}
          message={modalData.message}
          confirmLabel="OK"
          color={
            modalData.type === "success"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }
          onConfirm={() => {
            setModalData({ ...modalData, isOpen: false });
            if (modalData.type === "success") {
              navigate(url);
            }
          }}
        />
      )}
    </div>
  );
};

export default Login;

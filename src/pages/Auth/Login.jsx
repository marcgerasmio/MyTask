import { useState, useRef, useEffect} from "react";
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
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [modalData, setModalData] = useState({
    isOpen: false,
    type: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const sessionChecker = () => {
    const user = localStorage.getItem("user");
    if (user !== null) {
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      if (isAdmin) {
        navigate("/dashboard");
      }
      else {
        navigate("/employee/dashboard");
      }
    }
    else{
      return;
    }
  }
  useEffect(() => {
    sessionChecker();
  }, []);  
  useEffect(() => {
    if (modalData.isOpen && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [modalData.isOpen]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { email, password } = formData;
    const { data, error } = await Supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setModalData({
        isOpen: true,
        type: "error",
        message: "Invalid email or password.",
      });
    } else {
      console.log(data);
      handleUserDetails(data.user.id);
      localStorage.setItem("email", data.user.email);
    }
  };

  const handleUserDetails = async (id) => {
    const { data, error } = await Supabase.from("userDetails").select("*").eq("user_id", id).single();
    console.log(data);
    const isAdmin = data.isAdmin;
    localStorage.setItem("isAdmin", data.isAdmin);
    localStorage.setItem("user", JSON.stringify(data));
    if (isAdmin === true) {
      setURL("/dashboard");
      setModalData({
        isOpen: true,
        type: "success",
        message: "Login Successfully!",
      });
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
    
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    let error = "";
    
    if (id === "email") {
      error = validateEmail(value);
    } else if (id === "password") {
      error = validatePassword(value);
    }
    
    setErrors({ ...errors, [id]: error });
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
              <img src="pico.png" alt="Logo" className="mx-auto h-50 w-100" />
              <p className="text-gray-600">PICO - Task Management System</p>
            </div>
            <form className="space-y-4" onSubmit={handleLogin}>
              {loginInputs.map((field) => (
                <div key={field.id}>
                  <InputField
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
                    onBlur={handleBlur}
                  />
                  {errors[field.id] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.id]}
                    </p>
                  )}
                </div>
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
                type="submit"
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
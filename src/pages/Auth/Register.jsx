import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { useState } from "react";
import InputField from "../../components/InputField";
import { registerInputs } from "../../lib/data";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    imageFile: null,
    imagePreview: null,
    fullname: "",
    specialization: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, imageFile: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, imagePreview: event.target.result }));
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Please select a valid image file");
    }
  };

  const clearImage = () => {
    setFormData({ ...formData, imageFile: null, imagePreview: null });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-2"
      style={{
        backgroundImage: "url(background-image.jpg)",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6">
        <form>
          <div className="grid lg:grid-cols-2 gap-6 h-full">
            <div className="space-y-4">
              {registerInputs.map((field) => (
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
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Upload
              </label>
              <div className="relative w-full h-90 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors">
                {formData.imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={formData.imagePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs">
                      <p className="truncate">{formData.imageFile?.name}</p>
                      <p>
                        {formData.imageFile
                          ? (formData.imageFile.size / 1024 / 1024).toFixed(2)
                          : 0}{" "}
                        MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors text-lg"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaRegUser className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm mb-2">
                      Click to upload profile picture
                    </p>
                    <p className="text-gray-400 text-xs">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-5 border-t border-gray-200 px-4 gap-2">
            <div className="mt-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-1/5">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white rounded-md hover:bg-blue-400 border-none btn"
              >
                Register
              </button>
            </div>
            <div className="mt-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-1/5">
              <Link to="/">
                <button className="w-full bg-gray-400 text-white rounded-md hover:bg-gray-500 border-none btn">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

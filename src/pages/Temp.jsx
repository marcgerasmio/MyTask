import { useState } from "react";
import InputField from "../components/InputField";

const Temp = () => {
  const [formData, setFormData] = useState({
    imageFile: "",
    fullname: "",
    dateOfBirth: "",
    sex: "",
    civilStatus: "",
    nationality: "",
    contactNumber: "",
    email: "",
    address: "",
    specialization: "",
    medicalLicenseNumber: "",
    prcIdNumber: "",
    ptrNumber: "",
    yearsOfExperience: "",
    password: "",
    confirmPassword: "",
  });

  const personalLeft = [
    {
      label: "Full Name",
      id: "fullname",
      type: "text",
      placeholder: "Enter your name",
    },
    {
      label: "Date of Birth",
      id: "dob",
      type: "date",
    },
    {
      label: "Sex",
      id: "sex",
      type: "text",
    },
    {
      label: "Civil Status",
      id: "civil status",
      type: "text",
    },
  ];

  const personalRight = [
    {
      label: "Nationality",
      id: "nationality",
      type: "text",
      placeholder: "Enter your nationality",
    },
    {
      label: "Contact Number",
      id: "contact number",
      type: "number",
      placeholder: "+63xxxxxxxxxx",
    },
    {
      label: "Email Address",
      id: "email",
      type: "email",
      placeholder: "sample_email@gmail.com",
    },
    {
      label: "Home Address",
      id: "address",
      type: "text",
      placeholder: "Enter your address",
    },
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url(background-image.jpg)",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6">
        <form>
          <div className="grid lg:grid-cols-2 gap-4 h-full">
            <div className="space-y-3">
              {personalLeft.map((field) => (
                <InputField
                  key={field.id}
                  {...field}
                  value={formData[field.id]}
                  onChange={handleChange}
                />
              ))}
            </div>
            <div className="space-y-3">
              {personalRight.map((field) => (
                <InputField
                  key={field.id}
                  {...field}
                  value={formData[field.id]}
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Temp;

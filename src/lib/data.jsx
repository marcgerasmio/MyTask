import { MdOutlineAlternateEmail, MdOutlineRemoveRedEye } from "react-icons/md";
import { TbNurse } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";
import { IoCalendarClearOutline } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";
import { BiSolidDashboard } from "react-icons/bi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdGroupAdd } from "react-icons/md";
import { FaUserInjured } from "react-icons/fa";

export const loginInputs = [
  {
    label: "Email",
    id: "email",
    type: "email",
    placeholder: "sample@gmail.com",
    icon: MdOutlineAlternateEmail,
  },
  {
    label: "Password",
    id: "password",
    type: "password",
    placeholder: "Enter your password",
    icon: MdOutlineRemoveRedEye,
  },
];

export const registerInputs = [
  {
    label: "Full Name",
    id: "fullname",
    type: "text",
    placeholder: "Enter your name",
    icon: FaRegUser,
  },
  {
    label: "Specialization",
    id: "specialization",
    type: "text",
    placeholder: "ex. Ophthalmologist",
    icon: TbNurse,
  },
  {
    label: "Email",
    id: "emailAddress",
    type: "email",
    placeholder: "sample_email@gmail.com",
    icon: MdOutlineAlternateEmail,
  },
  {
    label: "Password",
    id: "password",
    type: "password",
    placeholder: "Enter your password",
    icon: MdOutlineRemoveRedEye,
  },
  {
    label: "Confirm Password",
    id: "confirmPassword",
    type: "password",
    placeholder: "Confirm your password",
    icon: MdOutlineRemoveRedEye,
  },
];

export const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: BiSolidDashboard,
  },
  {
    label: "Add Patient",
    path: "/add",
    icon: MdGroupAdd,
  },
  {
    label: "Patient List",
    path: "/patients",
    icon: FaUserInjured,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: FaUserDoctor,
  },
];

export const cards = [
  {
    id: 1,
    title: "Total Patients",
    icon: LuUsers,
    count: 58,
    detail: "+2 from last week",
  },
  {
    id: 2,
    title: "High Risk Cases",
    icon: IoWarningOutline,
    count: 12,
    detail: "Require immediate attention",
  },
  {
    id: 3,
    title: "This Week",
    icon: IoCalendarClearOutline,
    count: 23,
    detail: "Analysis completed",
  },
  {
    id: 4,
    title: "Success Rate",
    icon: FaArrowTrendUp,
    count: "94.2%",
    detail: "Accurate predictions",
  },
];

export const patients = [
  {
    id: 1,
    image: "https://img.daisyui.com/images/profile/demo/3@94.webp",
    patient: "Marc Dominic Gerasmio Jr.",
    age: 25,
    lastCheckup: "May 8, 2025",
    riskLevel: "High",
  },
  {
    id: 2,
    image: "https://img.daisyui.com/images/profile/demo/2@94.webp",
    patient: "Marion Jotohot",
    age: 24,
    lastCheckup: "May 10, 2025",
    riskLevel: "Moderate",
  },
  {
    id: 3,
    image: "https://img.daisyui.com/images/profile/demo/4@94.webp",
    patient: "John Elro Karl Estoque",
    age: 23,
    lastCheckup: "May 12, 2025",
    riskLevel: "Low",
  },
  {
    id: 4,
    image: "https://img.daisyui.com/images/profile/demo/4@94.webp",
    patient: "Krizia Marie Dapal",
    age: "22",
    riskLevel: "Low",
    lastCheckup: "May 11, 2025",
  },
  {
    id: 5,
    image: "https://img.daisyui.com/images/profile/demo/2@94.webp",
    patient: "Joralyn Cantero",
    age: "21",
    riskLevel: "High",
    lastCheckup: "May 10, 2025",
  },
  {
    id: 6,
    image: "https://img.daisyui.com/images/profile/demo/2@94.webp",
    patient: "Vevencio Gupana Jr.",
    age: "25",
    riskLevel: "Moderate",
    lastCheckup: "May 9, 2025",
  },
];

export const addPatientInputs = [
  {
    label: "Full Name",
    id: "fullName",
    type: "text",
    placeholder: "Enter patient's full name",
  },
  {
    label: "Age",
    id: "age",
    type: "number",
    placeholder: "Enter patient's age",
  },
  {
    label: "Sex",
    id: "sex",
    type: "select",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
    placeholder: "Select sex",
  },
  {
    label: "Is Diabetic?",
    id: "isDiabetic",
    type: "select",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    placeholder: "Select option",
  },
  {
    label: "Family History of Diabetes?",
    id: "familyDiabetic",
    type: "select",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    placeholder: "Select option",
  },
  {
    label: "Family History of Stroke?",
    id: "familyStroke",
    type: "select",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    placeholder: "Select option",
  },
  {
    label: "Lifestyle Factors",
    id: "lifestyleFactors",
    type: "text",
    placeholder: "e.g., smoking, exercise habits",
  },
];

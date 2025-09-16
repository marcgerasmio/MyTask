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
import { FaTasks } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";

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
    label: "Tasks List",
    path: "/tasks",
    icon: FaTasks,
  },
    {
    label: "Activities",
    path: "/activities",
    icon: FaCalendarAlt,
  },
  {
    label: "Users",
    path: "/users",
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
    title: "Total Tasks",
    icon: LuUsers,
    count: 100,
  },
  {
    id: 2,
    title: "Pending Tasks",
    icon: IoWarningOutline,
    count: 12,
  },
  {
    id: 3,
    title: "Due This Week",
    icon: IoCalendarClearOutline,
    count: 10,
  },
  {
    id: 4,
    title: "Total Completed",
    icon: FaArrowTrendUp,
    count: 50,
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

export const myEvents = [
  {
    id: 1,
    title: 'DTS STARTS',
    start: new Date(2025, 9, 13, 0, 0, 0),
    end: new Date(2025, 9, 13, 0, 0, 0)
  },
  {
    id: 2,
     title: 'DTS ENDS',
    start: new Date(2025, 9, 12, 0, 0, 0),
    end: new Date(2025, 9, 12, 0, 0, 0)
  },
  {
    id: 3,
    title: 'Conference',
    start: new Date(2025, 9, 15, 0, 0, 0),
    end: new Date(2025, 9, 15, 0, 0, 0)
  },
  {
    id: 4,
     title: 'Meeting',
    start: new Date(2025, 9, 20, 0, 0, 0),
    end: new Date(2025, 9, 20, 0, 0, 0)
  },
];


export const tasksDone = [
  {
    id: 1,
    name: "Marc Dominic Gerasmio",
    date: "September 15, 2025",
    task: "Campus Life Page Upgrade",
    image:"https://img.daisyui.com/images/profile/demo/4@94.webp",
    level: "Moderate",
  },
  {
    id: 2,
    name: "Marc Dominic Gerasmio",
    date: "September 11, 2025",
    task: "Alumni Life Page",
    image:"https://img.daisyui.com/images/profile/demo/4@94.webp",
    level: "Moderate",
  },
  {
    id: 3,
    name: "Marion Jotohot",
    date: "September 15, 2025",
    task: "Setup Backend",
    image:"https://img.daisyui.com/images/profile/demo/2@94.webp",
    level: "Low",
  },
  {
    id: 4,
    name: "Marion Jotohot",
    date: "September 15, 2025",
    task: "Create PubMat for SW",
    image:"https://img.daisyui.com/images/profile/demo/2@94.webp",
    level: "High",
  },
];


export const usersData = [
  {
    id: 1,
    name: "Marc Dominic Gerasmio",
    position: "Programmer I",
    email: "mdgerasmio@carsu.edu.ph",
    isAdmin: "No",
    image:"https://img.daisyui.com/images/profile/demo/2@94.webp",
  },
  {
    id: 2,
    name: "Cedrick Roa",
    position: "Photographer I",
    email: "caroa@carsu.edu.ph",
    isAdmin: "No",
    image:"https://img.daisyui.com/images/profile/demo/2@94.webp",
  },
  {
    id: 3,
    name: "Aquessa Piamonte",
    position: "Information Officer III",
    email: "arpiamonte@carsu.edu.ph",
    isAdmin: "Yes",
    image:"https://img.daisyui.com/images/profile/demo/4@94.webp",
  },

];

export const tasksData = [
  {
    id: 1,
    title: "Prepare monthly report",
    description: "Compile and analyze sales data for the monthly report.",
    status: "ongoing",
    assignedTo: 1,
    dueDate: "2025-09-20",
  },
  {
    id: 2,
    title: "Update client database",
    description: "Ensure all client records are up to date.",
    status: "completed",
    assignedTo: 2,
    dueDate: "2025-09-10",
  },
  {
    id: 3,
    title: "Design new marketing materials",
    description: "Create flyers and banners for the upcoming campaign.",
    status: "ongoing",
    assignedTo: 3,
    dueDate: "2025-09-25",
  },
  {
    id: 4,
    title: "Team meeting preparation",
    description: "Prepare agenda and slides for the weekly team meeting.",
    status: "pending",
    assignedTo: 1,
    dueDate: "2025-09-18",
  },
  {
    id: 5,
    title: "Review project proposal",
    description: "Go through the new project proposal and provide feedback.",
    status: "completed",
    assignedTo: 3,
    dueDate: "2025-09-12",
  },
    {
    id: 6,
    title: "Setup new workstations",
    description: "Go through the new project proposal and provide feedback.",
    status: "pending",
    assignedTo: 1,
    dueDate: "2025-09-12",
  },
];


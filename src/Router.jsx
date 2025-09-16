import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddPatient from "./pages/Patient/AddPatient";
import Profile from "./pages/Profile";
import Users from "./pages/Main/Users";
import Tasklists from "./pages/Main/TasksLists";
import EmployeeTasks from "./pages/Main/EmployeeTasks";
import NotFound from "./NotFound";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Tasklists/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/add" element={<AddPatient />} />
        <Route path="/" element={<Profile />} />
        <Route path="/employee/:id/tasks" element={<EmployeeTasks />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

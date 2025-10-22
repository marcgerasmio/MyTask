import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Main/Profile";
import Users from "./pages/Main/Users";
import Tasklists from "./pages/Main/TasksLists";
import EmployeeTasks from "./pages/Main/EmployeeTasks";
import NotFound from "./NotFound";
import ActivityList from "./pages/Main/Activities";
import UnAssigned from "./pages/Main/Unassigned";
import CourseRecommender from "./components/Course";
import NewsCards from "./components/NewsCards";
import Archive from "./pages/Main/TasksArchive";
import ForApproval from "./pages/Main/ForApproval";
import AdminTask from "./pages/Main/AdminTask";

//Employee Routes
import EmployeeDashboard from "./pages/Employee/Dashboard";
import Tasks from "./pages/Employee/Tasks";
import EmployeeActivity from "./pages/Employee/EmployeeActivity";



const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Tasklists/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/employee/tasks" element={<EmployeeTasks />} />
         <Route path="/activities" element={<ActivityList />} />
         <Route path="tasks-unassigned" element={< UnAssigned/>} />
         <Route path="tasks-archive" element={< Archive/>} />
          <Route path="tasks-approval" element={< ForApproval/>} />
          <Route path="/admin-tasks" element={< AdminTask/>} />

                  <Route path="/course" element={< CourseRecommender/>} />
                  <Route path="/news" element={<NewsCards/>}/>


        //Employee Routes

        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />\
        <Route path="/employee/tasklist" element={<Tasks />} />
        <Route path="/employee/activities" element={<EmployeeActivity />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

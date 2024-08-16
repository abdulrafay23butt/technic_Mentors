import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./Layput";
import Project from "./Admin/Project";
import AssignProject from "./Admin/AssignProject";
import Login from "./login"
import Signup from "./Signup";
import MemberDashboard from "./memberDashboard";
import Leave from "./leave";
import Fullview from './Admin/Fullview';
import AdminLayout from './Admin/adminLayout';
import AdminLeave from './Admin/adminleave';
import Todo from "./Todopage";
import Projects from "./projects";
import AdminProject from "./Admin/AdminProject.jsx";
function App() {
 
  return (

    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Layout" element={<Layout />}>
          <Route index element={<MemberDashboard />} />
          <Route path="leave" element={<Leave />} />
          <Route path="todo" element={<Todo />} />
          <Route path="project" element={<Projects />} />
        </Route>
        <Route path="/AdminLayout" element={<AdminLayout />}>
          <Route index element={<Project />} />
          <Route path="assign" element={<AssignProject />} />
          <Route path="Adminleave" element={<AdminLeave />} />
          <Route path="fullview" element={<Fullview />} />
          <Route path="AdminProject" element={<AdminProject />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
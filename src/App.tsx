import { Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import EmployeeDetails from "./Components/EmployeesDetail";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
// import Denied from "./Pages/Denied";
// import NotFound from "./Pages/NotFound";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        {/*admin route starts*/}
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/employee/:id" element={<EmployeeDetails/>} />
        {/*admin route ends*/}
        {/* <Route path="/denied" element={<Denied />} />
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  );
}

export default App;
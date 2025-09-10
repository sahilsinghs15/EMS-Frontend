import { Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import WaitingPage from "./Pages/WaitingPage";
import AdminDashboard from "./Pages/AdminDashboard";
import EmployeeDetails from "./Components/EmployeesDetail";
// import Denied from "./Pages/Denied";
// import NotFound from "./Pages/NotFound";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<WaitingPage />} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/employee/:id" element={<EmployeeDetails/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/denied" element={<Denied />} />
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  );
}

export default App;
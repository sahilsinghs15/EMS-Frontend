import { logout } from '../Redux/Slices/authSlice.reducer';
import { useEffect, useState } from 'react';
import { getEmployeeAsync } from '../Redux/Slices/employeeSlice.reducer';
import { useAppDispatch, useAppSelector } from '../Helpers/hooks';
import { useNavigate } from 'react-router-dom';

function EmployeeDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const employee = useAppSelector((state) => state.employees.currentEmployee);
  const {isLoggedIn} = useAppSelector((state)=> state.auth);
  const auth = useAppSelector((state) => state.auth.data);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'announcements'>('tasks');

  useEffect(() => {
    if (!isLoggedIn) {
        navigate("/");
      }else {
        dispatch(getEmployeeAsync());
      }
  }, [dispatch , isLoggedIn , navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="max-w-4xl mx-auto p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold tracking-wide text-blue-900">Employee Dashboard</h2>
          <div className="flex items-center gap-4">
            <button onClick={() => setProfileOpen(true)} className="bg-transparent border-none cursor-pointer">
              <span role="img" aria-label="profile" className="text-4xl text-blue-500">👤</span>
            </button>
            <button onClick={handleLogout} className="px-5 py-2 bg-gradient-to-r from-red-600 to-pink-400 text-white rounded-lg font-semibold text-lg shadow">Logout</button>
          </div>
        </div>
        <h3 className="text-2xl text-gray-800 mb-8">Welcome, {employee?.fullName || auth?.username || 'Employee'}!</h3>
        <div>
          <div className="flex gap-4 mb-6">
            <button onClick={() => setActiveTab('tasks')} className={`px-8 py-3 rounded-lg font-semibold text-lg border transition-colors duration-200 ${activeTab === 'tasks' ? 'bg-gradient-to-r from-cyan-200 to-pink-100 text-blue-900 border-blue-300' : 'bg-white text-gray-500 border-gray-300'}`}>Tasks</button>
            <button onClick={() => setActiveTab('announcements')} className={`px-8 py-3 rounded-lg font-semibold text-lg border transition-colors duration-200 ${activeTab === 'announcements' ? 'bg-gradient-to-r from-orange-200 to-yellow-100 text-blue-900 border-yellow-300' : 'bg-white text-gray-500 border-gray-300'}`}>Announcements</button>
          </div>
          {activeTab === 'tasks' && (
            <section className="bg-gradient-to-r from-blue-200 to-blue-100 p-6 rounded-xl shadow mb-6">
              <h4 className="text-xl text-blue-900 mb-4 font-semibold">Tasks</h4>
              <ul className="text-lg text-gray-700 space-y-2">
                <li>Complete onboarding documents</li>
                <li>Attend team meeting</li>
                <li>Submit weekly report</li>
              </ul>
            </section>
          )}
          {activeTab === 'announcements' && (
            <section className="bg-gradient-to-r from-pink-200 to-blue-100 p-6 rounded-xl shadow mb-6">
              <h4 className="text-xl text-blue-900 mb-4 font-semibold">Announcements</h4>
              <ul className="text-lg text-gray-700 space-y-2">
                <li>Company picnic on Friday</li>
                <li>New HR policies released</li>
                <li>Quarterly review next month</li>
              </ul>
            </section>
          )}
        </div>
        
        {profileOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-10 rounded-2xl min-w-[400px] shadow-2xl">
              <h3 className="mb-6 text-blue-500 text-2xl font-bold">Employee Profile</h3>
              <table className="w-full text-lg">
                <tbody>
                  <tr><td className="font-bold py-2 text-gray-700">Full Name</td><td className="py-2">{employee?.fullName || 'N/A'}</td></tr>
                  <tr><td className="font-bold py-2 text-gray-700">Email</td><td className="py-2">{employee?.contactInfo?.workEmail || auth?.email || 'N/A'}</td></tr>
                  <tr><td className="font-bold py-2 text-gray-700">Employee ID</td><td className="py-2">{employee?.employeeId || 'N/A'}</td></tr>
                  <tr><td className="font-bold py-2 text-gray-700">Department</td><td className="py-2">{employee?.employmentInfo?.department || 'N/A'}</td></tr>
                  <tr><td className="font-bold py-2 text-gray-700">Job Title</td><td className="py-2">{employee?.employmentInfo?.jobTitle || 'N/A'}</td></tr>
                  <tr><td className="font-bold py-2 text-gray-700">Status</td><td className="py-2">{employee?.employmentInfo?.status || 'N/A'}</td></tr>
                  <tr><td className="font-bold py-2 text-gray-700">Manager</td><td className="py-2">{employee?.employmentInfo?.manager || 'N/A'}</td></tr>
                  <tr><td className="font-bold py-2 text-gray-700">Hire Date</td><td className="py-2">{employee?.employmentInfo?.hireDate || 'N/A'}</td></tr>
                </tbody>
              </table>
              <button onClick={() => setProfileOpen(false)} className="mt-8 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-semibold text-lg">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
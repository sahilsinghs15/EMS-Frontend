import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
    createBulkEmployeesAsync,
    createManualEmployeeAsync,
    getAllEmployeesAsync,
    updateEmployeeAsync,
    deleteEmployeeAsync,
    IEmployee,
} from "../Redux/Slices/employeeSlice.reducer";
import { useAppDispatch, useAppSelector } from "../Helpers/hooks";
import { logout } from "../Redux/Slices/authSlice.reducer";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

type ManualFormType = Omit<IEmployee, "_id">;

const AdminDashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoggedIn } = useAppSelector((state) => state.auth);
    const role = useAppSelector((state) => state.auth.data?.role);
    const { employees, status, error } = useAppSelector((state) => state.employees);

    const [tab, setTab] = useState("manual");
    const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [showDropdown, setShowDropdown] = useState(false);

    const [manualForm, setManualForm] = useState<ManualFormType>({
        fullName: "",
        employeeId: "",
        dateOfBirth: "",
        gender: undefined,
        nationality: "",
        photoUrl: "",
        employmentInfo: {
            jobTitle: "",
            manager: undefined,
            department: "Web-Dev",
            hireDate: "",
            employmentType: "Full-time",
            status: "Active",
            terminationDate: undefined,
        },
        contactInfo: {
            homeAddress: "",
            personalPhoneNumber: "",
            workPhoneNumber: "",
            personalEmail: "",
            workEmail: "",
        },
        userAccount: "",
    });
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (!isLoggedIn) {
            toast.error("You are not logged in. Redirecting to login page.");
            navigate("/");
        } else if (role !== "ADMIN") {
            toast.error("Access denied. Redirecting to Employee Dashboard.");
            navigate("/employee");
        } else {
            dispatch(getAllEmployeesAsync());
        }
    }, [dispatch, isLoggedIn, role, navigate]);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate("/");
    };

    const handleDownloadExcel = async (filteredEmployees: IEmployee[]) => {
        if (filteredEmployees.length === 0) {
            toast.error("No data available to export.");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Employees");

        worksheet.columns = [
            { header: "Full Name", key: "fullName", width: 20 },
            { header: "Employee ID", key: "employeeId", width: 15 },
            { header: "Job Title", key: "jobTitle", width: 20 },
            { header: "Department", key: "department", width: 15 },
            { header: "Hire Date", key: "hireDate", width: 15 },
            { header: "Work Email", key: "workEmail", width: 25 },
            { header: "Date Of Birth", key: "dateOfBirth", width: 25 },
            { header: "Gender", key: "gender", width: 25 },
            { header: "Nationality", key: "nationality", width: 25 },
            { header: "Photo Url", key: "photoUrl", width: 25 },
            { header: "Manager", key: "manager", width: 25 },
            { header: "Employment Type", key: "employmentType", width: 25 },
            { header: "Status", key: "status", width: 25 },
            { header: "Termination Date", key: "terminationDate", width: 25 },
            { header: "Home Address", key: "homeAddress", width: 25 },
            { header: "Personal Phone Number", key: "personalPhoneNumber", width: 25 },
            { header: "Work Phone Number", key: "workPhoneNumber", width: 25 },
            { header: "Personal Email", key: "personalEmail", width: 25 },
            { header: "User Account", key: "userAccount", width: 25 },
        ];

        filteredEmployees.forEach((emp) => {
            worksheet.addRow({
                fullName: emp.fullName,
                employeeId: emp.employeeId,
                jobTitle: emp.employmentInfo.jobTitle,
                department: emp.employmentInfo.department,
                hireDate: new Date(emp.employmentInfo.hireDate).toLocaleDateString(),
                workEmail: emp.contactInfo.workEmail,
                dateOfBirth: emp.dateOfBirth,
                gender: emp.gender,
                nationality: emp.nationality,
                photoUrl: emp.photoUrl,
                manager: emp.employmentInfo.manager ?? "",
                employmentType: emp.employmentInfo.employmentType,
                status: emp.employmentInfo.status,
                terminationDate: emp.employmentInfo.terminationDate ?? "",
                homeAddress: emp.contactInfo.homeAddress,
                personalPhoneNumber: emp.contactInfo.personalPhoneNumber ?? "",
                workPhoneNumber: emp.contactInfo.workPhoneNumber,
                personalEmail: emp.contactInfo.personalEmail ?? "",
                userAccount: emp.userAccount,
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "employees.xlsx");
    };


    const handleDownloadCSV = async (filteredEmployees: IEmployee[]) => {
        if (filteredEmployees.length === 0) {
            toast.error("No data available to export.");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Employees");

        worksheet.columns = [
            { header: "Full Name", key: "fullName", width: 20 },
            { header: "Employee ID", key: "employeeId", width: 15 },
            { header: "Job Title", key: "jobTitle", width: 20 },
            { header: "Department", key: "department", width: 15 },
            { header: "Hire Date", key: "hireDate", width: 15 },
            { header: "Work Email", key: "workEmail", width: 25 },
            { header: "Date Of Birth", key: "dateOfBirth", width: 25 },
            { header: "Gender", key: "gender", width: 25 },
            { header: "Nationality", key: "nationality", width: 25 },
            { header: "Photo Url", key: "photoUrl", width: 25 },
            { header: "Manager", key: "manager", width: 25 },
            { header: "Employment Type", key: "employmentType", width: 25 },
            { header: "Status", key: "status", width: 25 },
            { header: "Termination Date", key: "terminationDate", width: 25 },
            { header: "Home Address", key: "homeAddress", width: 25 },
            { header: "Personal Phone Number", key: "personalPhoneNumber", width: 25 },
            { header: "Work Phone Number", key: "workPhoneNumber", width: 25 },
            { header: "Personal Email", key: "personalEmail", width: 25 },
            { header: "User Account", key: "userAccount", width: 25 },
        ];

        filteredEmployees.forEach((emp) => {
            worksheet.addRow({
                fullName: emp.fullName,
                employeeId: emp.employeeId,
                jobTitle: emp.employmentInfo.jobTitle,
                department: emp.employmentInfo.department,
                hireDate: new Date(emp.employmentInfo.hireDate).toLocaleDateString(),
                workEmail: emp.contactInfo.workEmail,
                dateOfBirth: emp.dateOfBirth,
                gender: emp.gender,
                nationality: emp.nationality,
                photoUrl: emp.photoUrl,
                manager: emp.employmentInfo.manager ?? "",
                employmentType: emp.employmentInfo.employmentType,
                status: emp.employmentInfo.status,
                terminationDate: emp.employmentInfo.terminationDate ?? "",
                homeAddress: emp.contactInfo.homeAddress,
                personalPhoneNumber: emp.contactInfo.personalPhoneNumber ?? "",
                workPhoneNumber: emp.contactInfo.workPhoneNumber,
                personalEmail: emp.contactInfo.personalEmail ?? "",
                userAccount: emp.userAccount,
            });
        });

        const csvBuffer = await workbook.csv.writeBuffer();
        const blob = new Blob([csvBuffer], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "employees.csv");
    };


    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setManualForm((prev) => ({
                ...prev,
                [parent]: {
                    ...(prev)[parent],
                    [child]: value,
                },
            }));
        } else {
            setManualForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const resetForm = () => {
        setManualForm({
            fullName: "",
            employeeId: "",
            dateOfBirth: "",
            gender: undefined,
            nationality: "",
            photoUrl: "",
            employmentInfo: {
                jobTitle: "",
                manager: undefined,
                department: "Web-Dev",
                hireDate: "",
                employmentType: "Full-time",
                status: "Active",
                terminationDate: undefined,
            },
            contactInfo: {
                homeAddress: "",
                personalPhoneNumber: "",
                workPhoneNumber: "",
                personalEmail: "",
                workEmail: "",
            },
            userAccount: "",
        });
        setEditingEmployeeId(null);
    };

    const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingEmployeeId) {
            dispatch(updateEmployeeAsync({ id: editingEmployeeId, data: manualForm }));
        } else {
            dispatch(createManualEmployeeAsync(manualForm));
        }
        resetForm();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleBulkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (file) {
            dispatch(createBulkEmployeesAsync(file));
            setFile(null);
            e.currentTarget.reset();
        } else {
            toast.error("Please select a file to upload.");
        }
    };

    const handleEdit = (employee: IEmployee) => {
        setEditingEmployeeId(employee._id);
        setManualForm({ ...employee });
        setTab("manual");
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            dispatch(deleteEmployeeAsync(id));
        }
    };

    const renderStatus = () => {
        if (status === "loading") {
            return (
                <div className="flex justify-center items-center py-4">
                    <span className="text-gray-600">Loading...</span>
                </div>
            );
        }
        if (status === "failed" && error) {
            return (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            );
        }
        return null;
    };

    const filteredEmployees = employees.filter((employee) => {
        const hireDate = new Date(employee.employmentInfo.hireDate).getTime();
        const start = startDate ? new Date(startDate).getTime() : null;
        const end = endDate ? new Date(endDate).getTime() : null;

        if (start && hireDate < start) return false;
        if (end && hireDate > end) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-6">
                Admin Dashboard
            </h1>

            <button
                onClick={handleLogout}
                className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition mb-4 ml-6"
            >
                Logout
            </button>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-6xl mx-auto">

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`py-2 px-4 font-semibold text-lg rounded-t-lg ${
                            tab === "manual" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setTab("manual")}
                    >
                        Manual Entry
                    </button>
                    <button
                        className={`ml-4 py-2 px-4 font-semibold text-lg rounded-t-lg ${
                            tab === "bulk" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setTab("bulk")}
                    >
                        Bulk Upload
                    </button>
                </div>
                
                {/* Manual Form */}
                {tab === "manual" && (
                    <form onSubmit={handleManualSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {editingEmployeeId ? "Update Employee" : "Add New Employee"}
                        </h2>

                        {/* Personal Info */}
                        <div>
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                Personal Information
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={manualForm.fullName}
                                    onChange={handleManualChange}
                                    placeholder="Full Name"
                                    required
                                    className="p-3 border rounded-lg"
                                />
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={manualForm.employeeId}
                                    onChange={handleManualChange}
                                    placeholder="Employee ID"
                                    required
                                    className="p-3 border rounded-lg"
                                />
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={manualForm.dateOfBirth}
                                    onChange={handleManualChange}
                                    required
                                    className="p-3 border rounded-lg"
                                />
                                <select
                                    name="gender"
                                    value={manualForm.gender ?? ""}
                                    onChange={handleManualChange}
                                    required
                                    className="p-3 border rounded-lg"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <input
                                    type="text"
                                    name="nationality"
                                    value={manualForm.nationality}
                                    onChange={handleManualChange}
                                    placeholder="Nationality"
                                    required
                                    className="p-3 border rounded-lg"
                                />
                                {/* Optional Photo */}
                                <input
                                    type="text"
                                    name="photoUrl"
                                    value={manualForm.photoUrl}
                                    onChange={handleManualChange}
                                    placeholder="Photo URL (optional)"
                                    className="p-3 border rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                Contact Information
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    name="contactInfo.homeAddress"
                                    value={manualForm.contactInfo.homeAddress}
                                    onChange={handleManualChange}
                                    placeholder="Home Address"
                                    required
                                    className="p-3 border rounded-lg"
                                />
                                <input
                                    type="tel"
                                    name="contactInfo.workPhoneNumber"
                                    value={manualForm.contactInfo.workPhoneNumber}
                                    onChange={handleManualChange}
                                    placeholder="Work Phone"
                                    required
                                    className="p-3 border rounded-lg"
                                />
                                <input
                                    type="email"
                                    name="contactInfo.workEmail"
                                    value={manualForm.contactInfo.workEmail}
                                    onChange={handleManualChange}
                                    placeholder="Work Email"
                                    required
                                    className="p-3 border rounded-lg"
                                />
                                {/* Optional Contact */}
                                <input
                                    type="tel"
                                    name="contactInfo.personalPhoneNumber"
                                    value={manualForm.contactInfo.personalPhoneNumber}
                                    onChange={handleManualChange}
                                    placeholder="Personal Phone (optional)"
                                    className="p-3 border rounded-lg"
                                />
                                <input
                                    type="email"
                                    name="contactInfo.personalEmail"
                                    value={manualForm.contactInfo.personalEmail}
                                    onChange={handleManualChange}
                                    placeholder="Personal Email (optional)"
                                    className="p-3 border rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Employment Info */}
                        <div>
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                Employment Information
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    name="employmentInfo.jobTitle"
                                    value={manualForm.employmentInfo.jobTitle}
                                    onChange={handleManualChange}
                                    placeholder="Job Title"
                                    required
                                    className="p-3 border rounded-lg"
                                />
                                <select
                                    name="employmentInfo.department"
                                    value={manualForm.employmentInfo.department}
                                    onChange={handleManualChange}
                                    required
                                    className="p-3 border rounded-lg"
                                >
                                    <option value="Web-Dev">Web-Dev</option>
                                    <option value="Mobile-Dev">Mobile-Dev</option>
                                    <option value="Data-Analyst">Data-Analyst</option>
                                    <option value="HR">HR</option>
                                </select>
                                <input
                                    type="date"
                                    name="employmentInfo.hireDate"
                                    value={manualForm.employmentInfo.hireDate}
                                    onChange={handleManualChange}
                                    required
                                    className="p-3 border rounded-lg"
                                />
                                <select
                                    name="employmentInfo.employmentType"
                                    value={manualForm.employmentInfo.employmentType ?? ""}
                                    onChange={handleManualChange}
                                    required
                                    className="p-3 border rounded-lg"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Intern">Intern</option>
                                </select>
                                <select
                                    name="employmentInfo.status"
                                    value={manualForm.employmentInfo.status ?? ""}
                                    onChange={handleManualChange}
                                    required
                                    className="p-3 border rounded-lg"
                                >
                                    <option value="Active">Active</option>
                                    <option value="On Leave">On Leave</option>
                                    <option value="Terminated">Terminated</option>
                                </select>
                                {/* Optional Manager */}
                                <input
                                    type="text"
                                    name="employmentInfo.manager"
                                    value={manualForm.employmentInfo.manager ?? ""}
                                    onChange={handleManualChange}
                                    placeholder="Manager ID (optional)"
                                    className="p-3 border rounded-lg"
                                />
                            </div>
                        </div>

                        {/* User Account */}
                        <div>
                            <input
                                type="text"
                                name="userAccount"
                                value={manualForm.userAccount}
                                onChange={handleManualChange}
                                placeholder="User Account ID"
                                required
                                className="p-3 border rounded-lg w-full"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition"
                            >
                                {editingEmployeeId ? "Update Employee" : "Add Employee"}
                            </button>
                            {editingEmployeeId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-400 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-500 transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                )}

                {/* Bulk Upload */}
                {tab === "bulk" && (
                    <form onSubmit={handleBulkSubmit} className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Bulk Upload</h2>
                        <input type="file" onChange={handleFileChange} accept=".xlsx,.csv" />
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                            Upload File
                        </button>
                    </form>
                )}

                {/* Date Filters and Export  */}
                <div className="flex flex-col md:flex-row gap-4 items-end mt-12">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 border rounded-lg"
                        />
                    </div>

                    {/* Export Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            Download ▼
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
                                <button
                                    onClick={() => handleDownloadExcel(filteredEmployees)}
                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                >
                                    Excel (.xlsx)
                                </button>
                                <button
                                    onClick={() => handleDownloadCSV(filteredEmployees)}
                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                >
                                    CSV (.csv)
                                </button>
                            </div>
                        )}
                    </div>
                </div>


                {/* Employee List */}
                <hr className="my-2" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">All Employees</h2>
                {renderStatus()}
                {status === "succeeded" && (
                    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Full Name</th>
                                    <th className="px-6 py-3">Employee ID</th>
                                    <th className="px-6 py-3">Job Title</th>
                                    <th className="px-6 py-3">Department</th>
                                    <th className="px-6 py-3">Hire Date</th>
                                    <th className="px-6 py-3">Work Email</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredEmployees.map((employee) => (
                                    <tr key={employee._id}>
                                        <td
                                            onClick={() => navigate(`/employee/${employee._id}`)}
                                            className="px-6 py-4 text-indigo-600 font-semibold cursor-pointer hover:underline"
                                        >
                                            {employee.fullName}
                                        </td>
                                        <td className="px-6 py-4">{employee.employeeId}</td>
                                        <td className="px-6 py-4">{employee.employmentInfo.jobTitle}</td>
                                        <td className="px-6 py-4">{employee.employmentInfo.department}</td>
                                        <td className="px-6 py-4">
                                            {new Date(employee.employmentInfo.hireDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">{employee.contactInfo.workEmail}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(employee)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(employee._id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

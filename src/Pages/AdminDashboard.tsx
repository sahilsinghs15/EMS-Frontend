import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
    createBulkEmployeesAsync,
    createManualEmployeeAsync,
    getAllEmployeesAsync,
    IEmployee,
} from "../Redux/Slices/employeeSlice.reducer";
import { useAppDispatch, useAppSelector } from "../Helpers/hooks";

type ManualFormType = Omit<IEmployee, "_id" | "userAccount"> & { userAccount?: string };

const AdminDashboard = () => {
    const dispatch = useAppDispatch();
    const { employees, status, error } = useAppSelector((state) => state.employees);

    const [tab, setTab] = useState("manual");
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
        dispatch(getAllEmployeesAsync());
    }, [dispatch]);

    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setManualForm((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setManualForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(createManualEmployeeAsync(manualForm));
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

    const renderStatus = () => {
        if (status === "loading") {
            return (
                <div className="flex justify-center items-center py-4">
                    <svg
                        className="animate-spin h-8 w-8 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 
                               0 5.373 0 12h4zm2 5.291A7.962 
                               7.962 0 014 12H0c0 3.042 
                               1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <span className="ml-2 text-gray-600">Loading...</span>
                </div>
            );
        }
        if (status === "failed" && error) {
            return (
                <div
                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg"
                    role="alert"
                >
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-6">
                Admin Dashboard
            </h1>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-6xl mx-auto">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`py-2 px-4 font-semibold text-lg rounded-t-lg ${
                            tab === "manual"
                                ? "border-b-2 border-indigo-600 text-indigo-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setTab("manual")}
                    >
                        Manual Entry
                    </button>
                    <button
                        className={`ml-4 py-2 px-4 font-semibold text-lg rounded-t-lg ${
                            tab === "bulk"
                                ? "border-b-2 border-indigo-600 text-indigo-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setTab("bulk")}
                    >
                        Bulk Upload
                    </button>
                </div>

                {/* Manual Form */}
                {tab === "manual" && (
                    <form onSubmit={handleManualSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Add New Employee</h2>

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

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        >
                            Add Employee
                        </button>
                    </form>
                )}

                {/* Bulk Upload */}
                {tab === "bulk" && (
                    <form onSubmit={handleBulkSubmit} className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Bulk Upload</h2>
                        <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".xlsx,.csv"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                                           file:rounded-full file:border-0 file:text-sm file:font-semibold 
                                           file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            Supported formats: .xlsx, .csv
                        </p>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        >
                            Upload File
                        </button>
                    </form>
                )}

                {/* Employee List */}
                <hr className="my-8" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">All Employees</h2>
                {renderStatus()}
                {status === "succeeded" && (
                    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Full Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Employee ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Job Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Work Email
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {employees.map((employee) => (
                                    <tr key={employee._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {employee.fullName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.employeeId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.employmentInfo.jobTitle}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.employmentInfo.department}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.contactInfo.workEmail}
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

import React, { useEffect } from "react";
import { findEmployeeByIdAsync } from "../Redux/Slices/employeeSlice.reducer";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../Helpers/hooks";

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { currentEmployee, status } = useAppSelector(
    (state) => state.employees
  );

  useEffect(() => {
    if (id) dispatch(findEmployeeByIdAsync(id));
  }, [dispatch, id]);

  if (status === "loading") {
    return <div className="p-6">Loading employee details...</div>;
  }

  if (!currentEmployee) {
    return <div className="p-6">Employee not found.</div>;
  }

  const emp = currentEmployee;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{emp.fullName}</h2>
      <div className="space-y-3">
        <p><strong>Employee ID:</strong> {emp.employeeId}</p>
        <p><strong>Date of Birth:</strong> {emp.dateOfBirth}</p>
        <p><strong>Gender:</strong> {emp.gender}</p>
        <p><strong>Nationality:</strong> {emp.nationality}</p>
        <p><strong>Job Title:</strong> {emp.employmentInfo.jobTitle}</p>
        <p><strong>Department:</strong> {emp.employmentInfo.department}</p>
        <p><strong>Hire Date:</strong> {emp.employmentInfo.hireDate}</p>
        <p><strong>Employment Type:</strong> {emp.employmentInfo.employmentType}</p>
        <p><strong>Status:</strong> {emp.employmentInfo.status}</p>
        <p><strong>Work Email:</strong> {emp.contactInfo.workEmail}</p>
        <p><strong>Work Phone:</strong> {emp.contactInfo.workPhoneNumber}</p>
        <p><strong>Home Address:</strong> {emp.contactInfo.homeAddress}</p>
      </div>
    </div>
  );
};

export default EmployeeDetails;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";
import { isAxiosError } from "axios";

export interface IEmployee {
	_id: string;
	fullName: string;
	employeeId: string;
	dateOfBirth?: string;
	gender?: "Male" | "Female" | "Other";
	nationality?: string;
	photoUrl?: string;
	employmentInfo: {
		jobTitle: string;
		manager?: string;
		department?: "Web-Dev" | "Mobile-Dev" | "Data-Analyst" | "HR";
		hireDate: string;
		employmentType: "Full-time" | "Part-time" | "Contract" | "Intern";
		status: "Active" | "On Leave" | "Terminated";
		terminationDate?: string;
	};
	contactInfo: {
		homeAddress?: string;
		personalPhoneNumber?: string;
		workPhoneNumber?: string;
		personalEmail?: string;
		workEmail: string;
	};
	userAccount?: string;
}

interface ICreateEmployeeResponse {
	success: boolean;
	message: string;
	employee?: IEmployee;
	employees?: IEmployee[];
}

interface IGetAllEmployeesResponse {
	success: boolean;
	message: string;
	employees: IEmployee[];
}

interface IGetEmployeeResponse {
	success: boolean;
	message: string;
	employee: IEmployee;
}

interface IUpdateEmployeeResponse {
	success: boolean;
	message: string;
	employee: IEmployee;
}

interface IDeleteEmployeeResponse {
	success: boolean;
	message: string;
}

export interface EmployeeState {
	employees: IEmployee[];
	currentEmployee: IEmployee | null;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

const initialState: EmployeeState = {
	employees: [],
	currentEmployee: null,
	status: "idle",
	error: null,
};

const handleAsyncError = (error: unknown) => {
	if (isAxiosError(error) && error.response) {
		return error.response.data.message || "An unknown error occurred";
	}
	return "An unknown error occurred";
};

export const createManualEmployeeAsync = createAsyncThunk(
	"employees/createManualEmployee",
	async (
		payload: Omit<IEmployee, "_id" | "employmentInfo" | "contactInfo"> & {
			employmentInfo: IEmployee["employmentInfo"];
			contactInfo: IEmployee["contactInfo"];
		},
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.post<ICreateEmployeeResponse>(
				"/employee/create",
				payload
			);
			toast.success(response.data.message);
			return [response.data.employee as IEmployee];
		} catch (error: unknown) {
			toast.error(handleAsyncError(error));
			return rejectWithValue(handleAsyncError(error));
		}
	}
);

export const createBulkEmployeesAsync = createAsyncThunk(
	"employees/createBulkEmployees",
	async (file: File, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await axiosInstance.post<ICreateEmployeeResponse>(
				"/employee/create/bulk",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			toast.success(response.data.message);
			return response.data.employees || [];
		} catch (error: unknown) {
			toast.error(handleAsyncError(error));
			return rejectWithValue(handleAsyncError(error));
		}
	}
);

export const getAllEmployeesAsync = createAsyncThunk(
	"employees/getAllEmployees",
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get<IGetAllEmployeesResponse>(
				"/employee/all"
			);
			return response.data.employees;
		} catch (error: unknown) {
			toast.error(handleAsyncError(error));
			return rejectWithValue(handleAsyncError(error));
		}
	}
);
// UserOnly
export const getEmployeeAsync = createAsyncThunk(
	"employees/getEmployee",
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get<IGetEmployeeResponse>(
				"/employee/"
			);
			return response.data.employee;
		} catch (error: unknown) {
			toast.error(handleAsyncError(error));
			return rejectWithValue(handleAsyncError(error));
		}
	}
);

export const findEmployeeByIdAsync = createAsyncThunk(
	"employees/findEmployeeById",
	async (id: string, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get<IGetEmployeeResponse>(
				`/employee/${id}`
			);
			return response.data.employee;
		} catch (error: unknown) {
			toast.error(handleAsyncError(error));
			return rejectWithValue(handleAsyncError(error));
		}
	}
);

export const updateEmployeeAsync = createAsyncThunk(
	"employees/updateEmployee",
	async (
		{ id, data }: { id: string; data: Partial<IEmployee> },
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.patch<IUpdateEmployeeResponse>(
				`/employee/${id}`,
				data
			);
			toast.success(response.data.message);
			return response.data.employee;
		} catch (error: unknown) {
			toast.error(handleAsyncError(error));
			return rejectWithValue(handleAsyncError(error));
		}
	}
);

// Async thunk for deleting an employee by ID (Admin-only)
export const deleteEmployeeAsync = createAsyncThunk(
	"employees/deleteEmployee",
	async (id: string, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.delete<IDeleteEmployeeResponse>(
				`/employee/${id}`
			);
			toast.success(response.data.message);
			return id;
		} catch (error: unknown) {
			toast.error(handleAsyncError(error));
			return rejectWithValue(handleAsyncError(error));
		}
	}
);

const employeeSlice = createSlice({
	name: "employees",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Handle all thunk actions
		[
			createManualEmployeeAsync,
			createBulkEmployeesAsync,
			getAllEmployeesAsync,
			getEmployeeAsync,
			findEmployeeByIdAsync,
			updateEmployeeAsync,
			deleteEmployeeAsync,
		].forEach((action) => {
			builder
				.addCase(action.pending, (state) => {
					state.status = "loading";
					state.error = null;
				})
				.addCase(action.rejected, (state, action) => {
					state.status = "failed";
					state.error = action.payload as string;
				});
		});

		builder
			.addCase(
				createManualEmployeeAsync.fulfilled,
				(state, action: PayloadAction<IEmployee[]>) => {
					state.status = "succeeded";
					state.employees.push(...action.payload);
				}
			)
			.addCase(
				createBulkEmployeesAsync.fulfilled,
				(state, action: PayloadAction<IEmployee[]>) => {
					state.status = "succeeded";
					state.employees.push(...action.payload);
				}
			)
			.addCase(
				getAllEmployeesAsync.fulfilled,
				(state, action: PayloadAction<IEmployee[]>) => {
					state.status = "succeeded";
					state.employees = action.payload;
				}
			)
			.addCase(
				getEmployeeAsync.fulfilled,
				(state, action: PayloadAction<IEmployee>) => {
					state.status = "succeeded";
					state.currentEmployee = action.payload;
				}
			)
			.addCase(
				findEmployeeByIdAsync.fulfilled,
				(state, action: PayloadAction<IEmployee>) => {
					state.status = "succeeded";
					state.currentEmployee = action.payload;
				}
			)
			.addCase(
				updateEmployeeAsync.fulfilled,
				(state, action: PayloadAction<IEmployee>) => {
					state.status = "succeeded";
					state.currentEmployee = action.payload;
					const index = state.employees.findIndex(
						(emp) => emp._id === action.payload._id
					);
					if (index !== -1) {
						state.employees[index] = action.payload;
					}
				}
			)
			.addCase(
				deleteEmployeeAsync.fulfilled,
				(state, action: PayloadAction<string>) => {
					state.status = "succeeded";
					state.employees = state.employees.filter(
						(emp) => emp._id !== action.payload
					);
					state.currentEmployee = null;
				}
			);
	},
});

export default employeeSlice.reducer;

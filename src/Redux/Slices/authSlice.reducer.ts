import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";
import { isAxiosError } from "axios";

export interface UserData {
	_id: string;
	username: string;
	email: string;
	role: "USER" | "DEVELOPER" | "TEAMLEAD" | "HR" | "ADMIN";
	isVerified: boolean;
}

export interface SignupData {
	username: string;
	email: string;
	password: string;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface AuthState {
	isLoggedIn: boolean;
	data: UserData | null;
}

const storedData = localStorage.getItem("data");
const initialState: AuthState = {
	isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
	data:
		storedData && storedData !== "undefined" ? JSON.parse(storedData) : null,
};

export const createAccount = createAsyncThunk(
	"auth/createAccount",
	async (data: SignupData, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post("/user/signup", data);
			toast.success(response.data?.message || "Account created successfully");
			return response.data;
		} catch (error: unknown) {
			if (isAxiosError(error) && error.response) {
				toast.error(error.response.data?.message || "Failed to create account");
				return rejectWithValue(error.response.data);
			}
			toast.error("An unknown error occurred");
			return rejectWithValue({ message: "An unknown error occurred" });
		}
	}
);

export const login = createAsyncThunk(
	"auth/login",
	async (data: LoginData, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post("/user/login", data);
			toast.success(response.data?.message || "Login successful");
			return response.data?.user;
		} catch (error: unknown) {
			if (isAxiosError(error) && error.response) {
				toast.error(error.response.data?.message || "Failed to login");
				return rejectWithValue(error.response.data);
			}
			toast.error("An unknown error occurred");
			return rejectWithValue({ message: "An unknown error occurred" });
		}
	}
);

export const logout = createAsyncThunk(
	"auth/logout",
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post("/user/logout");
			toast.success(response.data?.message || "Logout successful");
			return response.data;
		} catch (error: unknown) {
			if (isAxiosError(error) && error.response) {
				toast.error(error.response.data?.message || "Failed to logout");
				return rejectWithValue(error.response.data);
			}
			toast.error("An unknown error occurred");
			return rejectWithValue({ message: "An unknown error occurred" });
		}
	}
);

export const updateUser = createAsyncThunk(
	"auth/updateUser",
	async (profileData: Partial<UserData>, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.put("/user/update", profileData);
			toast.success(response.data?.message || "Profile updated successfully");
			return response.data?.user;
		} catch (error: unknown) {
			if (isAxiosError(error) && error.response) {
				toast.error(error.response.data?.message || "Failed to update profile");
				return rejectWithValue(error.response.data);
			}
			toast.error("An unknown error occurred");
			return rejectWithValue({ message: "An unknown error occurred" });
		}
	}
);

// Get user data thunk
export const getUserData = createAsyncThunk(
	"auth/getUserData",
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get("/user/me");
			return response.data?.user;
		} catch (error: unknown) {
			if (isAxiosError(error) && error.response) {
				toast.error(
					error.response.data?.message || "Failed to fetch user data"
				);
				return rejectWithValue(error.response.data);
			}
			toast.error("An unknown error occurred");
			return rejectWithValue({ message: "An unknown error occurred" });
		}
	}
);

// Auth slice
const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Login fulfilled
			.addCase(login.fulfilled, (state, action: PayloadAction<UserData>) => {
				localStorage.setItem("data", JSON.stringify(action.payload));
				localStorage.setItem("isLoggedIn", "true");
				state.isLoggedIn = true;
				state.data = action.payload;
			})
			// Logout fulfilled
			.addCase(logout.fulfilled, (state) => {
				localStorage.clear();
				state.data = null;
				state.isLoggedIn = false;
			})
			// Fetch user data fulfilled
			.addCase(
				getUserData.fulfilled,
				(state, action: PayloadAction<UserData>) => {
					if (!action.payload) return;
					localStorage.setItem("data", JSON.stringify(action.payload));
					localStorage.setItem("isLoggedIn", "true");
					state.isLoggedIn = true;
					state.data = action.payload;
				}
			)
			//Update user profile data fullfilled
			.addCase(
				updateUser.fulfilled,
				(state, action: PayloadAction<UserData>) => {
					if (!action.payload) return;
					localStorage.setItem("data", JSON.stringify(action.payload));
					localStorage.setItem("isLoggedIn", "true");
					state.isLoggedIn = true;
					state.data = action.payload;
				}
			);
	},
});

export default authSlice.reducer;

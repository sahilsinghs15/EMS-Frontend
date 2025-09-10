import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slices/authSlice.reducer";
import employeeSliceReducer from "./Slices/employeeSlice.reducer";

const store = configureStore({
	reducer: {
		auth: authSliceReducer,
		employees: employeeSliceReducer,
	},

	devTools: true,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

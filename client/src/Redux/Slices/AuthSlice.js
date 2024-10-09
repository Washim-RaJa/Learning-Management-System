import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from '../../Helpers/axiosInstance.js'
const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || '',
    data: JSON.parse(localStorage.getItem('data')) || {}
}
// "/auth/signup" string uniquely identifies our signup thunk
export const createAccount = createAsyncThunk("/auth/signup", async (data)=> {
    try {
        const res = axiosInstance.post('user/register', data);
        toast.promise(res, {
            loading: "Please wait! Creating your account",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to create account"
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})
// "/auth/login" string uniquely identifies our login thunk
export const login = createAsyncThunk("/auth/login", async (data)=> {
    try {
        const res = axiosInstance.post('user/login', data);
        toast.promise(res, {
            loading: "Please wait! authentication in progress...",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to log in"
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})
// "/auth/logout" string uniquely identifies our logout thunk
export const logout = createAsyncThunk('auth/logout', async ()=>{
    try {
        const res = axiosInstance.get("user/logout");
        toast.promise(res, {
            loading: "Logging out please wait!",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to Log out"
        })
        return (await res).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})
// "/user/update/profile" string uniquely identifies our updateProfile thunk
export const updateProfile = createAsyncThunk("/user/update/profile", async (data)=> {
    try {
        const res = axiosInstance.put(`user/update/${data[0]}`, data[1]);
        toast.promise(res, {
            loading: "Please wait! profile update in progress...",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to update profile"
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})
// "/user/details" string uniquely identifies our getUserData thunk
export const getUserData = createAsyncThunk("/user/details", async ()=> {
    try {
        const res = axiosInstance.get("user/me");
        return (await res).data;
    } catch (error) {
        toast.error(error?.message)
    }
})
export const changePassword = createAsyncThunk("auth/changePassword", async (data)=> {
    try {
        const response = axiosInstance.post('/user/change-password', data);
        toast.promise(response, {
            loading: "Changing your password, please wait..!",
            success: (data)=> data?.data?.message,
            error: "Failed to change your password"
        })
        return (await response).data
    } catch (error) {
        toast.error(error?.message)
    }
})
export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email) => {
    try {
        
        const response = axiosInstance.post('/user/reset', { email });
        console.log(email);
        toast.promise(response, {
            loading: "Sending password token to your email, please wait..!",
            success: (data)=> data?.data?.message,
            error: "Failed to send password token to your email"
        })
        return (await response).data
    } catch (error) {
        toast.error(error?.message)
    }
})
export const resetPasswordToken = createAsyncThunk("auth/resetPasswordToken", async (data)=> {
    try {
        const { confirmNewPassword, resetToken} = data;
        const response = axiosInstance.post(`/user/reset/${resetToken}`, {password: confirmNewPassword});
        toast.promise(response, {
            loading: "Resetting your new password, please wait.!",
            success: (data)=> data?.data?.message,
            error: "Failed to reset your password"
        })
        return (await response).data
    } catch (error) {
        toast.error(error?.message)
    }
})
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder
            .addCase(login.fulfilled, (state, action)=>{
                if (!action.payload) {
                    return
                }
                // This data will fetch when app reloads
                localStorage.setItem('data', JSON.stringify(action?.payload?.user));
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('role', action?.payload?.user?.role)
                // This is for updating the state imidiately after login for current session
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role
            })
            .addCase(logout.fulfilled, (state)=>{
                localStorage.removeItem('data');
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('role')
                // This is for updating the state imidiately after log out for current session
                state.data = {};
                state.isLoggedIn = false;
                state.role = ''
            })
            .addCase(getUserData.fulfilled, (state, action)=> {
                // This data will fetch when app reloads
                localStorage.setItem('data', JSON.stringify(action?.payload?.user));
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('role', action?.payload?.user?.role)
                // This is for updating the state imidiately after login for current session
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role
            })
    }
})

// export const {} = authSlice.actions;

export default authSlice.reducer;
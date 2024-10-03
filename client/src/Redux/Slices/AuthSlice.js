import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || '',
    data: localStorage.getItem('data') || {}
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // logout: (state, action)=>{
        //     state.isLoggedIn = false
        // }
    }
})

// export const {} = authSlice.actions;

export default authSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

import axiosInstance from "../../Helpers/axiosInstance"

const initialState = {
    courseData: []
}
export const getAllCourses = createAsyncThunk('courses/get', async () => {
    try {
        const res = axiosInstance.get('courses')
        toast.promise(res, {
            loading: "Fethcing courses, please wait..!",
            success: "Course loaded successfully!",
            error: "Failed to load courses"
        })
        return (await res).data.courses
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})
export const createNewCourse = createAsyncThunk('course/create', async(data)=>{
    try {
        const formData = new FormData();
        formData.append("title", data?.title)
        formData.append("description", data?.description)
        formData.append("category", data?.category)
        formData.append("createdBy", data?.createdBy)
        formData.append("thumbnail", data?.thumbnail)
        const response = axiosInstance.post('courses', formData);
        toast.promise(response, {
            loading: "Creating new course, please wait!",
            success: "Course created successfully!",
            error: "Failed to create course"
        })
        return (await response).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})
const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder
            .addCase(getAllCourses.fulfilled, (state, action) => {
                if (action.payload) {
                    state.courseData = [...action.payload]  // Here action.payload means (await res).data.courses
                }
            })
    }
})

export default courseSlice.reducer;
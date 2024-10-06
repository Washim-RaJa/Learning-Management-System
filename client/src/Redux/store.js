import { configureStore } from '@reduxjs/toolkit';

import razorpaySliceReducer from '../Redux/Slices/RazorpaySlice'
import authSliceReducer from './Slices/AuthSlice';
import courseSliceReducer from './Slices/CourseSlice';
// configureStore offers more advanced features and customization options, while createStore provides a basic way to create a store
const store = configureStore({
    reducer:{
        auth: authSliceReducer,
        course: courseSliceReducer,
        razorpay: razorpaySliceReducer
    },
    devTools: true  // enable support for the Redux DevTools browser extension.
})

export default store;
import { configureStore } from '@reduxjs/toolkit';

import authSliceReducer from './Slices/AuthSlice';

// configureStore offers more advanced features and customization options, while createStore provides a basic way to create a store
const store = configureStore({
    reducer:{
        auth: authSliceReducer
    },
    devTools: true  // enable support for the Redux DevTools browser extension.
})

export default store;
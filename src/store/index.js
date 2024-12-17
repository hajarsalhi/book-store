import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';  // You'll need to create this

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store; 
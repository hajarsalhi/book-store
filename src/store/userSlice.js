import { createSlice } from '@reduxjs/toolkit';

const initialState = (() => {
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    localStorage.removeItem('user'); // Clear invalid data
    return null;
  }
})();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },
    clearUser: () => null
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer; 
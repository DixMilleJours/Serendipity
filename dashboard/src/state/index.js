import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  departure: null,
  destination: null,
  way: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setLocation: (state, action) => {
      state.departure = action.payload.departure;
      state.destination = action.payload.destination;
    },
    setWay:(state, action) =>{
      state.way = action.payload.way;
    },
  },
});

export const { setMode, setLogin, setLogout, setLocation, setWay } =
  authSlice.actions;
export default authSlice.reducer;
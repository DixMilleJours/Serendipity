import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  departure: "",
  destination: "",
  travels: ["", "", 0, 0, "", ""],
  hotels: [0, 0, 0],
  travelCards: []
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
    setTravel: (state, action) => {
      state.travels[0] = action.payload.way;
      state.travels[1] = action.payload.classOption;
      state.travels[2] = isNaN(action.payload.adults) ? 0 : action.payload.adults;
      state.travels[3] = isNaN(action.payload.children) ? 0 : action.payload.children;
      state.travels[4] = action.payload.departure;
      state.travels[5] = action.payload.destination;
    },
    setHotel: (state, action) => {
      state.hotels[0] = isNaN(action.payload.room) ? 0 : action.payload.room;
      state.hotels[1] = isNaN(action.payload.adults) ? 0 : action.payload.adults;
      state.hotels[2] = isNaN(action.payload.children) ? 0 : action.payload.children;
    },
    setTravelCard: (state, action) => {
      state.travelCards.push(action.payload.store);
    },
    removeTravelCard: (state, action) => {
      const indexToDelete = action.payload;
      state.travelCards = state.travelCards.filter((_, index) => index !== indexToDelete);
    },
  },
});

export const { setMode, setLogin, setLogout, setLocation, setTravel, setHotel, setTravelCard, removeTravelCard } =
  authSlice.actions;
export default authSlice.reducer;

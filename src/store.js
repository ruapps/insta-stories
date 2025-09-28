import { configureStore } from "@reduxjs/toolkit";
import storiesReducer from "./features/storiesSlice";

const store = configureStore({
  reducer: {
    stories: storiesReducer,
  },
});

export default store;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchStories = createAsyncThunk(
  "stories/fetchStories",
  async () => {
    const res = await fetch("/stories.json");
    if (!res.ok) throw new Error("Failed to load stories");
    return res.json();
  }
);

const storiesSlice = createSlice({
  name: "stories",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    activeIndex: null, // index of currently opened story
  },
  reducers: {
    openStory(state, action) {
      state.activeIndex = action.payload;
    },
    closeStory(state) {
      state.activeIndex = null;
    },
    nextStory(state) {
      if (state.activeIndex === null) return;
      if (state.activeIndex < state.items.length - 1) state.activeIndex += 1;
    },
    prevStory(state) {
      if (state.activeIndex === null) return;
      if (state.activeIndex > 0) state.activeIndex -= 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { openStory, closeStory, nextStory, prevStory } =
  storiesSlice.actions;
export default storiesSlice.reducer;

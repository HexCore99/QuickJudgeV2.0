import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import contestsReducer from "../features/contests/contestsSlice";
import discussionReducer from "../features/discussion/discussionSlice";
import leaderboardReducer from "../features/leaderboard/leaderboardSlice";
import profileReducer from "../features/profile/profileSlice";
// Temporary reducer so Provider can be wired before real slices are added.
const placeholderReducer = (state = {}) => state;

export const store = configureStore({
  reducer: {
    app: placeholderReducer,
    auth: authReducer,
    contests: contestsReducer,
    discussion: discussionReducer,
    profile: profileReducer,
    leaderboard: leaderboardReducer,
  },
});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import adminDashboardReducer from "../features/admin/adminDashboardSlice";
import adminUsersReducer from "../features/admin/adminUsersSlice";
import authReducer from "../features/auth/authSlice";
import contestsReducer from "../features/contests/contestsSlice";
import discussionsReducer from "../features/discussions/discussionsSlice";
import leaderboardReducer from "../features/leaderboard/leaderboardSlice";
import profileReducer from "../features/profile/profileSlice";
// Temporary reducer so Provider can be wired before real slices are added.
const placeholderReducer = (state = {}) => state;

export const store = configureStore({
  reducer: {
    app: placeholderReducer,
    adminDashboard: adminDashboardReducer,
    adminUsers: adminUsersReducer,
    auth: authReducer,
    contests: contestsReducer,
    discussions: discussionsReducer,
    leaderboard: leaderboardReducer,
    profile: profileReducer,
  },
});

export default store;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  headline: string;
  connectionsCount: number;
}

interface AuthState {
  currentUser: User | null;
  users: (User & { passwordHash: string })[];
  error: string | null;
}

// Default mock avatars using SVG data URIs
const createAvatar = (initials: string, bgColor: string) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="${encodeURIComponent(bgColor)}"/><text x="50" y="55" font-family="'Comic Sans MS', cursive, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;
};

const initialMockUsers = [
  {
    id: "user-1",
    firstName: "Sarah",
    lastName: "Rahman",
    email: "sarah@mindunite.org",
    headline: "Cognitive Neuroscientist | Professor at DU | Brain Research lead",
    avatarUrl: createAvatar("SR", "#008051"),
    connectionsCount: 342,
    passwordHash: "123456",
  },
  {
    id: "user-2",
    firstName: "Rahat",
    lastName: "Islam",
    email: "rahat@mindunite.org",
    headline: "Psychology Student at RU | Aspiring Neuro-therapist | Research Intern",
    avatarUrl: createAvatar("RI", "#0a7e8c"),
    connectionsCount: 89,
    passwordHash: "123456",
  },
  {
    id: "user-3",
    firstName: "Fahmida",
    lastName: "Yeasmin",
    email: "fahmida@mindunite.org",
    headline: "Clinical Psychologist | Mental Health Counselor & Wellness Coach",
    avatarUrl: createAvatar("FY", "#8c0a5b"),
    connectionsCount: 195,
    passwordHash: "123456",
  },
];

const initialState: AuthState = {
  currentUser: null,
  users: initialMockUsers,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser: (
      state,
      action: PayloadAction<{ firstName: string; lastName: string; email: string; password: string }>
    ) => {
      const { firstName, lastName, email, password } = action.payload;
      const emailLower = email.toLowerCase();
      const userExists = state.users.find((u) => u.email.toLowerCase() === emailLower);

      if (userExists) {
        state.error = "Email is already registered.";
        return;
      }

      const initials = (firstName[0] || "") + (lastName[0] || "");
      // Generate a nice hue based on name length
      const colors = ["#008051", "#0a7e8c", "#8c0a5b", "#a855f7", "#3b82f6", "#14b8a6", "#f59e0b"];
      const colorIndex = (firstName.length + lastName.length) % colors.length;
      const bgColor = colors[colorIndex];

      const newUser = {
        id: `user-${Date.now()}`,
        firstName,
        lastName,
        email: emailLower,
        headline: "Brain Health Enthusiast | MindUnite Member",
        avatarUrl: createAvatar(initials.toUpperCase(), bgColor),
        connectionsCount: 0,
        passwordHash: password,
      };

      state.users.push(newUser);
      state.currentUser = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
        headline: newUser.headline,
        connectionsCount: newUser.connectionsCount,
      };
      state.error = null;
    },
    loginUser: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      const { email, password } = action.payload;
      const emailLower = email.toLowerCase();
      const user = state.users.find(
        (u) => u.email.toLowerCase() === emailLower && u.passwordHash === password
      );

      if (user) {
        state.currentUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          headline: user.headline,
          connectionsCount: user.connectionsCount,
        };
        state.error = null;
      } else {
        state.error = "Invalid email or password.";
      }
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const { registerUser, loginUser, logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

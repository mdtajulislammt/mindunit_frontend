import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "./storage";
import authReducer from "./slices/authSlice";
import feedReducer from "./slices/feedSlice";
import groupsReducer from "./slices/groupsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  feed: feedReducer,
  groups: groupsReducer,
});

const persistConfig = {
  key: "mindunite-root",
  storage,
  whitelist: ["auth", "feed", "groups"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

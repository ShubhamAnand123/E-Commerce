import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import {thunk } from "redux-thunk"; // Import Redux Thunk properly

// Import the productReducer from the reducers folder
import {
  productReducer,
  productDetailsReducer,
} from "./reducers/productReducer.js";

// Combine reducers
const rootReducer = combineReducers({
  products: productReducer,
  productDetails: productDetailsReducer,
});

// Define initial state
let initialState = {};

// Define middleware callback function
const middleware = (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(thunk);

// Create Redux store
const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  middleware: middleware,
  devTools: process.env.NODE_ENV !== "production",
});

export default store;


import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk }from "redux-thunk"; // Corrected to use default import
import { composeWithDevTools } from "redux-devtools-extension";
import { productDetailsReducer, productReducer } from "./reducers/productReducer";

const rootReducer = combineReducers({
  products: productReducer,
  productDetails: productDetailsReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer, // Correctly using the combined reducer
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)) // Spread middleware array
);

export default store;

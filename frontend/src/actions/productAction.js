import axios from "axios";
import {
  ALL_PRODUCT_FAIL,
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../constants/productConstant";

// Fetch all products with optional keyword, current page, price range, category, and rating
export const getProduct =
  (
    keyword = "",
    currentPage = 1,
    price = [0, 2500],
    category,
    rating = [0, 5]
  ) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCT_REQUEST });

      // Construct the base URL with required query parameters
      let link = `http://localhost:4000/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}`;

      // Conditionally append the category parameter if provided
      if (category) {
        link += `&category=${category}`;
      }

      // Conditionally append the rating parameter if provided
      if (rating.length === 2) {
        link += `&rating[gte]=${rating[0]}&rating[lte]=${rating[1]}`;
      }

      // Fetch the data from the API
      const { data } = await axios.get(link);

      // Dispatch success action with fetched data
      dispatch({ type: ALL_PRODUCT_SUCCESS, payload: data });
    } catch (error) {
      // Dispatch fail action with error message
      dispatch({
        type: ALL_PRODUCT_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      // Log the error message for debugging purposes
      console.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

// Fetch product details by ID
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    // Fetch product details from the API
    const { data } = await axios.get(
      `http://localhost:4000/api/v1/product/${id}`
    );

    // Dispatch success action with fetched product details
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data.product });
  } catch (error) {
    // Dispatch fail action with error message
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    // Log the error message for debugging purposes
    console.error(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
};

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

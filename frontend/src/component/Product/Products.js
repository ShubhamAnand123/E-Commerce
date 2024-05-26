import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard.js";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

const categories = [
  "Stationery",
  "Fountain",
  "Luxury",
  "Tops",
  "Attire",
  "Notebook",
  "SmartPhones",
];

const Products = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState("");
  const[rating,setRating] = useState([0,5]);

  const { products, loading, error, productsCount, resultPerPage} =
    useSelector((state) => state.products);

  const { keyword } = useParams();

  // Handle page change for pagination
  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  // Handle price slider change
  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };
   const handleRatingChange = (event, newRating) => {
     setRating(newRating);
   };

  useEffect(() => {
    if (error) {
      // Handle the error appropriately
      console.error(error);
      dispatch(clearErrors());
    }
    // Fetch products with updated filters
    dispatch(getProduct(keyword, currentPage, price, category,rating));
  }, [dispatch, error, keyword, currentPage, price, category,rating]);


  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={2500}
            />
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((categoryItem) => (
                <li
                  className="category-link"
                  key={categoryItem}
                  onClick={() => setCategory(categoryItem)}
                >
                  {categoryItem}
                </li>
              ))}
            </ul>
            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={rating}
                onChange={handleRatingChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={5}
              />
            </fieldset>
          </div>

          {resultPerPage < productsCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;

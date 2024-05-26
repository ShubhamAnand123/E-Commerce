import React, { Fragment, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productAction";
import { useParams } from "react-router-dom";
import ReactStars from "react-stars";
import ReviewCard from "./ReviewCard"; // Make sure this component is properly imported and defined
import Loader from "../layout/Loader/Loader";
import {useAlert} from "react-alert";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const alert =useAlert();
  const { id } = useParams(); // Get the product ID from the URL parameters

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  useEffect(() => {
    if(error)
    {
       alert.error(error);
       dispatch(clearErrors());
    }
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id,error,alert]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={item.url}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>
            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <ReactStars value={product.rating} />
                <span>({product.numOfReviews} reviews)</span>
              </div>
              <div className="detailsBlock-3">
                <h1>${product.price}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button>-</button>
                    <input value="1" type="number" />
                    <button>+</button>
                  </div>
                  <button>Add to Cart</button>
                </div>
                <p>
                  <b className={product.Stock < 1 ? "red" : "green"}>
                    {product.Stock < 1 ? "Out of Stock" : "In Stock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description:<p>{product.description}</p>
              </div>

              <button className="submitReview">Submit</button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="reviews">
              {product.reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <center>
              <p style={{ fontSize: "28px" }}>No Reviews yet.</p>
            </center>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;

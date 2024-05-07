// import React, { useEffect } from "react";
// import { Carousel } from "react-material-ui-carousel";
// import "./ProductDetails.css";
// import { useSelector, useDispatch } from "react-redux";
// import { getProductDetails } from "../../actions/productAction";
// import { useParams } from "react-router-dom";

// const ProductDetails = ({ match }) => {
//   const { id } = useParams();
//   console.log('id',id);
//   console.log('match',match);
//   const dispatch = useDispatch();
//   const { loading, product, error } = useSelector(
//     (state) => state.productDetails
//   );

//   useEffect(() => {
//           // console.log(match);
//     if(id){
//     // if (match && match.params && match.params.id) {
//       console.log("product details", getProductDetails(id));

//       console.log(dispatch(getProductDetails(id)));
//     }
//   }, [dispatch, id]);

//   // if (!match || !match.params ) {
//   //   return <p>No product ID provided</p>;
//   // }

//   return (
//     <>
//       <div className="ProductDetails">
//         {loading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <p>Failed to fetch product details. Please try again later.</p>
//         ) : product ? (
//           <div>
//             <Carousel>
//               {/* {product.images.map((item, i) => (
//                 <img
//                   className="CarouselImage"
//                   key={item.url}
//                   src={item.url}
//                   alt={`${i} Slide`}
//                 />
//               ))} */}
//             </Carousel>
//           </div>
//         ) : (
//           <p>Product not found</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default ProductDetails;


//chatgpt
import React, { useEffect } from "react";
import { Carousel } from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails } from "../../actions/productAction";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { loading, product, error } = useSelector(
    (state) => state.productDetails
  );
  // console.log(loading);
  console.log(product);
  // console.log(error);
    console.log(id);
  useEffect(() => {
      dispatch(getProductDetails(id));
  }, [ ]);

  return (
    <div className="ProductDetails">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Failed to fetch product details. Please try again later.</p>
      ) : product ? (
        <div>
          <Carousel>
            {
              product.images.map((item, i) => (
              <img
                className="CarouselImage"
                key={i}
                src={item.url}
                alt={`Slide ${i}`}
              />
            ))}
          </Carousel>
          <p>{product.name}</p>
          <p>{`₹${product.price}`}</p>
        </div>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  );
};

export default ProductDetails;

import React, { useEffect, useLayoutEffect } from 'react'
import Carousel from "react-material-ui-carousel"
import "./ProductDetails.css"
import { useDispatch, useSelector } from "react-redux"
import { clearErrors, getProductDetails, newReview } from '../../actions/productActions'

import ReviewCard from "./ReviewCard.js"
import Loader from "../layout/loader/Loader"
import { useAlert } from "react-alert"
import MetaData from "../layout/MetaData"
import { useState } from 'react'
import { addItemToCart } from '../../actions/cartActions'
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Button

} from "@material-ui/core"
import { Rating } from '@material-ui/lab'
import { NEW_REVIEW_RESET } from '../../constants/productConstants'
// we don't need to pass mathc as an argument in our ProductDetails component
function ProductDetails({ match }) {
    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    });
    const alert = useAlert();

    // to make use of dispatch action
    const dispatch = useDispatch();
    // always use useEffect in bcz it initially it will store details on  to the store by dispatching action later we will use it using useSelector
    const { loading, product, error } = useSelector((state) => state.productDetails)
    const { success, error: reviewError } = useSelector(
        (state) => state.newReview
    );
    const options = {

        size: "large",
        value: product.ratings,
        readOnly: true,
        precision: 0.1
    }
    const [quantity, setQuantity] = useState(1)
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const increaseQuantity = () => {


        if (quantity >= product.Stock) {
            alert.error('Sorry!! You Excedded Available Limit!!!');
            return
        }

        setQuantity(quantity + 1)
    }
    const decreaseQuantity = () => {
        if (quantity <= 1) {
            alert.error('Minimum One Quantity Required');
            return
        }
        setQuantity(quantity - 1)
    }
    const addToCartHandler = () => {
        if (product.Stock <= 0) {
            alert.error('Item Out Of Stock');
            return
        }
        dispatch(addItemToCart(match.params.id, quantity))
        alert.success('Item Added To Cart Successfully!!')
    }
    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true)
    }
    const reviewSubmitHandler = () => {
        const myForm = new FormData();
        myForm.set('rating', rating)
        myForm.set('comment', comment)
        myForm.set('productId', match.params.id)
        dispatch(newReview(myForm))
        setOpen(false);// after submitting review close dialog box
    }
    useEffect(() => {
        if (error) {
            // inspite of just returning alert.error(error) use clearErrors after showing alert in store
            alert.error(error);
            dispatch(clearErrors())
        }
        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Review Submitted Successfully");
            dispatch({ type: NEW_REVIEW_RESET });
        }

        dispatch(getProductDetails(match.params.id))// match.params.id is used in frontend to get id from paramenter like wise in backend we use req.params.id
    }, [dispatch, match.params.id, alert, error, success, reviewError])


    let discount=17
    return (
        <>
            <MetaData title={`${product.name}....Ecommerce`} />

            {/* loader lagana jarurui h bcz rating wala section pehle hi load ho jayega before getting data from backend isilye woh rating 0 dekha rgha tha pehle */}
            {loading ? <Loader /> : <>

                <div className="ProductDetails">
                    <div>
                        {/* <div> */}
                        <Carousel>
                            {product.images &&
                                product.images.map((item, index) => (
                                    <img
                                        className="CarouselImage"
                                        key={index}
                                        src={item.url}
                                        alt={`${index} Slide`}
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
                            <Rating {...options} />
                            <span className='detailsBlock-2-span'>  ({product.noOfReviews} Reviews)</span>
                        </div>
                            <p style={{marginTop:"0.8vmax",backgroundColor:"rgb(204,0,0)",color:"white",borderRadius:"50%",width:"3vmax",textAlign:"center"}}>{discount}% off</p>
                        <div className="detailsBlock-3">
                            <h1> <span style={{textDecoration:"line-through",color:"grey",fontSize:"1.2vmax"}}>{` ₹${product.price +(discount/100)*product.price}`}</span>{` ₹${product.price} `}</h1>
                            <div className="detailsBlock-3-1">
                                <div className="detailsBlock-3-1-1">
                                    <button onClick={decreaseQuantity}>-</button>
                                    <input type="number" readOnly value={quantity} />
                                    <button onClick={increaseQuantity} >+</button>
                                </div>
                                <button
                                    disabled={product.Stock < 1 ? true : false}
                                    onClick={addToCartHandler}
                                >
                                    Add to Cart
                                </button>
                            </div>

                            <p>
                                Status:
                                <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                                </b>
                            </p>
                        </div>

                        <div className="detailsBlock-4">
                            Description : <p>{product.description}</p>
                        </div>

                        <button onClick={submitReviewToggle} className="submitReview">
                            Add Review
                        </button>
                    </div>

                </div>
                <h3 className="reviewsHeading">
                    REVIEWS
                </h3>


                <Dialog
                    aria-labelledby="simple-dialog-title"
                    open={open} //jbhi yeh true ho==ga tabhi review add krne kla dialog box open ho jayega
                    onClose={submitReviewToggle} // agar onClose rakha toh dialog box k bahar click krne kr diaglog box
                //diappear nhi hoga hmne yaha submitReviewToggle ko call kiya h mtlb when we press submit open ki value false ho jayegi agar dialog box disapper hoga
                >
                    <DialogTitle>Submit Review</DialogTitle>
                    <DialogContent className="submitDialog">
                        <Rating
                            onChange={(e) => setRating(e.target.value)}
                            value={rating}
                            size="large"
                        />

                        <textarea
                            className="submitDialogTextArea"
                            cols="30"
                            rows="5"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={submitReviewToggle} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={reviewSubmitHandler} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* if there exist any review or first review itself then do show all review else show NO review Yet */}
                {product.reviews && product.reviews[0] ?
                    (
                        <div className="reviews">
                            {product.reviews && product.reviews.map((review) => {
                                return (
                                    <ReviewCard review={review} />
                                )
                            })}
                        </div>
                    ) :
                    (
                        <div className="noReviews">NO REVIEWS YET!!!</div>
                    )}
            </>
            }
        </>

    )
}

export default ProductDetails;

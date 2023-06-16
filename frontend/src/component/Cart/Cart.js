import React, { Fragment } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard.js";
import { useSelector, useDispatch } from "react-redux";

import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";
import { addItemToCart, removeItemFromCart } from "../../actions/cartActions";
import MetaData from "../layout/MetaData";

const Cart = ({ history }) => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart); //cart{cartItems:[{ProducId,price,name etc}{}{}...]}

    const increaseQuantity = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (stock <= quantity) {
            return;
        }
        dispatch(addItemToCart(id, newQty));
    };

    const decreaseQuantity = (id, quantity) => {
        const newQty = quantity - 1;
        if (1 >= quantity) {

            return;
        }
        dispatch(addItemToCart(id, newQty));
    };

    const deleteCartItems = (id) => {
        dispatch(removeItemFromCart(id));
    };

    const checkoutHandler = () => {
        history.push("/login?redirect=shipping");// to redirect to login(as ? after this all are just queryParamter) page but if it was already login then will go for loaction.search procedure
    };

    return (
        <Fragment>
            <MetaData title={`Cart`} />
            {cartItems.length === 0 ? (// if the cardItems doesn't contain any item them show empty cart with icon
                <div className="emptyCart">
                    <RemoveShoppingCartIcon />

                    <Typography>No Product in Your Cart</Typography>
                    <Link to="/products">View Products</Link>
                </div>
            ) : (
                <Fragment>
                    <div className="cartPage">
                        <div className="cartHeader">
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                        </div>


                        {/* // this itemCard is only the row whcih we can see on cart */}
                        {cartItems &&
                            cartItems.map((item) => (
                                <div className="cartContainer" key={item.productId}>
                                    <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                                    <div className="cartInput">
                                        <button
                                            onClick={() =>
                                                decreaseQuantity(item.productId, item.quantity)
                                            }>-</button>
                                        <input type="number" value={item.quantity} readOnly />
                                        <button
                                            onClick={() =>
                                                increaseQuantity(
                                                    item.productId,
                                                    item.quantity,
                                                    item.stock
                                                )
                                            }
                                        >+</button>
                                    </div>
                                    <p className="cartSubtotal">{`₹${item.price * item.quantity
                                        }`}</p>
                                </div>
                            ))}

                        <div className="cartGrossProfit">
                            <div></div>
                            <div className="cartGrossProfitBox">
                                <p>Gross Total</p>
                                <p>{`₹${cartItems.reduce(// reduce function(accumulator,array items) ab acc m saare array item i.e object ki quantity8price kro aur acc m save kro aur last m acc return krdo
                                    // some what like .reduce(sum,item)=>return { sum+item.quantity * item.price}
                                    (acc, item) => acc + item.quantity * item.price,
                                    0
                                )}`}</p>
                            </div>
                            <div></div>
                            <div className="checkOutBtn">
                                <button onClick={checkoutHandler}>Check Out</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Cart;
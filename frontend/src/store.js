//importing creatreStore-to create store,combinereducer-to combine many resucer as a root reducer,applyy middleware - used to apply middleware (a kind of function generally implemeted in between displatch of action and the mmoment it reaches to reducers)
import { createStore, combineReducers, applyMiddleware } from "redux";
// thunk- is a middleware helps to get data from api call
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension"
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productReviewsReducer, productsReducer, reviewReducer } from "./reducers/productReducer";
import { allUsersReducer, forgotPasswordReducer, profileReducer, userDetailsReducer, userReducer } from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer } from "./reducers/orderReducer";
//  to combine product reducer,orderreducer etc.
//  these product,productDetails will be used by Useselector to access state store consist like state({ product:{....}, productDetails:{....}})
const reducer = combineReducers(
    {
        products: productsReducer,// products contain info regards to all products
        product:productReducer,
        productDetails: productDetailsReducer,
        user: userReducer,
        profile: profileReducer,
        forgotPassword: forgotPasswordReducer,
        cart: cartReducer,
        newOrder:newOrderReducer,
        myOrders:myOrdersReducer,
        orderDetails:orderDetailsReducer,
        newReview:newReviewReducer,
        newProduct:newProductReducer,
        allOrders:allOrdersReducer,
        order:orderReducer,
        allUsers:allUsersReducer,
        userDetails:userDetailsReducer,
        productReviews:productReviewsReducer,
        review:reviewReducer
    });
// after reloading page the  initial state could ne either of empty or having cart and shipping info if having
let initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems') ?
            JSON.parse(localStorage.getItem('cartItems')) :
            [],
        shippingInfo: localStorage.getItem('shippingInfo') ?
            JSON.parse(localStorage.getItem('shippingInfo')) :
            {},
    }
};
const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);
// export default store; so that it can be imported anywhere in our application store is necessary to export bcz this will be responsible for  flow of data across our application
export default store;
import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from "../constants/cartConstants"

export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload;// this item do contain many stuff(i.e an object itself bcz cartItems will be array of object)like
            const isItemExist = state.cartItems.find(// find function return the value of first element in an array that passes the test Note:if it is array of object then an object itself is returned
                (i) => i.productId === item.productId
            );
            if (isItemExist) {
                return {
                    ...state,
                    // map function return new array by performing some task assigned inside .map() on each element
                    cartItems: state.cartItems.map((i) =>
                        i.productId === isItemExist.productId ? item : i
                    )// in this case it is returning array of object
                }// to avoid duplication id item is earlier present then make upated value of that item in cart else if new item added then add that into cart
            }
            else {
                return {
                    // returning a new item in cartItems
                    ...state,
                    cartItems: [...state.cartItems, item]
                }


            }
        case REMOVE_CART_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter((i) => i.productId !== action.payload),
            };
        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload
            }
        default:
            return state;
    }
}
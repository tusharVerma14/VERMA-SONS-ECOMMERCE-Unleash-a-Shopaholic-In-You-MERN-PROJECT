import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from "../constants/cartConstants";
import axios from "axios"
export const addItemToCart = (id,quantity) => {
    return async (dispatch,getState) => {
        const {data}=await axios.get(`/api/v1/product/${id}`);
        dispatch({
            type:ADD_TO_CART,
            payload:{
                productId:data.product._id,
                name:data.product.name,
                price:data.product.price,
                image:data.product.images[0].url,
                stock:data.product.Stock,
                quantity
            }
        })
        // manlo hmne cart m add kiya item page reload kiya toh state empty ho jayegi i.e cart empty hojayega
        // so to avoid this hme use localStorage m store kr lena chaiye until we remove it from cart by ourself
        localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems)); // getState help to acccesss state here we are accessing state of cart state // state cartItems k naam se store hogi hi localStorage
        // so agr hm getItems('cartItems') krenge toh hme localStorga ese cartItems ki value mil jayegi
    }
}

export const removeItemFromCart = (id) => async (dispatch, getState) => {
    dispatch({
      type: REMOVE_CART_ITEM,
      payload: id,
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  };

//   SAVE SHIPPING INFO
  export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
      type: SAVE_SHIPPING_INFO,
      payload: data,
    });

    localStorage.setItem("shippingInfo", JSON.stringify(data));
  };
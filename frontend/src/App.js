
import React, { useState } from 'react';
import './App.css';
import Header from "./component/layout/Header/Header"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Webfont from "webfontloader"
import Footer from './component/layout/Footer/Footer';
import Home from "./component/Home/Home"
import ProductDetails from "./component/Product/ProductDetails"
import Products from "./component/Product/Products"
import Search from "./component/Product/Search"
import LoginSingUp from './component/User/LoginSignUp';
import Profile from './component/User/Profile';
import store from "./store"
import { loadUser } from './actions/userActions';
// useeefect work on page load and webfotn la load method will load googlefont [first priority,seocnd priority,third priority
// load({object ki kaun sa font use kr rhe h aur hm use kr rhe h google font})
import UserOptions from "./component/layout/Header/UserOptions"
import { useSelector } from 'react-redux';
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from './component/User/UpdateProfile';
import UpdatePassword from './component/User/UpdatePassword';
import ForgotPassword from './component/User/ForgotPassword';
import ResetPassword from './component/User/ResetPassword';
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js"
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import Payment from "./component/Cart/Payment.js"
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrders.js"
import OrderDetails from "./component/Order/OrderDetails.js"
import Dashboard from "./component/Admin/Dashboard.js"
import NewProduct from "./component/Admin/NewProduct.js"
import UpdateProduct from "./component/Admin/UpdateProduct.js"
import OrderList from "./component/Admin/OrderList.js"
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import axios from "axios"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ProductList from './component/Admin/ProductList';
import UsersList from './component/Admin/UsersList.js';
import UpdateUser from './component/Admin/UpdateUser.js';
import ProductReviews from './component/Admin/ProductReviews.js';
import About from './component/layout/About/About';
import Contact from './component/layout/Contact/Contact';
import NotFound from './component/layout/Not Found/NotFound';
function App() {
  const { isAuthenticated, user } = useSelector(state => state.user)
  const [stripeApiKey, setStripeApiKey] = useState("")

  async function getStripeApiKey() {

    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey)

  }// getting the stripe key from backend as it will be used in frontend itself

  React.useEffect(() => {
    Webfont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    })
    store.dispatch(loadUser())
    getStripeApiKey();
  }, []);
  window.addEventListener("contextmenu", (e) => e.preventDefault())

  return (

    <Router>
      <Header />

      {isAuthenticated && <UserOptions user={user} />}

      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>

          <ProtectedRoute exact path="/process/payment" component={Payment}></ProtectedRoute>
        </Elements >
      )}
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/product/:id" component={ProductDetails}></Route>
        <Route exact path="/products" component={Products}></Route>
        <Route path="/products/:keyword" component={Products}></Route>
        <Route exact path="/search" component={Search}></Route>
        {/* hmne protectedRoute ka use isliye kiya cz this will help ki pehle hamra component load na no ho pehle yeh verify ho k loading false/true */}
        {/* and isAuthenticated or not then only load component else it can create problem of pehle component load ho gya aur user.url load hi nhi ho oaya toh screen pr kuch aayaga hi nhi */}

        <ProtectedRoute exact path="/account" component={Profile}></ProtectedRoute>
        <ProtectedRoute exact path="/me/update" component={UpdateProfile}></ProtectedRoute>
        <ProtectedRoute exact path="/password/update" component={UpdatePassword}></ProtectedRoute>
        {/* // no need to be protected route for forgot password bcz agar user hi login nhi ho paa rha h tabhi toh forgot password pr jaa rha h  */}

        <Route exact path="/password/forgot" component={ForgotPassword}></Route>
        <Route exact path="/password/reset/:token" component={ResetPassword}></Route>

        <Route exact path="/login" component={LoginSingUp}></Route>
        <Route exact path="/cart" component={Cart}></Route>
        <Route exact path="/about" component={About}></Route>
        <Route exact path="/contact" component={Contact}></Route>
        {/* <Route exact path="/cart" component={Cart}></Route> */}
        {/* bcz /shipping krne se pehle login hona jaruri h bcz koi manually agar url pe likh de toh bhi voh /shipping pr na jaa paye if he is not login */}
        <ProtectedRoute exact path="/shipping" component={Shipping}></ProtectedRoute>



        <ProtectedRoute exact path="/success" component={OrderSuccess}></ProtectedRoute>
        <ProtectedRoute exact path="/orders" component={MyOrders}></ProtectedRoute>

        <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder}></ProtectedRoute>
        <ProtectedRoute exact path="/order/:id" component={OrderDetails}></ProtectedRoute>

        <ProtectedRoute isAdmin={true} exact path="/admin/dashboard" component={Dashboard}></ProtectedRoute> {/* bcz ho kya rha agar m as a normal account se bhi login hu n toh dashboard ka icon toh nhi aa rha h pr m directly url pr dahsboad likr access kr skta hu so remove this bug i used prop pf isAdmin*/}
        <ProtectedRoute isAdmin={true} exact path="/admin/products" component={ProductList}></ProtectedRoute>
        <ProtectedRoute isAdmin={true} exact path="/admin/product" component={NewProduct}></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/admin/product/:id"
          isAdmin={true}
          component={UpdateProduct}
        />
        <ProtectedRoute
          exact
          path="/admin/orders"
          isAdmin={true}
          component={OrderList} // will be similar to ProductList
        />
        <ProtectedRoute
          exact
          path="/admin/order/:id"
          isAdmin={true}
          component={ProcessOrder}
        />
        <ProtectedRoute
          exact
          path="/admin/users"
          isAdmin={true}
          component={UsersList}
        />
        <ProtectedRoute
          exact
          path="/admin/user/:id"
          isAdmin={true}
          component={UpdateUser}
        />
        <ProtectedRoute
          exact
          path="/admin/reviews"
          isAdmin={true}
          component={ProductReviews}
        />
        <Route
          component={
            window.location.pathname === "/process/payment" ? null : NotFound
          }
        />

      </Switch>

      <Footer />
    </Router>
  );
}

export default App;

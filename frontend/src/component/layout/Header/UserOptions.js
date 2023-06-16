
import React, { Fragment, useState } from 'react'
import "./Header.css"
import { SpeedDial, SpeedDialAction } from "@material-ui/lab"
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { logout } from "../../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
const UserOptions = ({ user }) => {
    const dispatch=useDispatch();
    const {cartItems} =useSelector(state=>state.cart)
    const [open, setOpen] = useState(false);
    const history = useHistory();// anoither way to getting history using hooks
    const alert = useAlert();
    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { icon: <ShoppingCartIcon style={{color:cartItems.length>0?"tomato":"unset"}}/>, name: `Cart(${cartItems.length})`, func: cart },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser }
    ]
    // if the logedin user is admin rhen add dahsboard icon in the first index of options array
    if (user.role === 'admin') {
        options.unshift({
            icon: <DashboardIcon />, name: "Dashboard", func: dashboard
        });
    }
    // these fucntiuon are used to redirect to particular path on clicking corresponding icon
    function dashboard() {
        history.push("/admin/dashboard");
    }

    function orders() {
        history.push("/orders");
    }
    function account() {
        history.push("/account");
    }
    function cart() {
        history.push("/cart");
    }
    function logoutUser() {
        dispatch(logout());
        alert.success("Logout Successfully");
    }
    return (
        <Fragment>
            <Backdrop open={open} style={{zIndex:"10"}}/> {/*to apply little grey on hover to speedDial on entire page*/ }
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                onClose={() => setOpen(false)} // onclose pr hide the compoonent of orders,logout etc.
                onOpen={() => setOpen(true)}   // onOpen show the component
                style={{ zIndex: "11" }} // so that it won't overlap overlay-navbar
                open={open}// if true:show comoponent else hide component
                direction="down" // in which diretion to show component
                className="speedDial"
                icon={ // profile pic
                    <img
                        className="speedDialIcon"
                        src={user.avatar.url ? user.avatar.url : "/Profile.png"}
                        alt="Profile"
                    />
                }
            >
                {/* // to render all the component like dahsboard,orders,profile,logout */}
                {options.map((item) => (
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                        tooltipOpen={window.innerWidth <= 600 ? true : false} // means for small device click on speed dial to see options whereas just hover on big devices>600 width
                    />
                ))}
            </SpeedDial>
        </Fragment>
    )
}

export default UserOptions

import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const ProtectedRoute = ({ isAdmin,component: Component, ...rest }) => {// component:Profile like wise so helpful to create component <Profile/>
    const { loading, isAuthenticated, user } = useSelector((state) => state.user);

    return (
        <Fragment>
            {loading === false && (// agar tu dashboard pr ho agar tum use refresh krte ho toh agar tum kahi redirect ho jaa rhe h vapas dashboard pr nhi aa rhe ho toh instead of !loading use loading===false
                <Route

                    {...rest}
                    // render can be helpful to pass props in our component like <Profile name="Tushar"/>
                    render={(props) => {

                        if (isAuthenticated === false) {

                            return <Redirect to="/login" />;
                        }

                        if (isAdmin === true && user.role !== "admin") {
                            return <Redirect to="/login" />;
                        }

                        return <Component {...props} />;
                    }}
                />
            )}
        </Fragment>
    );
};

export default ProtectedRoute;
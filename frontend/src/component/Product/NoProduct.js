import React from "react";
import ErrorIcon from "@material-ui/icons/Error";
import "./NoProduct.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const NoProduct = (props) => {
  return (
    <div className="ProductNotFound">
  <ErrorIcon />

  <Typography>No Such Product Available At The Moment </Typography>

  <Link to="/products" onClick={props.handler}>Show All Products</Link>
</div>
  )
}

export default NoProduct

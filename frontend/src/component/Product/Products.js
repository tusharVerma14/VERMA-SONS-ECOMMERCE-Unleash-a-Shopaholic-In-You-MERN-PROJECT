import React, { useEffect, useState } from 'react'

import Loader from '../layout/loader/Loader'
import { useDispatch, useSelector } from "react-redux"
import ProductCard from '../Home/ProductCard';
import { clearErrors, getProduct } from '../../actions/productActions';
import { useAlert } from 'react-alert';
import "./Products.css"

import Pagination from '@mui/material/Pagination';
import Slider from "@material-ui/core/Slider"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import MetaData from "../layout/MetaData"
import NoProduct from "./NoProduct.js"
const CategoriesList = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "Mobile",
    "Shoes",
    "Watches"
]
function Products({ match }) {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, products, error, productsCount, resultPerPage, filteredProductsCount } = useSelector(state => state.products)
    // to get keyword from url to show keyword related product only
    const keyword = match.params.keyword;
    const [pageNo, setPageNo] = useState(1)
    const [price, setPrice] = useState([0, 100000])
    const [finalPrice, setFinalPrice] = useState(price)
    const [category, setCategory] = useState("")
    const [currRatings, setRatings] = useState(0)
    const pageHandler = (event, value) => {
        setPageNo(value)
    }
    const priceHandler = (event, newPrice) => {
        setPrice(newPrice)
    }

    const finalPriceHandler = () => { setFinalPrice(price) }
    const clearFiltersHandler = () => {
        setPageNo(1)
        setCategory("")
        setRatings(0)
        setPrice([0, 100000])
        setFinalPrice(price)
        dispatch(getProduct("", pageNo, finalPrice, category, currRatings))
    }
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
        dispatch(getProduct(keyword, pageNo, finalPrice, category, currRatings));
    }, [dispatch, error, alert, keyword, pageNo, finalPrice, category, currRatings])
    return (
        <>
            <MetaData title="Products...Ecommerce" />
            {loading ? <Loader /> : <>
                <div className="productsHeading">
                    Products
                </div>
                <div className="products">
                    {
                        products.length !== 0 ?
                            (products.map((product) =>
                                <ProductCard product={product} key={product._id} />)) :
                            <NoProduct handler={clearFiltersHandler}/>
                    }
                </div>


                <div className="filterBox">
                    <Button variant="contained" size='small' color='primary' onClick={clearFiltersHandler}
                    >Clear All Filters</Button>

                    {/* // a kind of p tag only but aleready applied some of the css properties */}
                    <Typography>Price</Typography>
                    <Slider
                        // initial start and end value can be within value attribute
                        value={price}
                        onChange={priceHandler}
                        //  onChange={}
                        valueLabelDisplay='auto'
                        aria-labelledby='range-slider'
                        min={0}
                        max={100000} />
                    <Button variant="contained" size='small' color='primary' onClick={finalPriceHandler}>Apply</Button>
                    <Typography style={{ marginTop: "10px" }}>Categories : </Typography>
                    <ul className="CategoryBox">
                        {/* in backEnd we did not consider enum in schema bcz we in frontend we limit already selected options */}
                        {CategoriesList.map((category) => (
                            <li
                                className='category-link'
                                key={category}
                                onClick={() => {
                                    setCategory(category);
                                }}>
                                {category}
                            </li>
                        ))
                        }

                    </ul>
                    <fieldset>
                        <Typography component="legend">Rating Above</Typography>
                        <Slider
                            value={currRatings}
                            onChange={(e, newRatings) => {
                                setRatings(newRatings)
                            }}
                            aria-labelledby='continuous-slider'
                            min={0}
                            max={5}
                            valueLabelDisplay='auto'
                        ></Slider>
                    </fieldset>
                    <Typography style={{ marginTop: "10px" }}>Selected Category: </Typography>

                    {category ?
                        <p className='category-link' style={{ color: "tomato" }}>{category}</p> :
                        <p className='category-link' style={{ color: "tomato" }}>None</p>
                    }

                </div>

                {/* agar productsCount > resultPerPage h toh hu pagination dikhao */}
                {/* earlier  we used above expression but later we thought that if i filtered products the also we used pagination according to that */}
                {resultPerPage < filteredProductsCount && (<div className="paginationBox">

                    <Pagination
                        count={Math.ceil(productsCount / resultPerPage)}
                        color="primary"
                        showFirstButton showLastButton
                        defaultPage={pageNo}
                        onChange={pageHandler}
                    />

                </div>)}


            </>}
        </>
    )
}



export default Products

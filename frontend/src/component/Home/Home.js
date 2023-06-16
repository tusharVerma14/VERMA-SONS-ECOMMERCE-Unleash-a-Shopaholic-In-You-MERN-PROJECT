import React, { useEffect } from 'react'
import { CgMouse } from 'react-icons/all'
import './Home.css'
import ProductCard from "./ProductCard.js"
import MetaData from '../layout/MetaData'
import { clearErrors, getProduct } from '../../actions/productActions'
import { useDispatch, useSelector } from "react-redux"
import Loader from '../layout/loader/Loader'
import { useAlert } from 'react-alert'
// temporary product object bcz later on we will fetch from redux


const Home = () => {
    const alert = useAlert();
    const dispatch = useDispatch();

    let { loading, error, products } = useSelector((state) => {
        return state.products
    })
    // useeffect is call when our componenet is renderd first time

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
        dispatch(getProduct());
    }, [dispatch, error, alert])
    

    return (
        <>
            {loading ? (<Loader />) : <div >
                <MetaData title="Verma & Sons Ecommerce" />
                <div className="banner">
                    <p>Welcome To E-Commerce </p>
                    <h1>FIND AMAZING PRODUCTS BELOW</h1>
                    <a href="#container">
                        <button>
                            Scroll <CgMouse />
                        </button>
                    </a>
                </div>
                <h2 className="homeHeading">
                    Featured Products
                </h2>
                {/* container contains product i.e let say first 8 featured one */}
                <div className="container" id="container">


                    {products && products.map(product =>
                        <ProductCard product={product} key={product._id}/>
                    )}
                </div>
            </div>}
        </>
    )
}

export default Home

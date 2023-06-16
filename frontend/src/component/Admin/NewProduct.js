import React, { Fragment, useEffect, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createProduct } from "../../actions/productActions";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SideBar from "./Sidebar";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import Loader from "../layout/loader/Loader";

const NewProduct = ({ history }) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, success } = useSelector((state) => state.newProduct);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [Stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const categories = [
        "Laptop",
        "Footwear",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "Mobile",
        "Shoes",
        "Watches"
    ];

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Product Created Successfully");
            history.push("/admin/dashboard");
            dispatch({ type: NEW_PRODUCT_RESET });
        }
    }, [dispatch, alert, error, history, success]);

    const createProductSubmitHandler = (e) => {
        e.preventDefault();
        console.log('hii create product')
        // This can be done in two ways
        // 1st way
        // const myForm = new FormData();

        // myForm.set("name", name);
        // myForm.set("price", price);
        // myForm.set("description", description);
        // myForm.set("category", category);
        // myForm.set("Stock", Stock);

        // images.forEach((image) => {
        //     myForm.append("images", image);
        // });
        // dispatch(createProduct(myForm));
        // 2nd way
        let imageArr = [];
        let data = {
            "name": name,
            "price": price,
            "description": description,
            "category": category,
            "Stock": Stock
        }
        images.forEach((image) => {
            imageArr.push(image)
        })

        data["images"] = imageArr;

        console.log(data);
        dispatch(createProduct(data))

    };

    const createProductImagesChange = (e) => {
        const files = Array.from(e.target.files); // Array.from help to make array of input files

        setImages([]);
        setImagesPreview([]);

        files.forEach((file) => {
            const reader = new FileReader();// read all files

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]); // to append new result to previous result
                    setImages((old) => [...old, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    return (
        <>

            <Fragment>
                <MetaData title="CREATE PRODUCT" />
                <div className="dashboard">
                    <SideBar />
                    {loading ? <Loader /> :
                        <>
                            <div className="newProductContainer">
                                <form
                                    className="createProductForm"
                                    encType="multipart/form-data"
                                    onSubmit={createProductSubmitHandler}
                                >
                                    <h1>Create Product</h1>

                                    <div>
                                        <SpellcheckIcon />
                                        <input
                                            type="text"
                                            placeholder="Product Name"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <AttachMoneyIcon />
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            required
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <DescriptionIcon />

                                        <textarea
                                            placeholder="Product Description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            cols="30"
                                            rows="1"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <AccountTreeIcon />
                                        <select onChange={(e) => setCategory(e.target.value)}>
                                            <option value="">Choose Category</option>
                                            {categories.map((cate) => (
                                                <option key={cate} value={cate}>
                                                    {cate}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <StorageIcon />
                                        <input
                                            type="number"
                                            placeholder="Stock"
                                            required
                                            onChange={(e) => setStock(e.target.value)}
                                        />
                                    </div>

                                    <div id="createProductFormFile">
                                        <input
                                            type="file"
                                            name="avatar"
                                            accept="image/*" // so that only images can be seleted not pdf/doc/excel or anything else
                                            onChange={createProductImagesChange}
                                            multiple // so that we can choose multiple file i.e image
                                            required
                                        />
                                    </div>

                                    <div id="createProductFormImage">
                                        {imagesPreview.map((image, index) => (
                                            <img key={index} src={image} alt="Product Preview" />
                                        ))}
                                    </div>

                                    <Button
                                        id="createProductBtn"
                                        type="submit"
                                        disabled={loading ? true : false}
                                  
                                    >
                                        Create
                                    </Button>
                                </form>
                            </div>
                        </>}
                </div>
            </Fragment>

        </>
    );
};

export default NewProduct;
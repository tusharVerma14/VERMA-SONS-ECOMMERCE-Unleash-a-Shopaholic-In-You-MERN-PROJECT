const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeature');
const cloudinary = require('cloudinary')

// Create product --Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
    // console.log(req.body);
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    // images can be a single string (denoting simgle images) or array of string (arrya of images) likeof[
    // 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gvgSUNDX1BST0ZJTEUAAQEAAAvQAAAAAAIAAABtbnRyUkdCIFhZWiAH3wACAA8AAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAA9tYAAQAAAADTLQAAAAA9DrLerpOXvptnJs6MCkPOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBkZXNjAAABRAAAAGNiWFlaAAABqAAAABRiVFJDAAABvAAACAxnVFJDAAABvAAACAxyVFJDAAABvAAACAxkbWRkAAAJyAAAAIhnWFlaAAAKUAAAABRsdW1pAAAKZAAAABRtZWFzAAAKeAAAACRia3B0AAAKnAAAABRyWFlaAAAKsAAAABR0ZWNoAAAKxAAAAAx2dWVkAAAK0AAAAId3dHB0AAALWAAAABRjcHJ0AAALbAAAADdjaGFkAAALpAAAACxkZXNjAAAAAAAAAAlzUkdCMjAxNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;


    // console.log(req.body.user)
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    })
})
// get all product --Admin
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    // return next(new ErrorHandler('my custom error',500)) // to test custom error in usealert in frontend
    const resultPerPage = 8;
    const productCount = await Product.countDocuments();
    //   serach,filter,pagination

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter();

    let products = await apiFeature.query;

    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);
    //  .clone() using bcz it was throwing error of query already executed
    products = await apiFeature.query.clone();

    res.status(200).json({
        success: true,
        Productretrieved: products,
        TotalNoOfProductAvailableDB: productCount,
        resultPerPage,
        filteredProductsCount
    });
})

// get all product --Admin
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    });
})
// get a single product details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not found", 404));
    }
    product = await Product.findById(req.params.id);
    res.status(200).json({
        success: true,
        product
    })
})
// update product --Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }
    // Images Start Here previous images has to be destroyed and new uploaded images has to be considered
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {

        images = req.body.images;
    }

    if (images !== undefined) {

        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
    }



    product = await Product.findByIdAndUpdate(req.params.id, req.body,
        { new: true, runValidators: true, useFindAndModify: false }
    )
    res.json({
        success: true,
        product
    })
})
// delete product --Admin
exports.deleteProduct = catchAsyncError(async (req, res) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not Found"
        })
    }
    // deleting images of products from cloudianry as well  we were alredy deleting enitre product from db but the images still remain in cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id) // require public id only which we get while storing imaegs on cloudinary as a result

    }
    await Product.findByIdAndDelete(req.params.id)
    res.json({
        success: true,
        message: "Deleted File successfully!!!"
    })
})
// create review or update review(if previuosly given)
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    // collect all review related thing in our variables and then store(push in review array of Product model) it into our in a required particular product db
    const { rating, comment, productId } = req.body; // destructuring
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }
    const product = await Product.findById(productId);
    // to find if a given product(prodcutId) is alredy reviewd or not
    // if there exist a user with same id in our reviews array of product(means review alredy given) then update only his review of that particular product
    // here rev is an object and product.reviews is a array of objects
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user.id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user.id.toString()) {
                rev.rating = rating,
                    rev.comment = comment;
            }
        });
    }
    else {
        product.reviews.push(review);// simply pushing rating of that particualr product

        product.noOfReviews = product.reviews.length;// in creating the count of noOfReviews of product

    }
    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    }
    )
    product.ratings = avg / product.reviews.length;// product.ratings store the average rating and prouct.reviews.rating is rating of different users on a praticular product
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true
    })

})
// Get All Review of a Product(Single Product)
exports.getAllReviews = catchAsyncError(async (req, res, next) => {
    // console.log('hiii');
    const product = await Product.findById(req.query.id); //productId means id
    // console.log(product);
    if (!product) {
        return next(new ErrorHandler('Product Not Found', 404))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})
// Delete Review --Admin
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );
    
    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    })
});
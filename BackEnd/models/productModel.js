const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    // _id:{
    //     type:Number
    // },
    name: {
        type: String,
        required: [true, 'PLease Enter Product Name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    price: {
        type: Number,
        required: [true, 'Please Enter Product Prices'],
        maxLength: [6, "Price can't Exceed 6 digits"]
    },
    ratings: {
        type: Number,
        default: 0

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: [true, "Please Enter Product Category"]
    },
    Stock: {
        type: Number,
        required: [true, "Please Enter Product Stock"],
        maxLength: [4, "Atock Can't Exceed 4 digits"],
        default: 1
    },
    noOfReviews: {
        type: Number,
        default: 0
    },
    images: [
        // array of objects as we can take multiple images
        // each of them be having public_id and url
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true,

            }
        }],


    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ]


})

module.exports = mongoose.model('Product', productSchema);
const express = require('express');
const cookieParser = require('cookie-parser')

const app = express();
const errorMiddleware = require('./middleware/error')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
// reuired dotenv to to process.end.PORT with content of config.env
const dotenv = require('dotenv');
dotenv.config({ path: 'BackEnd/config/config.env' })
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes Import
const productRouter = require('./Routes/productRoutes');
const userRouter = require('./Routes/userRoutes');
const orderRouter = require('./Routes/orderRoutes');
const paymentRouter = require('./Routes/paymentRoutes');

app.use('/api/v1', productRouter)
app.use('/api/v1', userRouter)
app.use('/api/v1', orderRouter)
app.use('/api/v1', paymentRouter)
app.use(errorMiddleware)
module.exports = app;
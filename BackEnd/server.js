const app = require('./app');
// required dotenv to to process.end.PORT with content of config.env
const dotenv = require('dotenv');
const connectDatabase = require('./config/database')
const cloudinary=require('cloudinary')
// for the below types of error we want to immediately close our server
// handling Uncaught Exception(like console.log(youtube) gives error of youtube is not defined)
process.on("uncaughtException", (err) => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    server.close(() => {
        process.exit(1);
    })
})
// config
dotenv.config({ path: 'BackEnd/config/config.env' })
connectDatabase();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, () => {
    console.log(`server is listening at http://localhost:${process.env.PORT} `);
})


process.on("unhandledRejection", (err) => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(() => {
        process.exit(1);
    })
})
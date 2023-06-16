
const mongoose = require('mongoose');
// Connecting To The DataBase
const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URI).then((data) => {
        console.log(`Mongodb connected with server :${data.connection.host}`);
    })
    // No need to write catch as it is already handled as unhandledRejection On server.js
}
module.exports=connectDatabase;
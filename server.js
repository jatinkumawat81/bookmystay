const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});

const app = require('./app');
const connStr = process.env.CONNECTION_STRING;

mongoose.connect(connStr)
.then((conn)=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.error('Error connecting to MongoDB', err);
});

// const db = mongoose.connection;
// db.on('disconnected', ()=>{
//     console.log('MongoDB disconnected');
// });
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
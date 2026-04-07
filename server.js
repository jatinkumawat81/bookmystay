const mongoose = require('mongoose');
const app = require('./app');
const connStr = 'mongodb+srv://admin:1234@cluster0.wbqah1c.mongodb.net/bookmystay?appName=Cluster0&retryWrites=true&w=majority';
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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
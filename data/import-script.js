const mongoose = require('mongoose');
const fs = require('fs');
const Hotle = require('../models/hotel');
const connStr = "mongodb://localhost:27017/bookmystay";
mongoose.connect(connStr)
.then((conn)=>{
    console.log('script Connected to MongoDB');
}).catch((err)=>{
    console.error('Error connecting to MongoDB', err);
});

const hotels = JSON.parse(fs.readFileSync('./data/hotels.json', 'utf-8'));

const deleteDoc = async ()=>{
    try{
        await Hotle.deleteMany();
        console.log('Documents deleted successfully');
        process.exit();
    }catch(err){
        console.error('Error deleting documents', err);
    }
}

const importDoc = async ()=>{
    try{
        await Hotle.create(hotels);
        console.log('Documents imported successfully');
        process.exit();
    }catch(err){
        console.error('Error importing documents', err);
    }
}
// deleteDoc();
// importDoc();

if(process.argv[2] === '-delete'){
    deleteDoc();
}
if(process.argv[2] === '-import'){
    importDoc();
}

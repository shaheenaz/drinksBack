'use strict'
require('dotenv').config();
const express=require('express')
const cors = require('cors')
const PORT = process.env.PORT
const server = express()
server.use(cors());
server.use(express.json());
const axios = require('axios')

server.get('/all',allHandler)
server.post('/addFav',addFavHndler)
server.get('/getfav',getFavHandler)
server.delete('/deleteFav',deleteFavHandler)
server.put('/updateFav',updateHandler)




//mongo
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/drinks', {useNewUrlParser: true, useUnifiedTopology: true});

const drinksSchema = new mongoose.Schema({
    strDrink : String,
    strDrinkThumb:String,
  });



const drinksModal = mongoose.model('non-coholic', drinksSchema);











function allHandler (req,res){
    const api ='https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic'
    axios
    .get(api)
    .then(ret=>{
        res.send(ret.data.drinks)
    })
}

function addFavHndler(req,res){
    const{strDrink,strDrinkThumb}=req.body
    console.log(req.body)
    const pickked = new drinksModal({
        strDrink : strDrink,
        strDrinkThumb:strDrinkThumb,
    })
    pickked.save()

}

function getFavHandler (req,res){
    drinksModal.find({},(err,data)=>{
        res.send(data)
        console.log(data)
    })
}

function deleteFavHandler(req,res){
    const id = req.query.id
    drinksModal.deleteOne({id :id},(err,data)=>{
        drinksModal.find({},(err,data)=>{
            res.send(data)
        })
    })
}

function updateHandler (req,res){
    const {strDrink,strDrinkThumb,id} = req.body
    drinksModal.find({id:id},(err,data)=>{
        data[0].strDrink =strDrink,
        data[0].strDrinkThumb =strDrinkThumb,
        data[0].save()
        .then(()=>{
            drinksModal.find({},(err,data)=>{
                res.send(data)
            })
        })
    })
   
}


server.listen(PORT,console.log('HI'))
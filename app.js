//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyparser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const md5 = require('md5')

const app = express()

app.use(express.static('public'))

app.use(bodyparser.urlencoded({extended: true}))

app.set('view engine','ejs')

mongoose.connect('mongodb://127.0.0.1:27017/userDB',{useNewUrlParser: true})

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})


const User = mongoose.model('User',userSchema)

app.get('/',function(req,res){
    res.render('home')
})

app.get('/login',function(req,res){
    res.render('login')
})


app.get('/register',function(req,res){
    res.render('register')
})


app.post('/register',function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:md5(req.body.password)
    })

    newUser.save()
        .then(function(){
            res.render('secrets')
        })
        .catch(function(err){
            console.log(err)
        })
})

app.post('/login',function(req,res){
    const username = req.body.username
    const password = md5(req.body.password)

    User.findOne({email:username})
        .then(function(found){
            if (found.password === password){
                res.render('secrets')
            }
        })
        .catch(function(err){
            console.log(err)
        })
})







app.listen(3000,function(req,res){
    console.log('server is running on port 3000')
})
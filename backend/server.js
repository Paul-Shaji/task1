const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const UserModel = require("./models/User")

const app=express()
const router=express.Router()

app.use(cors())
app.use(express.json())



mongoose.connect('mongodb://localhost:27017/task1',{

}).then(()=> console.log('MongoDB connected'))
.catch(err => console.error(err));


app.use("/",router)
router.get("/data",(req,res)=>{
  res.send("Welcome")
  console.log("Welcome")
})

router.post("/signup",async(req,res)=>{
  try{
    console.log(req.body)
    const password=await bcrypt.hash(req.body.password,10)
    console.log(password)
    var user=await UserModel.create({
      username:req.body.username,
      email:req.body.email,
      password:password
    })
    user.save()
    res.status(200).send("User Created Successfully")
  } catch(err){
    console.error(err)
    res.status(500).send("Error creating user")
  }
})

router.post("/login",async(req,res)=>{
  console.log(req.body)
  const user=await UserModel.findOne({username:req.body.username})
  if(user){
    console.log(user)
    const auth=await bcrypt.compare(req.body.password,user.password)
    if(auth){
      res.status(200).send("Login Successful")
    }
    else{
      res.status(400).send("password incorrect")
    }
  }else{
    res.status(400).send("usser not exist")
  }
})


app.listen(3000,()=>{
  console.log("server is running")
})
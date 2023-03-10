const { request, response } = require('express');
const express=require('express')
const mongoose=require('mongoose')
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')
const cors = require('cors')
const UserData = require('./model')



const app = express();
app.use(cors())
app.use(express.json())
const mongooseData = mongoose.connect('mongodb+srv://bhagyashree:bhagya5799@cluster0.q2xpdj1.mongodb.net/?retryWrites=true&w=majority').then(
    () => console.log('db connected.....')
).catch(err => console.log(err, "DB error running"))



  
app.post("/add", async (request,response) =>{
    const { userName, email, password, confirmPassword,id}=request.body
    try{
        const getEmail = await UserData.findOne({email:email})
        if (getEmail){
            response.status(400)
            response.send({ status: false, msg: 'User Already Exist'})
        }
        if (password!==confirmPassword){
            response.status(400)
            response.send({ status: false, msg: 'password are not matched' })
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUserData = new UserData({ userName, email, password:hashedPassword,confirmPassword,id})
            await newUserData.save()
            response.status(200)
            response.send({ status: true, msg: 'Registered Successfully' })
        }
    }
    catch(err){
        console.log(err.message)
        response.status(500)
        response.send({ status: false, msg: 'Internal Server Error' })

    }
})

app.post("/login", async(request,response) => {
    const  {email,password}=request.body
    try{
        const dbUserIn = await UserData.findOne({ email: email })
        if (dbUserIn !== undefined) {
            const checkPassword = await bcrypt.compare(password, dbUserIn.password);
            console.log(checkPassword)
            if (checkPassword === true) {
                const payload = { username: username };
                const jwtToken = jwt.sign(payload, "SECRET_ID");
                response.send({ jwtToken });
            } else {
                response.status(400);
                response.send("Invalid password");
            }
        } else {
            response.status(400);
            response.send("Invalid user");
        } 
    }
    catch(err){
        console.log(err.message)
    }
})


// app.get('/', (request, response) => {
//     response.send('hello world...')
// })

app.listen(3008,() =>{
    console.log(' server running.......')
})




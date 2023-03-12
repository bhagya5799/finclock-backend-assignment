const { request, response } = require('express');
const express= require('express')
const mongoose=require('mongoose')
const bcrypt = require('bcrypt')
const cors = require('cors')
const UserData = require('./model')
const jwt=require('jsonwebtoken');



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

app.post("/login", async (request,response) => {
    const  {email,password}=request.body
    try{
        const userData = await UserData.findOne({ email: email})
        console.log(userData)
        
        if (userData!==null) {
            const checkPassword = await bcrypt.compare(password, userData.password);
            if (checkPassword === true) {
                const payload = { email: email };
                const jwtToken = jwt.sign(payload, "SECRET_ID", {expiresIn: 3600000} );
                response.send({ jwtToken });
            } else {
                response.status(400);
                response.send({ msg: "Invalid password" });
            }
        } else {
            response.status(400);
            response.send({ msg: "Invalid Email" });
        } 
    }
    catch(err){
        console.log(err.message)
    }
})


const authenticateToken =  (request, response, next) => {
    let jwtToken;
    const authenticateHeader = request.headers["authorization"];
    if (authenticateHeader !== undefined) {
        jwtToken = authenticateHeader.split(" ")[1];
    } else {
        response.status(401);
        response.send({ msg:"Invalid JWT Token" });
    }

    if (jwtToken !== undefined) {
        jwt.verify(jwtToken, "SECRET_ID", async (error, payload) => {
            if (error) {
                response.status(401);
                response.send({ msg: "Invalid JWT Token" });
            } else {
                request.email = payload.email;
                console.log(payload.email)
                next();
            }
        });
    }
};


app.get('/userName', authenticateToken, async (request, response) => {
    let {email} =request;
    console.log(email)
    try {
        const getData = await UserData.find({email: email})
        console.log(getData)
        response.send(getData)
    }
    catch (err) {
        response.send(err.message)
    }
})




app.listen(process.env.PORT || 3008, () => console.log('port running '))



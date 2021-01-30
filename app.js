const express=require('express');
const jwt=require('jsonwebtoken');


const app=express();

app.get("/api",(req,res)=>{
    res.json({
        message:'Welcome to the API'
    });
})
///route need to protect
//verifyToken middleware function
app.post("/api/posts",verifyToken,(req,res)=>{
    //now token in req as done in middleware
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                message:'Post created.',
                authData
            })
        }
    })
    
})

///to get the jwt token
app.post("/api/login",(req,res)=>{
    //Mock user
    const user={
        id:1,
        username:'username',
        email:'username@gmail.com'
    }
    //asyn style
    ///to include expire time
    //jwt.sign({user:user},'secretkey',{expireIn:'30s'},(err,token)=>{
    jwt.sign({user:user},'secretkey',(err,token)=>{
        res.json({
            token:token
        });
    });
})
//FORMAT OF TOKEN
//authorization: Bearer <access_token>

function verifyToken(req,res,next){
    //Get auth header value
    const bearerHeader=req.headers['authorization'];
    //check if bearer is undefined
    if(typeof bearerHeader!=='undefined'){
        //split at the space
        const bearer=bearerHeader.split(' ');
        //Get token from array
        const bearerToken=bearer[1];
        //Set the token
        req.token=bearerToken;
        //Next middleware
        next();
    }else{
        //Forbidden
        res.sendStatus(403);
    }
}

app.listen(5000,()=>{
    console.log('Server started on port 5000');
})

const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const errorMiddleware = require('./middlewares/errorMiddleware.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
app.use(errorMiddleware)
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here

    if(req.session.authorization){
        const token = req.session.authorization['accessToken']
        jwt.verify(token,"access", (err,user)=>{
            if(!err){
                req.user = user
                next()
            }else{
                return res.status(403).json({message: "User not authenticated"})
            }
        })
    }else{
        return res.status(403).json({message: "User not logged in"})
    }
});
 
const PORT = 4000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log(`Server is running on http://localhost:${PORT}`));

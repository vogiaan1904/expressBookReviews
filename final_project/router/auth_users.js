const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validatedUser = Object.values(users).filter((user)=>{
      return (user.username === username && user.password === password)
  })
  if(validatedUser[0]){
    return true
  }else{
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password

  if(!username || !password){
    return res.status(404).json({message: "Please fill in both username and password!"})
  }

  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data: 
        password
    },'access',{expiresIn: 60 * 60})

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in!")
  }else{
    return res.status(208).json("Can not login. Check username and password!")
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = +req.params.isbn
  let filteredBook = Object.values(books).filter((book)=> {
    return isbn === book.isbn
  })
  if(filteredBook[0]){
    filteredBook = filteredBook[0]
    const review = req.query.review
    const authorization = req.session.authorization;

    if(review && authorization){
      const username = authorization.username
      filteredBook.reviews[username] = review
      return res.status(200).json({ message: "Review added/updated successfully", book: filteredBook });
    }else {
      return res.status(400).json({ message: "Review or username is missing" });
    }
  }else{
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

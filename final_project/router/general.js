const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if(username && password){
    userWithSameUname = Object.values(users).filter((user)=>{
      return username === user.username
    })
    if(!userWithSameUname[0]){
      users.push({"username": username, "password": password})
      res.status(200).json({message: "User successfully registered."})
    }else{
      res.status(404).json({message: "User already exists!"})
      
    }
  }
  return res.status(404).json({message: "Can not register user."})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = +req.params.isbn
  const bookByIsbn = Object.values(books).filter((book)=>{
    if(isbn === book.isbn)
      return book
  })
  return res.send(JSON.stringify(bookByIsbn,null,4))
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  const booksByAuthor = Object.values(books).filter((book)=>{
    return book.author === author
  })
  return res.send(JSON.stringify(booksByAuthor,null,4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title
  const booksByTitle = Object.values(books).filter((book)=>{
    return book.title === title
  })
  return res.send(JSON.stringify(booksByTitle,null,4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const reviews = Object.values(books).filter((book)=>{
    if(book.isbn === isbn){
      return book.reviews
    }
  })
  return res.send(JSON.stringify(reviews,null,4))
});

module.exports.general = public_users;

const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if(username && password){
    if(isValid(username)){
      users.push({"username": username, "password": password})
      res.status(200).json({message: "User successfully registered."})
    }else{
      res.status(404).json({message: "User already exists!"})
      
    }
  }
  return res.status(404).json({message: "Can not register user."})
});



// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const booksList = await new Promise((resolve,reject)=>{
      if(books){
        resolve(books)
      }else{
        reject("No books available.")
      }
    })
    return res.send(JSON.stringify(booksList,null,4))
  } catch (error) {
    return res.status(500).send(error)
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
  const isbn = +req.params.isbn
  try {
    const bookByIsbn = await new Promise((resolve,reject)=>{
      const response  = Object.values(books).filter((book)=>{
        if(isbn === book.isbn)
          return book
      })
      if(response[0]){
        resolve(response[0])
      }else{
        reject('Book not found.')
      }
    })
    return res.send(JSON.stringify(bookByIsbn,null,4))
  } catch (error) {
    return res.status(500).send(error)
  }
});
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  const author = req.params.author
  try {
    const booksByAuthor = await new Promise((resolve,reject)=> {
      const response = Object.values(books).filter((book)=>{
        return book.author === author
      })
      if(response[0]){
        resolve(response)
      }else{
        reject('No books by this author available.')
      }
    })
    return res.send(JSON.stringify(booksByAuthor,null,4))
  } catch (error) {
    return res.status(500).send(error)
  }
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  //Write your code here
  const title = req.params.title
  try {
    const booksByTitle = await new Promise((resolve,reject)=>{
      const response = Object.values(books).filter((book)=>{
        return book.title === title
      })
      if(response[0]){
        resolve(response[0])
      }else{
        reject('Book not found.')
      }
    })
    return res.send(JSON.stringify(booksByTitle,null,4))
  } catch (error) {
    return res.status(500).send(error)
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = +req.params.isbn
  let filteredBook = Object.values(books).filter((book)=>{
    return book.isbn === isbn
  })
  if(filteredBook[0]){
    filteredBook = filteredBook[0]
    const reviews = filteredBook.reviews
    return res.send(JSON.stringify(reviews,null,4))
  }else{
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = {};
  const bookKeys = Object.keys(books);
  for (let key of bookKeys) {
    if (books[key].author === author) {
      matchingBooks[key] = books[key];
    }
  }
  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  }
  return res.status(404).json({message: "No books found for the given author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = {};
  const bookKeys = Object.keys(books);
  for (let key of bookKeys) {
    if (books[key].title === title) {
      matchingBooks[key] = books[key];
    }
  }
  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  }
  return res.status(404).json({message: "No books found for the given title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;

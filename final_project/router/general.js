const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({message: "Username already exists"});
  }

  users.push({ username, password });
  return res.status(200).json({message: "User successfully registered"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get the book list available in the shop using Axios async/await
public_users.get('/axios/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:3000/');
    const booksData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    return res.status(200).json(booksData);
  } catch (error) {
    return res.status(500).json({message: 'Unable to fetch books via Axios', error: error.message});
  }
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

// Get book details based on ISBN using Axios async/await
public_users.get('/axios/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:3000/isbn/${isbn}`);
    const bookData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    return res.status(200).json(bookData);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({message: "Book not found"});
    }
    return res.status(500).json({message: 'Unable to fetch book details via Axios', error: error.message});
  }
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

// Get book details based on author using Axios async/await
public_users.get('/axios/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:3000/author/${encodeURIComponent(author)}`);
    const authorData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    return res.status(200).json(authorData);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({message: "No books found for the given author"});
    }
    return res.status(500).json({message: 'Unable to fetch author details via Axios', error: error.message});
  }
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

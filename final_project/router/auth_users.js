const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "testuser", password: "testpass" }
];

const isValid = (username)=>{ //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({message: "Invalid username or password"});
  }

  let accessToken = jwt.sign({data: username}, "access", {expiresIn: 60 * 60});
  req.session.authorization = {accessToken};
  return res.status(200).json({message: "User successfully logged in", accessToken});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.data;

  if (!review) {
    return res.status(400).json({message: "Review text is required"});
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  book.reviews[username] = review;
  return res.status(200).json({message: "Review added/modified successfully"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data;

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!book.reviews[username]) {
    return res.status(404).json({message: "Review not found"});
  }

  delete book.reviews[username];
  return res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

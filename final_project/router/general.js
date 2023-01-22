const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const password=req.body.password;
    const username=req.body.username;
    if(password && username){
    if(isValid(username)){
        const user={
            "username":username,
            "password":password
        }
        users.push(user);
        res.status(200).send(`user ${username} registered`);
    }
    res.status(404).send("username already exists");}
    else res.status(404).send("username and/or password not valid");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    res.send(JSON.stringify(books[req.params.isbn],null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let booksArray = Object.values(books);
    res.send(JSON.stringify(booksArray.filter(book => book.author === req.params.author),null,4));

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksArray = Object.values(books);
    res.send(JSON.stringify(booksArray.filter(book => book.title === req.params.title),null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book=books[req.params.isbn];
    if(book)
        res.send(JSON.stringify(book.reviews,null,4));
    else res.send("Book not found");
});
//task 10
async function getAllBooks(){
    return new Promise((resolve,reject)=>{
        resolve(books);
    })
} 
public_users.get('/',async function (req, res) {
    const books_async=await getAllBooks();
    res.send(JSON.stringify(books_async,null,4));
});

//task 11
function getBookByISBN(isbn){
    return new Promise((resolve,reject)=>{
        const book=books[isbn];
        if(book)
        resolve(book);
        else reject("ISBN not found");
    })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    getBookByISBN(req.params.isbn).then(
        book=>res.send(JSON.stringify(book,null,4)))
    .catch(err => res.status(404).send(err));
 });

 //task 12
 function getBookByAuthor(author){
     return new Promise((resolve,reject)=>{
        let booksArray = Object.values(books);
        const book=booksArray.filter(book => book.author === author);
        if(book)
            resolve(book);
        else reject("author not found");
     })
 }
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    getBookByAuthor(req.params.author)
    .then(book => res.send(JSON.stringify(book,null,4)))
    .catch(err => res.status(404).send(err));
});

//task 13
function getBookByTitle(title){
    return new Promise((resolve,reject)=>{
       let booksArray = Object.values(books);
       const book=booksArray.filter(book => book.title === title);
       if(book)
           resolve(book);
       else reject("title not found");
    })
}
// Get book details based on tite
public_users.get('/title/:title',function (req, res) {
   getBookByTitle(req.params.title)
   .then(book => res.send(JSON.stringify(book,null,4)))
   .catch(err => res.status(404).send(err));
});

module.exports.general = public_users;

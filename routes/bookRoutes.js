const express = require("express");
const router = express.Router();
const {
  welcomePage,
  homePage,
  getAllBooks,
  getBookInfo,
  addNewBook,
  postNewBook,
  editNewBook,
  putNewBook,
  deleteBook,
} = require("../controllers/books");

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// BookRoutes

router.get("/", forwardAuthenticated, welcomePage);

router.get("/home", ensureAuthenticated, homePage);

router.get("/books", ensureAuthenticated, getAllBooks);

router.get("/books/:id", ensureAuthenticated, getBookInfo);

router.get("/home/addbook", ensureAuthenticated, addNewBook);

router.post("/home/addbook", ensureAuthenticated, postNewBook);

router.get("/books/:id/edit", ensureAuthenticated, editNewBook);

router.put("/books/:id", ensureAuthenticated, putNewBook);

router.delete("/books/delete/:id", ensureAuthenticated, deleteBook);

module.exports = router;

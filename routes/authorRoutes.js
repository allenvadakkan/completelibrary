const express = require("express");
const router = express.Router();
const { getAllAuthors, getAuthorInfo } = require("../controllers/authors");

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Author Routes

router.get("/authors", ensureAuthenticated, getAllAuthors);

router.get("/authors/:id", ensureAuthenticated, getAuthorInfo);

module.exports = router;
const BookData = require("../models/Book");

const nav = [
  { link: "/home", name: "Home" },
  { link: "/books", name: "Books" },
  { link: "/authors", name: "Authors" },
];

module.exports = {
  getAllAuthors: (req, res) => {
    BookData.find().then((authors) => {
      res.render("authors", {
        id: req.user._id,
        username: req.user.name,
        nav,
        page_title: "authors",
        authors,
      });
    });
  },

  getAuthorInfo: (req, res) => {
    const id = req.params.id;
    BookData.findOne({ _id: id }).then((author) => {
      res.render("author", {
        id: req.user._id,
        nav,
        page_title: "author",
        author,
      });
    });
  },
};

const BookData = require("../models/Book");

const imageMimeTypes = ["image/jpeg", "image/png", "images/jpg"];

const nav = [
  { link: "/home", name: "Home" },
  { link: "/books", name: "Books" },
  { link: "/authors", name: "Authors" },
];

module.exports = {
  welcomePage: (req, res) => {
    res.render("welcome");
  },

  homePage: (req, res) => {
    res.render("home", {
      id: req.user._id,
      username: req.user.name,
      nav,
      page_title: "home",
    });
  },

  getAllBooks: (req, res) => {
    BookData.find()
      .then((books) => {
        res.render("books", {
          id: req.user._id,
          username: req.user.name,
          nav,
          page_title: "books",
          books,
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  },

  getBookInfo: (req, res) => {
    const id = req.params.id;
    BookData.findOne({ _id: id })
      .then((book) => {
        res.render("book", {
          id: req.user._id,
          nav,
          page_title: "book",
          book,
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  },

  addNewBook: (req, res) => {
    res.render("addbook", {
      id: req.user._id,
      nav,
      username: req.user.name,
      page_title: "addbook",
    });
  },

  postNewBook: (req, res) => {
    const {
      title,
      author,
      genre,
      about_author,
      book_description,
      pages,
      publisher,
      language,
      published_year,
    } = req.body;

    let errors = [];

    if (
      !title ||
      !author ||
      !genre ||
      !about_author ||
      !book_description ||
      !pages ||
      !publisher ||
      !language ||
      !published_year
    ) {
      errors.push({ msg: "Required fields cannot be empty!" });
    }

    if (about_author.split(" ").length > 100) {
      errors.push({ msg: "About author cannot be greater than 100 words." });
    }

    if (book_description.split(" ").length > 100) {
      errors.push({
        msg: "Book description cannot be greater than 100 words.",
      });
    }

    if (/[^a-zA-Z]/.test(language)) {
      errors.push({ msg: "Language should be a string!" });
    }

    if (errors.length > 0) {
      res.render("addbook", {
        id: req.user._id,
        errors,
        nav,
        username: req.user.name,
        page_title: "addbook",
      });
    } else {
      var bookInfo = new BookData({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        about_author: req.body.about_author,
        book_description: req.body.book_description,
        language: req.body.language,
        publisher: req.body.publisher,
        published_year: req.body.published_year,
        pages: req.body.pages,
      });

      saveAuthorImage(bookInfo, req.body.author_image);
      saveBookCover(bookInfo, req.body.book_cover);

      bookInfo.save(function (err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log("book added successfully!");
        }
      });
      req.flash("success_msg", "Book Added Successfully!");
      res.redirect("/books");
    }
  },

  editNewBook: (req, res) => {
    const id = req.params.id;
    BookData.findOne({ _id: id }).then((book) => {
      res.render("editbook", {
        id: req.user._id,
        nav,
        username: req.user.name,
        page_title: "editbook",
        book,
      });
    });
  },

  putNewBook: (req, res) => {
    const id = req.params.id;
    let updatedBookInfo = {};

    if (req.body.title) updatedBookInfo.title = req.body.title;
    if (req.body.author) updatedBookInfo.author = req.body.author;
    if (req.body.genre) updatedBookInfo.genre = req.body.genre;
    if (req.body.about_author)
      updatedBookInfo.about_author = req.body.about_author;
    if (req.body.book_description)
      updatedBookInfo.book_description = req.body.book_description;
    if (req.body.language) updatedBookInfo.language = req.body.language;
    if (req.body.publisher) updatedBookInfo.publisher = req.body.publisher;
    if (req.body.published_year)
      updatedBookInfo.published_year = req.body.published_year;
    if (req.body.pages) updatedBookInfo.pages = req.body.pages;
    if (req.body.author_image)
      saveAuthorImage(updatedBookInfo, req.body.author_image);
    if (req.body.book_cover)
      saveBookCover(updatedBookInfo, req.body.book_cover);
    updatedBookInfo = { $set: updatedBookInfo };
    BookData.updateOne({ _id: id }, updatedBookInfo)
      .then(() => {
        req.flash("success_msg", "Book Updated Successfully!");
        res.redirect(`/books/${id}`);
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
        req.flash("error_msg", "Error Occurred!!");
      });
  },

  deleteBook: (req, res, next) => {
    BookData.findByIdAndRemove({ _id: req.params.id })
      .then(() => {
        req.flash("error", "Book Deleted Successfully!");
        res.redirect("/books");
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  },
};

function saveAuthorImage(bookInfo, author_image) {
  if (author_image == null) return;
  const image = JSON.parse(author_image);
  if (image != null && imageMimeTypes.includes(image.type)) {
    bookInfo.author_image = new Buffer.from(image.data, "base64");
    bookInfo.authorImageType = image.type;
  }
}

function saveBookCover(bookInfo, book_cover) {
  if (book_cover == null) return;
  const image = JSON.parse(book_cover);
  if (image != null && imageMimeTypes.includes(image.type)) {
    bookInfo.book_cover = new Buffer.from(image.data, "base64");
    bookInfo.bookCoverType = image.type;
  }
}

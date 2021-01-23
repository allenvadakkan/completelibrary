const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  author_image: {
    type: Buffer,
    required: true
  }, 
  authorImageType: {
    type: String,
  },
  book_cover: {
    type: Buffer,
    required: true
  },
  bookCoverType: {
    type: String,
    required: true
  },
  about_author: {
    type: String,
    required: true
  },
  book_description: {
    type: String,
    required: true
  },
  pages: {
    type: Number,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  published_year: {
    type: Number,
    required: true
  }
});

BookSchema.virtual('authorImagePath').get(function() {
  if (this.author_image != null && this.authorImageType != null) {
    return `data:${this.authorImageType};charset=utf-8;base64,${this.author_image.toString('base64')}`
  }
})

BookSchema.virtual('bookCoverPath').get(function() {
  if (this.book_cover != null && this.bookCoverType != null) {
    return `data:${this.bookCoverType};charset=utf-8;base64,${this.book_cover.toString('base64')}`
  }
})


var BookData = mongoose.model("books", BookSchema);

module.exports = BookData;

const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      maxLength: 80,
      required: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },

    genre: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Book = require("./models/book");
const Author = require("./models/author");

/*
  We create an express app calling
  the express function.
*/
const app = express();

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html
*/
app.use(cors());
app.use(express.json());
app.use(function log(req, res, next) {
  req.time = new Date();
  console.log(req.time, req.method, req.hostname + req.originalUrl);
  next();
});

/*
  Endpoint to handle GET requests to the root URI "/"
*/
app.get("/", (req, res) => {
  res.json({
    "/books": "list of books",
  });
});

app.get("/books", (req, res) => {
  const genre = req.query.genre;
  Book.find({ genre: `${genre}` })
    .populate("author")
    .then((books) => {
      console.log(books);
      res.status(200).send(books);
    })
    .catch(() => {
      res.status(500);
      res.send("Something went wrong");
    });
});

app.get("/books/:id", function (req, res) {
  Book.findById(req.params.id)
    .then((book) => {
      if (book) {
        console.log("Book found");
        res.send(book);
      } else {
        console.log("Book not found");
        res.status(404).json("404 Book not found"); //.send only send json if object or array. If string than its plain text.
      }
    })
    .catch(() => {
      res.status(500);
      res.send("Something went wrong");
    });
});

app.post("/books", (req, res) => {
  Book.create(req.body)
    .then((newBook) => {
      res.status(201).send(newBook);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

app.patch("/books/:id", function (req, res) {
  Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedBook) => {
      if (updatedBook) {
        console.log("Book updated");
        res.status(200).send(updatedBook);
      } else {
        console.log("Book not found, hence couldn't be updated");
        res.status(404).send("404 Book not found");
      }
    })
    .catch(() => {
      res.status(500);
      res.send("Something went wrong");
    });
});

app.delete("/books/:id", function (req, res) {
  Book.findByIdAndDelete(req.params.id)
    .then(() => {
      console.log("deleted successfully");
      res.status(204).end(); //just end without sending a body
    })
    .catch(() => {
      res.status(500);
      res.send("Something went wrong");
    });
});

app.get("/authors", (req, res) => {
  Author.find()
    .then((authors) => {
      console.log(authors);
      res.send(authors);
    })
    .catch(() => {
      res.status(500);
      res.send("Something went wrong");
    });
});

app.post("/authors", (req, res) => {
  Author.create(req.body)
    .then((newAuthor) => {
      res.status(201).send(newAuthor);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

/*
  We have to start the server. We make it listen on the port 4000

*/

const { MONGO_URL } = process.env;

mongoose
  .connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to mongo");
    app.listen(4000, () => {
      console.log("Listening on http://localhost:4000");
    });
  })
  .catch((error) => {
    console.error(error);
  });

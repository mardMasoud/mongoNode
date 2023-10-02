import express from "express";
const app = express();
import { connectToDb, getDb } from "./db.js";
import { ObjectId } from "mongodb";

//db connection
let dbconnectToDb;
let db;
connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log("run server");
        });
        db = getDb();
    }
});
//mongodb://localhost:27017

app.get("/books", (req, res) => {
    let books = [];
    db.collection("books")
        .find()
        .sort({ title: 1 })
        .forEach((book) => {
            books.push(book);
        })
        .then(() => {
            res.json(books);
        });
});

app.get("/books/:id", (req, res) => {
    console.log(req.params);
    if (ObjectId.isValid(req.params.id)) {
        db.collection("books")
            .findOne({ _id: new ObjectId(req.params.id) })
            .then((doc) => res.json(doc))
            .catch((err) => res.json({ er: "error" }));
    } else res.json("not valid");
});
app.use(express.json());
app.post("/books",  (req, res) => {
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Origin", "*");
    
    const book1 =req.body;

    console.log(book1);

    db.collection("books")
        .insertOne(book1)
        .then((newdoc) => res.json(newdoc))
        .catch((err) => res.json(err));
});

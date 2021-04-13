// Dependencies
//made sure to require express.
var express = require("express");
var fs = require("fs");
var app = express();
//PORT to listen on
const PORT = process.env.PORT || 3000;
var archive = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
// Sets up the Express app, handles the parsing of data
app.use(express.urlencoded({
  extended: true
}));

app.use(express.json());
app.use(express.static('public'));
var dataBase = require("./db/db.json");
const path = require('path');

//Setting up filepaths

//Get and send response
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });
  
  app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, './db/db.json'))
  });

// post to path
//set up new variables based on data
  app.post("/api/notes", function (req, res) {
    let newNote = req.body;
    let myId = (archive.length).toString();
    newNote.id = myId;
    archive.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(archive));
    res.json(archive);
  });

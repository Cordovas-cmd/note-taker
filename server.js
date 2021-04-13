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
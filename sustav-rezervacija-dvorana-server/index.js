const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { join } = require("path");
const path = require("path");
const multer = require("multer");
const upload = multer();
const jwt = require("jsonwebtoken");
const config = require("../sustav-rezervacija-dvorana-server/auth.config.js");
const authJwt = require("../sustav-rezervacija-dvorana-server/authJwt.js");

const app = express();
const port = 3000;

// Parser za JSON podatke
app.use(bodyParser.json());

// Parser za podatke iz formi
app.use(bodyParser.urlencoded({ extended: true }));

// Postavke direktorija za statičke datoteke
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "*" }));

const connection = mysql.createConnection({
  host: "student.veleri.hr",
  user: "dlulic",
  password: "11",
  database: "dlulic",
});

app.use(express.urlencoded({extended: true}));

connection.connect();

// Dohvati sve korisnike iz tablice "korisnici"
app.get("/api/korisnici", authJwt.verifyTokenAdmin, (req, res) => {
  connection.query("SELECT * FROM korisnici", (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

// login
// Unos novog korisnika (tablica "korisnici")
// Unos novog studijskog programa (tablica "studijskiProgrami")
// Unos novog kolegija (tablica "kolegij")
// Unos nove dvorane (tablica "dvorane")
// Prelged/Dohvati zauzeća dvorane (tablica "entry")
// Pregled/Dohvati popis nastavnika (tablica "korisnici") (uloga = nastavnik)
// Pregled/Dohvati dvorane (tablica "dvorane")
// Pregled/Dohvati kolegiji (tablica "kolegij")

app.listen(port, () => {
  console.log("Server running at port: " + port);
});
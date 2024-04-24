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
app.post("/login", function (req, res) {
  const data = req.body;
  const korisnickoIme = data.korisnicko_ime;
  const password = data.password;

  connection.query("SELECT * FROM korisnici WHERE korisnicko_ime = ? AND lozinka = ?", [korisnickoIme, password], function (err, result) {
    if (err) {
      res.status(500).json({ success: false, message: "Internal server error" });
    } else if (result.length > 0) {
      res.status(200).json({ success: true, message: "Prijava uspješna!" });
    } else {
      res.status(401).json({ success: false, message: "Krivo korisničko ime ili lozinka!" });
    }
  });
});

//logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.status(200).json({ message: "Logout successful" });
    }
  });
});

// Unos novog korisnika (tablica "korisnici")
app.post('/unosKorisnika', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  korisnik = [[data.id_korisnik, data.korisnicko_ime,  data.ime, data.prezime, data.lozinka, data.uloga]]
  connection.query('INSERT INTO korisnci (id_korisnik, korisnicko_ime, ime, prezime, lozinka, uloga) VALUES ?',
  [korisnik], function (error, results, fields) {
    if (error) throw error;
    console.log('data', data)
    return response.send({ error: false, data: results, message: 'Korisnik je dodan.' });
  });
});

// Unos novog studijskog programa (tablica "studijskiProgrami")
app.post('/unosStudijskogPrograma', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  studijskiprogram = [[data.id_StudijskogPrograma, data.naziv]]
  connection.query('INSERT INTO studijskiProgrami (id_StudijskogPrograma, naziv) VALUES ?',
  [studijskiprogram], function (error, results, fields) {
    if (error) throw error;
    console.log('data', data)
    return response.send({ error: false, data: results, message: 'Korisnik je dodan.' });
  });
});

// Unos novog kolegija (tablica "kolegij")
app.post('/unosKolegija', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  novikolegij = [[data.id_kolegija, data.naziv,  data.id_korisnika, data.id_StudijskogPrograma]]
  connection.query('INSERT INTO korisnci (id_kolegija, naziv) VALUES ?',
  [novikolegij], function (error, results, fields) {
    if (error) throw error;
    console.log('data', data)
    return response.send({ error: false, data: results, message: 'Korisnik je dodan.' });
  });
});

// Unos nove dvorane (tablica "dvorane")
app.post('/unosDvorane', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  dvorana = [[data.id_dvorane, data.naziv,  data.opis, data.svrha]]
  connection.query('INSERT INTO dvorane (id_dvorane, naziv, opis, svrha) VALUES ?',
  [dvorana], function (error, results, fields) {
    if (error) throw error;
    console.log('data', data)
    return response.send({ error: false, data: results, message: 'Korisnik je dodan.' });
  });
});

// Prelged/Dohvati zauzeća dvorane (tablica "entry")
app.get("/api/entry/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
      "SELECT id_entry, naziv, tip, opis, status, start_time, end_time, id_dvorane, id_korisnik, id_kolegij, id_studijskiProgrami",
      [id],
      (error, results) => {
          if (error) throw error;
          res.send(results);
      }
  );
});

// Zahtjev rezervacija dvorana
app.post('/api/zahtjevRezervacija', authJwt.verifyTokenAdminOrUser, function (request, response) {
  const data = request.body;
  zahtjev = [[data.id_entry, data.naziv,  data.tip, data.opis, data.start_time, data.end_time, data.id_dvorane, data.id_korisnik, data.id_kolegij, data.id_studijskiProgrami]]
  connection.query('INSERT INTO entry (id_entry, naziv, tip, opis, start_time, end_time, id_dvorane, id_korisnik, id_kolegij, id_studijskiProgrami) VALUES ?', [zahtjev], function (error, results, fields) {
    if (error) throw error;
    console.log('data', data)
    return response.send({ error: false, data: results, message: 'Korisnik je dodan.' });
  });
});

// Pregled rezervacija
app.get('/api/rezervacije', authJwt.verifyTokenAdminOrUser, (req, res) => {
  connection.query("SELECT * FROM entry", (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

// Pregled/Dohvati popis korisnika
app.get('/api/korisnici', authJwt.verifyTokenAdmin, (req, res) => {
  connection.query("SELECT * FROM korisnici", (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

// Pregled/Dohvati dvorane (tablica "dvorane")
app.get('/api/dvorane', (req, res) => {
  connection.query("SELECT * FROM dvorane", (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

// Pregled/Dohvati kolegiji (tablica "kolegij")
app.get('/api/kolegiji', (req, res) => {
  connection.query("SELECT * FROM kolegij", (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

app.listen(port, () => {
  console.log("Server running at port: " + port);
});
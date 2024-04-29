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
  connection.query("SELECT * FROM korisnici WHERE aktivan = '1'", (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

// Dohvati korisnika po id-u (tablica "korisnici")
app.get('/api/pojed_korisnici/:idKorisnika', authJwt.verifyTokenAdmin, function (request, response) {
  const idKorisnika = request.params.idKorisnika;
  connection.query("SELECT * FROM korisnici WHERE aktivan = '1' AND id_korisnik = ?", [idKorisnika], function (error, results, fields) {
    if (error) throw error;
    
    response.send(results);
  });
});

// login
app.post("/api/login", function (req, res) {
  const data = req.body;
  const korisnickoIme = data.korisnicko_ime;
  const password = data.password;

  connection.query("SELECT * FROM korisnici WHERE korisnicko_ime = ? AND aktivan = '1'", [korisnickoIme], function (err, result) {
    if (err) {
      res.status(500).json({ success: false, message: "Internal server error" });
    } else if (result.length > 0) {
      // Compare passwords
      bcrypt.compare(password, result[0].lozinka, function (err, bcryptRes) {
        if (bcryptRes) {
          // Generate JWT token
          const token = jwt.sign({ id: result[0].id_korisnik, korisnicko_ime: result[0].korisnicko_ime, uloga: result[0].uloga }, config.secret);
          res.status(200).json({ success: true, message: "Login successful", token: token });
          console.log("Token: ", token);
        } else {
          res.status(401).json({ success: false, message: "Invalid korisnicko ime or password " });
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid korisnicko ime or password" });
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
app.post('/api/unosKorisnika', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  const saltRounds = 10;

  bcrypt.hash(data.password, saltRounds, function (err, hash) {
    if (err) {
      console.error("Error hashing password:", err);
      return response.status(500).json({ error: true, message: "Error hashing password." });
    }

    const korisnik = [[data.id_korisnik, data.korisnicko_ime, data.ime, data.prezime, hash, data.uloga, "1"]];
    connection.query('INSERT INTO korisnici (id_korisnik, korisnicko_ime, ime, prezime, lozinka, uloga, aktivan) VALUES ?', [korisnik], function (error, results, fields) {
      if (error) {
        console.error('Insert error:', error);
        return response.status(500).send({ error: true, message: 'Error adding user' });
      }
      console.log('Inserted data:', data);
      return response.send({ error: false, data: results, message: 'Korisnik je dodan.' });
    });
  });
});

// Unos novog studijskog programa (tablica "studijskiProgrami")
app.post('/unosStudijskogPrograma', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  const studijskiprogram = [[data.id_StudijskogPrograma, data.naziv, data.aktivan]]
  connection.query('INSERT INTO studijskiProgrami (id_StudijskogPrograma, naziv, aktivan) VALUES ?',
  [studijskiprogram], function (error, results, fields) {
    if (error) throw error;
    console.log('data', data)
    return response.send({ error: false, data: results, message: 'Korisnik je dodan.' });
  });
});

// Unos novog kolegija (tablica "kolegij")
app.post('/unosKolegija', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  const novikolegij = [[data.id_kolegija, data.naziv,  data.id_korisnika, data.id_StudijskogPrograma, data.aktivan]]
  connection.query('INSERT INTO kolegij (id_kolegija, naziv, id_korisnika, id_StudijskogPrograma, aktivan) VALUES ?',
  [novikolegij], function (error, results, fields) {
    if (error) throw error;
    console.log('data', data)
    return response.send({ error: false, data: results, message: 'Kolegij je dodan.' });
  });
});

// Unos nove dvorane (tablica "dvorane")
app.post('/unosDvorane', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  const dvorana = [[data.id_dvorane, data.naziv,  data.opis, data.svrha, data.aktivan]]
  connection.query('INSERT INTO dvorane (id_dvorane, naziv, opis, svrha, aktivan) VALUES ?',
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
      "SELECT id_entry, naziv, tip, opis, status, start_time, end_time, id_dvorane, id_korisnik, id_kolegij, id_studijskiProgrami WHERE id_dvorane = ? AND status = 'aktivan'",
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
  const zahtjev = [[data.id_entry, data.naziv,  data.tip, data.opis, data.status, data.start_time, data.end_time, data.id_dvorane, data.id_korisnik, data.id_kolegij, data.id_studijskiProgrami]]
  connection.query('INSERT INTO entry (id_entry, naziv, tip, opis, status, start_time, end_time, id_dvorane, id_korisnik, id_kolegij, id_studijskiProgrami) VALUES ?', [zahtjev], function (error, results, fields) {
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

// Onemogući korisnika (tablica "korisnici")
app.put('/api/onemoguciKorisnika/:idKorisnika', authJwt.verifyTokenAdmin, function (request, response) {
  const idKorisnika = request.params.idKorisnika;
  connection.query('UPDATE korisnici SET aktivan = "0" WHERE id_korisnik = ?', [idKorisnika], function (error, results, fields) {
    if (error) throw error;
    return response.send({ error: false, data: results, message: 'Korisnik je obrisan.' });
  });
});


// Onemogući dvorana (tablica "dvorane")
app.put('/onemoguciDvoranu', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  connection.query('UPDATE dvorane SET aktivan = "0" WHERE id_dvorane = ?', [data.id_dvorane], function (error, results, fields) {
    if (error) throw error;
    console.log('data', data)
    return response.send({ error: false, data: results, message: 'Dvorana je onemogućena.' });
  });
});

// Onemogući kolegija (tablica "kolegij")
app.put('/onemoguciKolegij', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  connection.query('UPDATE kolegij SET aktivan = "0" WHERE id_kolegij = ?', [data.id_kolegij], function (error, results, fields) {
    if (error) throw error;
    console.log('data', data)
    return response.send({ error: false, data: results, message: 'Kolegij je onemogućen.' });
  });
});

// Onemogući studijskih programa (tablica "studijskiProgrami")
app.put('/onemoguciStudijskiProgram', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  connection.query('UPDATE studijskiProgrami SET aktivan = "0" WHERE id_studijskiProgrami = ?', [data.id_studijskiProgrami], function (error, results, fields) {
    if (error) throw error;
    console.log('data', data)
    return response.send({ error: false, data: results, message: 'Studijski program je onemogućen.' });
  });
});

// Onemogući rezervacija (tablica "entry")
app.put('/onemoguciRezervaciju', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  connection.query('UPDATE entry SET status = "0" WHERE id_entry = ?', [data.id_entry], function (error, results, fields) {
    if (error) throw error;
    console.log('data', data)
    return response.send({ error: false, data: results, message: 'Rezervacija je onemogućena.' });
  });
});

// Zatraživanje brisanje rezervacija (nastavnici) (tablica "entry")
app.put('/zatrazivanjeBrisanjaRezervacija', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  connection.query('UPDATE entry SET status = "zatrazuje se brisanje" WHERE id_entry = ?', [data.id_entry], function (error, results, fields) {
    if (error) throw error;
    console.log('data', data)
    return response.send({ error: false, data: results, message: 'Rezervacija je zatražuje se brisanje.' });
  });
});

// Ažuriranje korisnika (tablica "korisnici")
app.put('/api/azuriranjeKorisnika/:idKorisnika', authJwt.verifyTokenAdmin, function (request, response) {
  const idKorisnika = request.params.idKorisnika;
  const saltRounds = 10;
  const data = request.body;

  bcrypt.hash(data.password, saltRounds, function (err, hash) {
    if (err) {
      console.error("Error hashing password:", err);
      return response.status(500).json({ error: true, message: "Error hashing password." });
    }

    const korisnik = [[data.korisnicko_ime, data.ime, data.prezime, hash, data.uloga, "1"]];
    connection.query('UPDATE korisnici SET korisnicko_ime = ?, ime = ?, prezime = ?, lozinka = ?, uloga = ?, aktivan = ? WHERE id_korisnik = ?', [data.korisnicko_ime, data.ime, data.prezime, hash, data.uloga, "1", idKorisnika], function (error, results, fields) {
      if (error) {
        console.error('Insert error:', error);
        return response.status(500).send({ error: true, message: 'Error adding user' });
      }
      console.log('Inserted data:', data);
      return response.send({ error: false, data: results, message: 'Korisnik je dodan.' });
    });
  });
});

app.listen(port, () => {
  console.log("Server running at port: " + port);
});
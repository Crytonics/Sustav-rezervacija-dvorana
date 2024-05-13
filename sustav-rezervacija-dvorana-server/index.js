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
  timezone: 'Z'  // This sets the timezone to UTC
});

function formatTime(time) {
  let parts = time.split(':');
  // Ensure hours and minutes are correctly formatted
  if (parts[0].length === 1) {
      parts[0] = '0' + parts[0]; // Pad hour if necessary
  }
  if (parts.length > 1 && parts[1].length === 1) {
      parts[1] = '0' + parts[1]; // Pad minute if necessary
  } else if (parts.length === 1) {
      parts.push('00'); // Add minutes if missing
  }
  return parts[0] + ':' + parts[1]; // Return formatted time
}

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
          const token = jwt.sign({ id: result[0].id_korisnik, korisnicko_ime: result[0].korisnicko_ime, uloga: result[0].uloga }, config.secret, { expiresIn: '1d' });
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
app.post('/api/unosStudijskogPrograma', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  const studijskiprogram = [[data.id_StudijskogPrograma, data.naziv_studija, data.backgroundColor, "1"]]
  connection.query('INSERT INTO studijskiProgrami (id_StudijskogPrograma, naziv, boja, aktivan) VALUES ?',
  [studijskiprogram], function (error, results, fields) {
    if (error) throw error;
    return response.send({ error: false, data: results, message: 'Studijski program je dodan.' });
  });
});

// Unos novog kolegija (tablica "kolegij")
app.post('/api/unosKolegija', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  const novikolegij = [[data.id_kolegija, data.naziv_kolegija,  data.nastavnik, data.studijski_program, "1"]]

    connection.query('INSERT INTO kolegij (id_kolegija, naziv, id_korisnik, id_studijskogPrograma, aktivan) VALUES ?', [novikolegij], function (error, results, fields) {
      if (error) {
        console.error('Insert error:', error);
        return response.status(500).send({ error: true, message: 'Error adding kolegij' });
      }
      console.log('Inserted data:', data);
      return response.send({ error: false, data: results, message: 'Kolegij je dodan.' });
    }
  );
});

// Unos nove dvorane (tablica "dvorane")
app.post('/api/unosDvorane', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  const dvorana = [[data.id_dvorane, data.naziv, data.svrha, "1"]]
  connection.query('INSERT INTO dvorane (id_dvorane, naziv, svrha, aktivan) VALUES ?',
  [dvorana], function (error, results, fields) {
    if (error) throw error;
    console.log('data', data)
    return response.send({ error: false, data: results, message: 'Korisnik je dodan.' });
  });
});

// Unos entry (tablica "entry")
app.post('/api/unosEntry', authJwt.verifyTokenAdminOrUser, function (request, response) {
  const data = request.body;
  const entry = [[data.id_entry, "", data.svrha, data.status, data.pocetak_vrijeme, data.kraj_vrijeme, data.dvorana, data.id_korisnika, data.idKolegija, data.idStudijskiProgram, data.datum, data.date_ponavljanje, data.ponavljanje]]
  connection.query('INSERT INTO entry (id_entry, naziv, svrha, status, start_time, end_time, id_dvorane, id_korisnik, id_kolegij, id_studijskiProgrami, start_date, end_date, ponavljanje) VALUES ?', [entry], function (error, results, fields) {
    if (error) throw error;
    return response.send({ error: false, data: results, message: 'Korisnik je dodan.' });
  });
});

// Unos entry Administrator (tablica "entry")
app.post('/api/unosEntryAdmin', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  const endDate = data.datePonavljanje || null; // This will set endDate to null if datePonavljanje is undefined, empty, or false
  const entry = [[data.id_entry, "", data.svrha, data.status, data.pocetak_vrijeme, data.kraj_vrijeme, data.dvorana, data.korisnik, data.idKolegija, data.idStudijskiProgram, data.datum, endDate, data.ponavljanje]]
  connection.query('INSERT INTO entry (id_entry, naziv, svrha, status, start_time, end_time, id_dvorane, id_korisnik, id_kolegij, id_studijskiProgrami, start_date, end_date, ponavljanje) VALUES ?', [entry], function (error, results, fields) {
    if (error) throw error;
    return response.send({ error: false, data: results, message: 'Korisnik je dodan.' });
  });
});

// Odobri zahtjev za rezervaciju dvotana (tablica "entry")
app.put('/api/odobriEntry/:id_entry', authJwt.verifyTokenAdmin, function (request, response) {
  const id_entry = request.params.id_entry;
  connection.query('UPDATE entry SET status = "aktivno" WHERE id_entry = ?', [id_entry], function (error, results) {
    if (error) throw error;
    response.send(results);
  });
});

// Odbaci zahtjev za rezervaciju dvotana (tablica "entry")
app.put('/api/odbaciEntry/:id_entry', authJwt.verifyTokenAdmin, function (request, response) {
  const id_entry = request.params.id_entry;
  connection.query('UPDATE entry SET status = "neaktivno" WHERE id_entry = ?', [id_entry], function (error, results) {
    if (error) throw error;
    response.send(results);
  });
});

// Prelged/Dohvati zauzeća dvorane(tablica "entry")
app.get("/api/entry/:joinedDate", (req, res) => {
  const { joinedDate } = req.params;

  connection.query(
        `SELECT
        e.id_entry,
        e.id_korisnik,
        CONCAT(koris.ime, ' ', koris.prezime) AS korisnicko_ime,
        kole.naziv AS kolegij_naziv,
        stud.naziv AS studijski_program_naziv,
        stud.boja AS boja_studijskog_programa,
        e.id_kolegij,
        e.id_dvorane,
        e.start_date,
        e.end_date,
        e.start_time,
        e.end_time,
        e.status,
        e.svrha,
        e.naziv,
        e.ponavljanje,
        e.id_studijskiProgrami
      FROM entry e
      INNER JOIN korisnici koris ON e.id_korisnik = koris.id_korisnik
      INNER JOIN kolegij kole ON e.id_kolegij = kole.id_kolegija
      INNER JOIN studijskiProgrami stud ON e.id_studijskiProgrami = stud.id_studijskogPrograma
      WHERE e.status = 'aktivno' AND e.start_date <= ? AND e.end_date >= ?`,
      [joinedDate, joinedDate], (error, results) => {
          if (error) throw error;
          const formattedResults = results.map(result => ({
            ...result,
            start_date: new Date(result.start_date).toISOString().split('T')[0],
            end_date: result.end_date ? new Date(result.end_date).toISOString().split('T')[0] : null,
            start_time: formatTime(result.start_time),
            end_time: formatTime(result.end_time)
          }));
          res.send(formattedResults);
      }
  );
});

// Pregled/Dohvati ogobravanje zahtjeva za rezervaciju dvorane (tablica "entry")
app.get("/api/entryOdobravanje", authJwt.verifyTokenAdmin, (req, res) => {
  const id_korisnika = req.query.id_korisnika;

  connection.query(
    `SELECT 
      e.id_entry,
      e.id_korisnik,
      e.id_kolegij,
      CONCAT(koris.ime, ' ', koris.prezime, ' (', koris.korisnicko_ime, ')') AS korisnicko_ime,
      kole.naziv AS kolegij,
      dvo.naziv AS dvorana,
      e.start_date AS datum,
      CONCAT(e.start_time, ' -  ', e.end_time) AS vrijeme,
      e.svrha,
      e.ponavljanje,
      e.status
    FROM entry e
    INNER JOIN korisnici koris ON e.id_korisnik = koris.id_korisnik
    INNER JOIN kolegij kole ON e.id_kolegij = kole.id_kolegija
    INNER JOIN dvorane dvo ON e.id_dvorane = dvo.id_dvorane
    WHERE status = 'zahtjev' OR status = 'Azuriran zahtjev';
    `, [id_korisnika], (error, results) => {
        if (error) throw error;
        const formattedResults = results.map(result => ({
          ...result,
          datum: new Date(result.datum).toISOString().split('T')[0],
          vrijeme: result.vrijeme.split(' - ').map(time => formatTime(time)).join(' - ')
        }));
        res.send(formattedResults);
      }
  );
});

// Prelged/Dohvati rezervacija  dvorana (tablica "entry")
app.get("/api/entryAdministrator", authJwt.verifyTokenAdmin, (req, res) => {
  connection.query(
    `SELECT 
      e.id_entry,
      e.id_korisnik,
      e.id_kolegij,
      CONCAT(koris.ime, ' ', koris.prezime, ' (', koris.korisnicko_ime, ')') AS korisnicko_ime,
      kole.naziv AS kolegij,
      dvo.naziv AS dvorana,
      e.start_date AS datum,
      CONCAT(e.start_time, ' -  ', e.end_time) AS vrijeme,
      e.svrha,
      e.ponavljanje,
      e.status
    FROM entry e
    INNER JOIN korisnici koris ON e.id_korisnik = koris.id_korisnik
    INNER JOIN kolegij kole ON e.id_kolegij = kole.id_kolegija
    INNER JOIN dvorane dvo ON e.id_dvorane = dvo.id_dvorane;
    `, (error, results) => {
        if (error) throw error;
        const formattedResults = results.map(result => ({
          ...result,
          datum: new Date(result.datum).toISOString().split('T')[0],
          vrijeme: result.vrijeme.split(' - ').map(time => formatTime(time)).join(' - ')
        }));
        res.send(formattedResults);
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
    const formattedResults = results.map(result => ({
      ...result,
      start_date: new Date(result.start_date).toISOString().split('T')[0],
      end_date: result.end_date ? new Date(result.end_date).toISOString().split('T')[0] : null,
      start_time: formatTime(result.start_time),
      end_time: formatTime(result.end_time)
    }));

    res.send(formattedResults);
  });
});

// Pregled/Dohvati popis korisnika
app.get('/api/korisnici', authJwt.verifyTokenAdmin, (req, res) => {
  connection.query("SELECT * FROM korisnici", (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

// Pregled/Dohvati studijske programe (tablica "studijskiProgrami")
app.get('/api/studijskiProgrami', (req, res) => {
  connection.query("SELECT * FROM studijskiProgrami WHERE aktivan = '1'", (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

// Pregled/Dohvati studijske programe po id-u (tablica "studijskiProgrami")
app.get('/api/pojed_studijskiProgrami/:idStudProg', authJwt.verifyTokenAdmin, function (request, response) {
  const idStudProg = request.params.idStudProg;
  connection.query("SELECT * FROM studijskiProgrami WHERE aktivan = '1' AND id_studijskogPrograma = ?", [idStudProg], function (error, results) {
    if (error) throw error;

    response.send(results);
  });
});

// Pregled/Dohvati dvorane (tablica "dvorane")
app.get('/api/dvorane', (req, res) => {
  connection.query("SELECT * FROM dvorane WHERE aktivan = '1'", (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

// Pregled/Dohvati dvorane po id-u (tablica "dvorane")
app.get('/api/pojed_dvorane/:id_dvorane', authJwt.verifyTokenAdmin, function (request, response) {
  const id_dvorane = request.params.id_dvorane;
  connection.query("SELECT * FROM dvorane WHERE aktivan = '1' AND id_dvorane = ?", [id_dvorane], function (error, results) {
    if (error) throw error;

    response.send(results);
  });
});

// Pregled/Dohvati kolegiji (tablica "kolegij")
app.get('/api/kolegiji', (req, res) => {
  const query = `
    SELECT 
      k.id_kolegija, 
      k.id_studijskogPrograma,
      k.naziv AS naziv_kolegija, 
      CONCAT(kor.ime, ' ', kor.prezime, ' (', kor.korisnicko_ime, ')') AS korisnicko_ime, 
      sp.naziv AS naziv_studijskog_programa
    FROM kolegij k
    INNER JOIN korisnici kor ON k.id_korisnik = kor.id_korisnik
    INNER JOIN studijskiProgrami sp ON k.id_studijskogPrograma = sp.id_studijskogPrograma
    WHERE k.aktivan = '1' AND kor.aktivan = '1' AND sp.aktivan = '1';
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: true, message: "Error fetching data from database." });
    }
    res.send(results);
  });
});

// Pregled/Dohvati kolegiji po studijskom programu (tablica "kolegij")
app.get('/api/kolegiji_studijskiProgrami/:idStudProg', (req, res) => {
  const idStudProg = req.params.idStudProg;
  const query = `
    SELECT 
      k.id_kolegija, 
      k.id_studijskogPrograma,
      k.naziv AS naziv_kolegija, 
      CONCAT(kor.ime, ' ', kor.prezime, ' (', kor.korisnicko_ime, ')') AS korisnicko_ime, 
      sp.naziv AS naziv_studijskog_programa
    FROM kolegij k
    INNER JOIN korisnici kor ON k.id_korisnik = kor.id_korisnik
    INNER JOIN studijskiProgrami sp ON k.id_studijskogPrograma = sp.id_studijskogPrograma
    WHERE k.aktivan = '1' AND kor.aktivan = '1' AND sp.aktivan = '1' AND k.id_studijskogPrograma = ?;
  `;

  connection.query(query, [idStudProg], (error, results) => {
    if (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: true, message: "Error fetching data from database." });
    }
    res.send(results);
  });
});

// Pregled/Dohvati kolegiji po korisniku(tablica "kolegij")
app.get('/api/pojed_kolegiji', authJwt.verifyTokenAdminOrUser, (req, res) => {
  const id_korisnika = req.query.id_korisnika;
  connection.query(`
    SELECT 
      k.id_kolegija, 
      k.naziv AS naziv_kolegija, 
      CONCAT(kor.ime, ' ', kor.prezime, ' (', kor.korisnicko_ime, ')') AS korisnicko_ime, 
      sp.naziv AS naziv_studijskog_programa
    FROM kolegij k
    INNER JOIN korisnici kor ON k.id_korisnik = kor.id_korisnik
    INNER JOIN studijskiProgrami sp ON k.id_studijskogPrograma = sp.id_studijskogPrograma
    WHERE k.aktivan = '1' AND kor.aktivan = '1' AND sp.aktivan = '1' AND k.id_korisnik = ?;
  `, [id_korisnika], function (error, results) {
    if (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: true, message: "Error fetching data from database." });
    }
    res.send(results);
  });
});

// Prelged/Dohvati zauzeća dvorane (tablica "entry")
app.get("/api/entry_korisnik", authJwt.verifyTokenAdminOrUser, (req, res) => {
  const id_korisnika = req.query.id_korisnika;

  connection.query(
    `SELECT 
      e.id_entry,
      e.id_kolegij,
      kole.naziv AS kolegij,
      dvo.naziv AS dvorana,
      e.start_date AS datum,
      CONCAT(e.start_time, ' - ', e.end_time) AS vrijeme,
      e.svrha,
      e.ponavljanje,
      e.status
    FROM entry e
    INNER JOIN kolegij kole ON e.id_kolegij = kole.id_kolegija
    INNER JOIN dvorane dvo ON e.id_dvorane = dvo.id_dvorane
    WHERE e.id_korisnik = ?;
    `, [id_korisnika], (error, results) => {
        if (error) throw error;
        const formattedResults = results.map(result => ({
          ...result,
          datum: new Date(result.datum).toISOString().split('T')[0],
          vrijeme: result.vrijeme.split(' - ').map(time => formatTime(time)).join(' - ')
        }));
        res.send(formattedResults);
      }
  );
});

// Prelged/Dohvati zauzeća dvorane pa id-u(tablica "entry")
app.get("/api/entry_kolegij/:id_entry", authJwt.verifyTokenAdminOrUser, (req, res) => {
  const id_entry = req.params.id_entry;

  connection.query(
    `SELECT 
      e.id_entry,
      e.id_kolegij,
      e.id_korisnik,
      CONCAT(koris.ime, ' ', koris.prezime) AS Korisnik_naziv,
      kole.naziv AS kolegij,
      dvo.naziv AS dvorana,
      e.start_date AS datum,
      e.end_date,
      e.id_dvorane,
      e.start_time,
      e.id_studijskiProgrami,
      e.end_time,
      e.svrha,
      e.ponavljanje,
      e.status
    FROM entry e
    INNER JOIN korisnici koris ON e.id_korisnik = koris.id_korisnik
    INNER JOIN kolegij kole ON e.id_kolegij = kole.id_kolegija
    INNER JOIN dvorane dvo ON e.id_dvorane = dvo.id_dvorane
    WHERE e.id_entry = ?;
    `, [id_entry], (error, results) => {
        if (error) throw error;
        const formattedResults = results.map(result => ({
          ...result,
          datum: new Date(result.datum).toISOString().split('T')[0],
          start_time: result.start_time.slice(0, 5),
          end_time: result.end_time.slice(0, 5),
          end_date: result.end_date ? new Date(result.end_date).toISOString().split('T')[0] : null
        }));
        res.send(formattedResults);
      }
  );
});

// Pregled/Dohvati kolegiji po korisniku (dobije se id studijskog programa)(tablica "kolegij")
app.get('/api/pojed_kolegiji_sp_id', authJwt.verifyTokenAdminOrUser, (req, res) => {
  const id_korisnika = req.query.id_korisnika;
  connection.query(`
    SELECT 
      k.id_kolegija, 
      k.naziv AS naziv_kolegija, 
      CONCAT(kor.ime, ' ', kor.prezime, ' (', kor.korisnicko_ime, ')') AS korisnicko_ime, 
      sp.id_studijskogPrograma
    FROM kolegij k
    INNER JOIN korisnici kor ON k.id_korisnik = kor.id_korisnik
    INNER JOIN studijskiProgrami sp ON k.id_studijskogPrograma = sp.id_studijskogPrograma
    WHERE k.aktivan = '1' AND kor.aktivan = '1' AND sp.aktivan = '1' AND k.id_korisnik = ?;
  `, [id_korisnika], function (error, results) {
    if (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: true, message: "Error fetching data from database." });
    }
    res.send(results);
  });
});

// Pregled/Dohvati kolegij po id-u (tablica "kolegij")
app.get('/api/pojed_kolegiji/:idKolegija', authJwt.verifyTokenAdmin, function (request, response) {
  const idStudProg = request.params.idKolegija;
  connection.query(`
      SELECT 
        k.id_kolegija, 
        k.naziv AS naziv_kolegija, 
        CONCAT(kor.ime, ' ', kor.prezime) AS korisnicko_ime, 
        sp.naziv AS naziv_studijskog_programa
      FROM kolegij k
      INNER JOIN korisnici kor ON k.id_korisnik = kor.id_korisnik
      INNER JOIN studijskiProgrami sp ON k.id_studijskogPrograma = sp.id_studijskogPrograma
      WHERE k.aktivan = '1' AND kor.aktivan = '1' AND sp.aktivan = '1' AND k.id_kolegija = ?;
    `, [idStudProg], function (error, results) {
    if (error) {
      console.error("Error fetching data:", error);
      return response.status(500).json({ error: true, message: "Error fetching data from database." });
    }
    response.send(results);
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
app.put('/api/onemoguciDvoranu/:id_dvorane', authJwt.verifyTokenAdmin, function (request, response) {
  const id_dvorane = request.params.id_dvorane;
  connection.query('UPDATE dvorane SET aktivan = "0" WHERE id_dvorane = ?', [id_dvorane], function (error, results, fields) {
    if (error) throw error;
    return response.send({ error: false, data: results, message: 'Dvorana je onemogućena.' });
  });
});

// Onemogući kolegija (tablica "kolegij")
app.put('/api/onemoguciKolegij/:idKolegija', authJwt.verifyTokenAdmin, function (request, response) {
  const idKolegija = request.params.idKolegija;
  connection.query('UPDATE kolegij SET aktivan = "0" WHERE id_kolegija = ?', [idKolegija], function (error, results, fields) {
    if (error) throw error;
    return response.send({ error: false, data: results, message: 'Kolegij je onemogućen.' });
  });
});

// Onemogući studijskih programa (tablica "studijskiProgrami")
app.put('/api/onemoguciStudijskiProgram/:idStudProg', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  const idStudProg = request.params.idStudProg;
  connection.query('UPDATE studijskiProgrami SET aktivan = "0" WHERE id_studijskogPrograma = ?', [idStudProg], function (error, results, fields) {
    if (error) throw error;
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

// Izbriši rezervacija (tablica "entry")
app.delete('/api/izbrisiRezervaciju/:id_entry', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  const id_entry = request.params.id_entry;
  connection.query('DELETE FROM entry WHERE id_entry = ?', [id_entry], function (error, results, fields) {
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

// Ažuriranje studijskih programa (tablica "studijskiProgrami")
app.put('/api/azuriranjeStudijskihPrograma/:idStudProg', authJwt.verifyTokenAdmin, function (request, response) {
  const idStudProg = request.params.idStudProg;
  const data = request.body;
    connection.query('UPDATE studijskiProgrami SET naziv = ?, aktivan = ? WHERE id_studijskogPrograma = ?', [data.naziv, "1", idStudProg], function (error, results, fields) {
      if (error) {
        console.error('Insert error:', error);
        return response.status(500).send({ error: true, message: 'Error adding studijski program' });
      }
      console.log('Inserted data:', data);
      return response.send({ error: false, data: results, message: 'Studijski program je dodan.' });
  });
});

// Ažuriranje kolegija po id-u (tablica "kolegij")
app.put('/api/pojed_kolegiji/:idKolegija', authJwt.verifyTokenAdmin, function (request, response) {
  const idKolegija = request.params.idKolegija;
  const data = request.body;
    connection.query('UPDATE kolegij SET naziv = ?, id_korisnik = ?, id_studijskogPrograma = ? WHERE id_kolegija = ?', [data.naziv_kolegija, data.nastavnik, data.studijski_program, idKolegija], function (error, results, fields) {
      if (error) {
        console.error('Insert error:', error);
        return response.status(500).send({ error: true, message: 'Error adding studijski program' });
      }
      console.log('Inserted data:', data);
      return response.send({ error: false, data: results, message: 'Studijski program je dodan.' });
  });
});

// Ažuriranje dvorana po id-u (tablica "dvorane")
app.put('/api/azuriranjeDvorane/:id_dvorane', authJwt.verifyTokenAdmin, function (request, response) {
  const id_dvorane = request.params.id_dvorane;
  const data = request.body;
    connection.query('UPDATE dvorane SET naziv = ?, svrha = ? WHERE id_dvorane = ?', [data.naziv, data.svrha, id_dvorane], function (error, results, fields) {
      if (error) {
        console.error('Insert error:', error);
        return response.status(500).send({ error: true, message: 'Error adding studijski program' });
      }
      console.log('Inserted data:', data);
      return response.send({ error: false, data: results, message: 'Studijski program je dodan.' });
  });
});

// Unos novog kolegija (tablica "kolegij")
app.post('/api/unosKolegija', authJwt.verifyTokenAdmin, function (request, response) {
  const data = request.body;
  const novikolegij = [[data.id_kolegija, data.naziv_kolegija,  data.nastavnik, data.studijski_program, "1"]]

    connection.query('INSERT INTO kolegij (id_kolegija, naziv, id_korisnik, id_studijskogPrograma, aktivan) VALUES ?', [novikolegij], function (error, results, fields) {
      if (error) {
        console.error('Insert error:', error);
        return response.status(500).send({ error: true, message: 'Error adding kolegij' });
      }
      console.log('Inserted data:', data);
      return response.send({ error: false, data: results, message: 'Kolegij je dodan.' });
    }
  );
});

// Ažuriranje entry (tablica "entry")
app.put('/api/azuriranjeEntry/:id_entry', authJwt.verifyTokenAdminOrUser, function (request, response) {
  const id_entry = request.params.id_entry;
  const data = request.body;

  const endDate = data.date_ponavljanje || null;

  const sqlQuery = `
    UPDATE entry 
    SET 
      svrha = ?,
      status = ?,
      start_time = ?,
      end_time = ?,
      id_dvorane = ?,
      id_korisnik = ?,
      id_kolegij = ?,
      id_studijskiProgrami = ?,
      start_date = ?,
      end_date = ?,
      ponavljanje = ?
    WHERE id_entry = ?`;

  const values = [
    data.svrha, 
    data.status, 
    data.pocetak_vrijeme, 
    data.kraj_vrijeme, 
    data.idDvorane, 
    data.id_korisnika, 
    data.idKolegija, 
    data.idStudijskiProgram, 
    data.datum, 
    data.endDate, 
    data.ponavljanje,
    id_entry
  ];

  connection.query(sqlQuery, values, function (error, results, fields) {
    if (error) {
      console.error("Error updating entry:", error);
      return response.status(500).send({ error: true, message: 'Error updating entry' });
    }
    return response.send({ error: false, data: results, message: 'Entry updated successfully.' });
  });
});

app.listen(port, () => {
  console.log("Server running at port: " + port);
});
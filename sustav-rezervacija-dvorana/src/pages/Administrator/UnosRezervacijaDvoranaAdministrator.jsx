import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function UnosRezervacijaDvoranaAdministrator() {

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.uloga;

        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    const isAdminOrNastavnik = (token, headers) => {
        if (!token) {
            navigate('/odbijenPristup');
            return false;
        }
    
        const role = decodeToken(token);
        if (role !== "admin") {
            navigate('/odbijenPristup');
            return false;
        }

        // Dobivanje informacija iz tokena
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        // Id iz tokena
        var payloadObj = JSON.parse(jsonPayload);
        const id_korisnika = (payloadObj.id);
        setId_korisnika(payloadObj.id);
    
        dohvatiPodatke(id_korisnika, headers);
        return true;
    };

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const [dvorane, setDvorane] = useState([]);
    const [kolegiji, setKolegiji] = useState([]);
    const [entry, setEntry] = useState([]);
    const [ponavljanje, setPonavljanje] = useState([]);
    const [id_korisnika, setId_korisnika] = useState([]);
    const [korisnici, setKorisnici] = useState([]);
    const [datePonavljanje, setDatePonavljanje] = useState('');

    const [isToggled, setIsToggled] = useState(false);

    const natrak_stisnuto = () => {
        navigate("/pocetna");
    }

    const { idEntry } = useParams()

    const filteredKolegiji = kolegiji.filter(kolegij =>
        kolegij.naziv_kolegija.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kolegij.id_studijskogPrograma.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDvorane = dvorane.filter(dvorana =>
        dvorana.naziv.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredKorisnici = korisnici.filter(korisnik =>
        korisnik.korisnicko_ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        korisnik.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        korisnik.prezime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        korisnik.uloga.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function generateTimeOptions() {
        const options = [];
        for (let hour = 8; hour <= 22; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                options.push(<option key={time} value={time}>{time}</option>);
            }
        }
        return options;
    }

    const handleToggle = () => {
        setIsToggled(prevIsToggled => {
            const newIsToggled = !prevIsToggled;
            setPonavljanje(newIsToggled ? "1" : "0");
            return newIsToggled;
        });
    };

    const handleDateChange = (event) => {
        setDatePonavljanje(event.target.value);
    };

    useEffect(() => {
        async function fetchInitialData() {

            // Get the JWT token from local storage
            const token = localStorage.getItem("token");
        
            // Set up the request headers to include the JWT token
            const headers = { Authorization: `Bearer ${token}` }; 

            setPonavljanje("0");

            decodeToken(token);

            isAdminOrNastavnik(token, headers);
            
        }

        fetchInitialData();
    }, []);

    const dohvatiPodatke = async (id_korisnika, headers) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/kolegiji`, {headers});
            setKolegiji(response.data);
            console.log("Kolegiji:", response.data);

            const response2 = await axios.get(`http://localhost:3000/api/dvorane`, { headers });
            setDvorane(response2.data);

            const response3 = await axios.get(`http://localhost:3000/api/rezervacije`, { headers });
            setEntry(response3.data);

            const response4 = await axios.get(`http://localhost:3000/api/korisnici`, { headers });
            setKorisnici(response4.data);
          
        } catch (error) {
            console.log("Greška prilikom dohvata podataka:", error);
        } 
    }

    const spremi_podatke = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const kolegij = event.target.Kolegiji.value;
        const [idKolegija, idStudijskiProgram] = kolegij.split(',');
        const dvorana = event.target.Dvorane.value;
        const svrha = event.target.svrha.value;
        const datum = event.target.Datum.value;
        const pocetak_vrijeme = event.target.Pocetak.value;
        const kraj_vrijeme = event.target.Kraj.value;
        const korisnik = event.target.nastavnik.value;
        const status = "aktivno"

        const userData = { korisnik, svrha, status, pocetak_vrijeme, kraj_vrijeme, dvorana, idKolegija, idStudijskiProgram, datum, datePonavljanje, ponavljanje };

        console.log("Spremi podatke: ", userData);

        posalji_podatke(userData);
    }

    const posalji_podatke = async (userData) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.post(`http://localhost:3000/api/unosEntryAdmin`, userData, {headers});
        } catch (error) {
            console.log("Greška prilikom unosa podataka:", error);
        }
        window.alert("Zahtjev je uspješno poslan.")
        navigate("/pocetna");
        
    }

    return (
        <div className="unos-rezervacija-container">
            
            <form className="login-form" onSubmit={spremi_podatke}>
            <div className="form-group">
                <label htmlFor="Nastavnik">Korisnik: </label>
                <select id="nastavnik" name="nastavnik" required>
                <option value="">Odaberite korisnika</option>
                    {filteredKorisnici.slice(1).map((korisnik) => (
                        <option key={korisnik.id_korisnik} value={korisnik.id_korisnik}>
                            {korisnik.ime} {korisnik.prezime}
                        </option>
                    ))}
                </select>
            </div>
                <div className="form-group">
                <label htmlFor="Kolegiji">Kolegij: </label>
                <select id="Kolegiji" name="Kolegiji" required>
                    <option value="">Odaberite kolegij</option>
                    {filteredKolegiji.map((kolegij) => (
                        <option key={kolegij.id_kolegija} value={`${kolegij.id_kolegija},${kolegij.id_studijskogPrograma}`}>
                            {kolegij.naziv_kolegija}
                        </option>
                    ))}
                </select>
                </div>
                <div className="form-group">
                <label htmlFor="Dvorane">Dvorana: </label>
                <select id="Dvorane" name="Dvorane" required>
                    <option value="">Odaberite dvoranu</option>
                    {filteredDvorane.slice().map((dvorana) => (
                        <option key={dvorana.id_dvorane} value={dvorana.id_dvorane}>
                            {dvorana.naziv}
                        </option>
                    ))}
                </select>
                </div>
                <div className="form-group">
                <label htmlFor="svrha">Svrha: </label>
                <select id="svrha" name="svrha" required>
                    <option value="">Odaberite svrhu</option>
                    <option value="predavanje">Predavanje</option>
                    <option value="ispit">Ispit</option>
                </select>
            </div>
                <div className="form-group">
                    <label htmlFor="Datum">Datum: </label>
                    <input type="date" id="Datum" name="Datum" required />
                </div>
                <div className="form-group">
                    <label htmlFor="Pocetak">Početak: </label>
                    <select id="Pocetak" name="Pocetak" required>
                        <option value="">Odaberite početak</option>
                        {generateTimeOptions()}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="Kraj">Kraj: </label>
                    <select id="Kraj" name="Kraj" required>
                        <option value="">Odaberite kraj</option>
                        {generateTimeOptions()}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="date_ponavljanje">Ponavljanje do: </label>
                    <input 
                        type="date" 
                        id="date_ponavljanje" 
                        name="date_ponavljanje" 
                        value={datePonavljanje || ''}
                        onChange={handleDateChange}
                    />
                </div>
                <div className="form-group toggle-group">
                    <label htmlFor="toggleInput" style={{marginLeft: '10px'}}>Ponavljanje</label>
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            id="toggleInput" 
                            name="toggleInput" 
                            checked={isToggled} 
                            onChange={handleToggle} 
                        />
                    <span className="slider round"></span>
                    </label>
                </div>
                <button type="button" onClick={natrak_stisnuto}>Natrag</button>
                <button type="submit">Spremi</button>
            </form>
        </div>
    )
}

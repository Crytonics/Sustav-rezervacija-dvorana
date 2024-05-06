import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function ZatraziRezervacijuNastavnici() {

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
        if (role !== "admin" && role !== "nastavnik") {
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
    const [studenskiProgrami, setStudenskiProgrami] = useState([]);
    const [entry, setEntry] = useState([]);
    const [ponavljanje, setPonavljanje] = useState([]);
    const [id_korisnika, setId_korisnika] = useState([]);

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
            const response = await axios.get(`http://localhost:3000/api/pojed_kolegiji_sp_id?id_korisnika=${id_korisnika}`, {headers});
            setKolegiji(response.data);

            const response1 = await axios.get(`http://localhost:3000/api/studijskiProgrami`, { headers });
            setStudenskiProgrami(response1.data);

            const response2 = await axios.get(`http://localhost:3000/api/dvorane`, { headers });
            setDvorane(response2.data);

            const response3 = await axios.get(`http://localhost:3000/api/rezervacije`, { headers });
            setEntry(response3.data);
          
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
        const date_ponavljanje = event.target.date_ponavljanje.value;
        const status = "zahtjev"

        const userData = { svrha, status, pocetak_vrijeme, kraj_vrijeme, dvorana, id_korisnika, idKolegija, idStudijskiProgram, datum, date_ponavljanje, ponavljanje };

        posalji_podatke(userData);
    }

    const posalji_podatke = async (userData) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.post(`http://localhost:3000/api/unosEntry`, userData, {headers});
        } catch (error) {
            console.log("Greška prilikom unosa podataka:", error);
        }
        window.alert("Zahtjev je uspješno poslan.")
        navigate("/pocetna");
        
    }

    return (
        <div className="unos-korisnika-container">
            <form className="login-form" onSubmit={spremi_podatke}>
            <div className="form-group">
                <label htmlFor="Kolegiji">Kolegij: </label>
                <select id="Kolegiji" name="Kolegiji" required>
                    <option value="">
                        {filteredKolegiji.length > 0 ? "Odaberite kolegij" : "Nema dostupnih kolegija"}
                    </option>
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
                <label htmlFor="Datum">Ponavljanje do: </label>
                <input type="date" id="date_ponavljanje" name="date_ponavljanje" required />
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

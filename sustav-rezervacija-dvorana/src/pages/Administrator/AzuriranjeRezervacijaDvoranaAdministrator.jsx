import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function AzuriranjeRezervacijaDvoranaAdministrator() {

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.uloga;

        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    const isAdmin = (token, headers) => {
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
        //setId_korisnika(payloadObj.id);
    
        dohvatiPodatke(id_korisnika, headers);
        return true;
    };

    const realCurrentDate = new Date(); // This remains constant, representing the real-world current date
    const currentMonth2 = realCurrentDate.getMonth();
    const currentYear2 = realCurrentDate.getFullYear();
    const todayDate = realCurrentDate.toLocaleDateString('en-US', { day: 'numeric' });
    const joinedDate = `${currentYear2}-${(currentMonth2 + 1).toString().padStart(2, '0')}-${todayDate}`;

    const { id_entry } = useParams()

    const [searchTerm, setSearchTerm] = useState('');

    const [dvorane, setDvorane] = useState([]);
    const [kolegiji, setKolegiji] = useState([]);
    const [studenskiProgrami, setStudenskiProgrami] = useState([]);
    const [entry, setEntry] = useState([]);
    const [ponavljanje, setPonavljanje] = useState([]);
    const [id_korisnika, setId_korisnika] = useState([]);
    const [entry_kolegij, setEntry_kolegij] = useState([]);
    const [korisnici, setKorisnici] = useState([]);
    const [datum, setDatum] = useState('');
    const [end_date, setEnd_date] = useState('');
    const [svrha, setSvrha] = useState('');

    const [isToggled, setIsToggled] = useState(false);

    const filteredKolegiji = kolegiji.filter(kolegij =>
        kolegij.naziv_kolegija.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kolegij.id_studijskogPrograma.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kolegij.id_kolegija.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDvorane = dvorane.filter(dvorana =>
        dvorana.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dvorana.id_dvorane.toLowerCase()
    );

    const filteredKorisnici = korisnici.filter(korisnik =>
        korisnik.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        korisnik.prezime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        korisnik.id_korisnik.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredEntry_kolegij = entry_kolegij.filter(entry_kolegiji =>
        entry_kolegiji.datum.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry_kolegiji.dvorana.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry_kolegiji.end_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry_kolegiji.id_dvorane.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry_kolegiji.id_studijskiProgrami.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry_kolegiji.end_time.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry_kolegiji.id_entry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry_kolegiji.id_kolegij.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry_kolegiji.kolegij.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry_kolegiji.ponavljanje.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry_kolegiji.start_time.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry_kolegiji.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry_kolegiji.svrha.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry_kolegiji.vrijeme.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry_kolegiji.Korisnik_naziv.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navigate = useNavigate();

    const natrak_stisnuto = () => {
        navigate("/pregledRezervacijaDvoranaAdministrator");
    }

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
        setDatum(event.target.value);
    };

    const handleDateChange_end_date = (event) => {
        setEnd_date(event.target.value);
    };

    
    const handleSvrhaChange = (event) => {
        setSvrha(event.target.value);
    };

    useEffect(() => {
        async function fetchInitialData() {

            // Get the JWT token from local storage
            const token = localStorage.getItem("token");
        
            // Set up the request headers to include the JWT token
            const headers = { Authorization: `Bearer ${token}` }; 

            setPonavljanje("0");

            decodeToken(token);

            isAdmin(token, headers);
            
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

            const response4 = await axios.get(`http://localhost:3000/api/entry_kolegij/${id_entry}`, { headers });
            setEntry_kolegij(response4.data);

            const response5 = await axios.get(`http://localhost:3000/api/korisnici`, { headers });
            setKorisnici(response5.data);

            if (response4.data.length > 0) {
                setDatum(response4.data[0].datum);
                setSvrha(response4.data[0].svrha);
            }

            if (response4.data[0].end_date) {
                setEnd_date(response4.data[0].end_date);
            }

        } catch (error) {
            console.log("Greška prilikom dohvata podataka:", error);
        } 
    }

    const spremi_podatke = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const kolegij = event.target.Kolegiji.value;
        const [idKolegija, idStudijskiProgram] = kolegij.split(',');
        const idDvorane = event.target.Dvorane.value;
        const svrha = event.target.svrha.value;
        const datum = event.target.Datum.value;
        const pocetak_vrijeme = event.target.Pocetak.value;
        const kraj_vrijeme = event.target.Kraj.value;
        const date_ponavljanje = event.target.date_ponavljanje.value;
        const status = "Azuriran zahtjev"
        const id_korisnika = event.target.Korisnik.value;

        const userData = { id_entry, status, svrha, pocetak_vrijeme, kraj_vrijeme, idDvorane, id_korisnika, idKolegija, idStudijskiProgram, datum, date_ponavljanje, ponavljanje };


        posalji_podatke(userData);
    }

    const posalji_podatke = async (userData) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.put(`http://localhost:3000/api/azuriranjeEntry/${id_entry}`, userData, {headers});
        } catch (error) {
            console.log("Greška prilikom unosa podataka:", error);
        }
        window.alert("Zahtjev je uspješno poslan.")
        navigate(`/pocetna/${joinedDate}`);
        
    }

    return (
        <div className="unos-korisnika-container">
        <form className="login-form" onSubmit={spremi_podatke}>
            <div className="form-group">
                <label htmlFor="Korisnik">Korisnik: </label>
                <select id="Korisnik" name="Korisnik" required>
                <option value={filteredEntry_kolegij.length > 0 ? filteredEntry_kolegij[0].id_korisnik : ""}>
                        {filteredEntry_kolegij.length > 0 ? filteredEntry_kolegij[0].Korisnik_naziv : "Nema dostupnih kolegija"}
                    </option>
                    {filteredKorisnici.slice(0).map((korisnik) => (
                        <option key={korisnik.id_korisnik} value={korisnik.id_korisnik}>
                            {korisnik.ime}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="Kolegiji">Kolegij: </label>
                <select id="Kolegiji" name="Kolegiji" required>
                <option value={filteredEntry_kolegij.length > 0 ? `${filteredEntry_kolegij[0].id_kolegij},${filteredEntry_kolegij[0].id_studijskiProgrami}` : ""}>
                        {filteredEntry_kolegij.length > 0 ? filteredEntry_kolegij[0].kolegij : "Nema dostupnih kolegija"}
                    </option>
                    {filteredKolegiji.slice(0).map((kolegij) => (
                        <option key={kolegij.id_kolegija} value={`${kolegij.id_kolegija},${kolegij.id_studijskogPrograma}`}>
                            {kolegij.naziv_kolegija}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="Dvorane">Dvorana: </label>
                <select id="Dvorane" name="Dvorane" required>
                <option value={filteredEntry_kolegij.length > 0 ? filteredEntry_kolegij[0].id_dvorane : ""}>
                    {filteredEntry_kolegij.length > 0 ? filteredEntry_kolegij[0].dvorana : ""}
                    </option>
                    {filteredDvorane.slice(1).map((dvorana) => (
                        <option key={dvorana.id_dvorane} value={dvorana.id_dvorane}>
                            {dvorana.naziv}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="svrha">Svrha: </label>
                <select id="svrha" name="svrha" required>
                    <option value={svrha} onChange={handleSvrhaChange}>{svrha}</option>
                    <option value="predavanje">Predavanje</option>
                    <option value="ispit">Ispit</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="Datum">Datum: </label>
                <input type="date" id="Datum" name="Datum" value={datum} onChange={handleDateChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="Pocetak">Početak: </label>
                <select id="Pocetak" name="Pocetak" required>
                    <option value={filteredEntry_kolegij.length > 0 ? filteredEntry_kolegij[0].start_time : ""}>
                    {filteredEntry_kolegij.length > 0 ? filteredEntry_kolegij[0].start_time : ""}
                    </option>
                    {generateTimeOptions()}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="Kraj">Kraj: </label>
                <select id="Kraj" name="Kraj" required>
                    <option value={filteredEntry_kolegij.length > 0 ? filteredEntry_kolegij[0].end_time : ""}>
                    {filteredEntry_kolegij.length > 0 ? filteredEntry_kolegij[0].end_time : ""}
                    </option>
                    {generateTimeOptions()}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="Datum">Ponavljanje do: </label>
                <input type="date" id="date_ponavljanje" name="date_ponavljanje" value={end_date} onChange={handleDateChange_end_date} />
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

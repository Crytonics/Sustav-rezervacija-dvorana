import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default  function AzuriranjeKolegijaAdministrator() {

    const isAdmin = (token, headers) => {
        if (isAuthenticated() && token) {
            const decodeToken = (token) => {
                try {
                    const decoded = jwtDecode(token);
                    return decoded.uloga;
                } catch (error) {
                    console.error("Error decoding token:", error);
                    return null;
                }
            };

            dohvatiPodatke(headers);
            return decodeToken(token) === "admin";
        } else {
            navigate('/odbijenPristup');
        }
        return false;
    };

    const isAuthenticated = () => {
        const token = localStorage.getItem("token");
        return !!token;
    };

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const [studenskiProgrami, setStudenskiProgrami] = useState([]);

    const natrak_stisnuto = () => {
        navigate("/kolegijiAdministrator");
    }

    const { idKolegija } = useParams()

    const [korisnici, setKorisnici] = useState([]);
    const [kolegiji, setKolegiji] = useState([]);
    const [naziv, setNaziv] = useState([]);

    const filteredKolegiji = kolegiji.filter(kolegij =>
        kolegij.naziv_kolegija.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kolegij.korisnicko_ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kolegij.naziv_studijskog_programa.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredKorisnici = korisnici.filter(korisnik =>
        korisnik.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        korisnik.prezime.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredStudenskiProgrami = studenskiProgrami.filter(studprog =>
        studprog.naziv.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNazivChange = (event) => {
        setNaziv(event.target.value);
    };

    useEffect(() => {
        async function fetchInitialData() {

            // Get the JWT token from local storage
            const token = localStorage.getItem("token");
        
            // Set up the request headers to include the JWT token
            const headers = { Authorization: `Bearer ${token}` }; 

            isAdmin(token, headers);
        }

        fetchInitialData();
    }, []);

    const dohvatiPodatke = async (headers) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/korisnici`, { headers });
            setKorisnici(response.data);

            const response1 = await axios.get(`http://localhost:3000/api/studijskiProgrami`, { headers });
            setStudenskiProgrami(response1.data);

            const response2 = await axios.get(`http://localhost:3000/api/pojed_kolegiji/${idKolegija}`, { headers });
            setKolegiji(response2.data);
            if (response2.data.length > 0) {
                setNaziv(response2.data[0].naziv_kolegija);
            }
          
        } catch (error) {
            console.log("Greška prilikom dohvata podataka:", error);
        } 
    }

    const spremi_podatke = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const naziv_kolegija = event.target.naziv_kolegija.value;
        const nastavnik = event.target.nastavnik.value;
        const studijski_program = event.target.studijski_program.value;

        const userData = { naziv_kolegija, nastavnik, studijski_program };

        posalji_podatke(userData);
    }

    const posalji_podatke = async (userData) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.put(`http://localhost:3000/api/pojed_kolegiji/${idKolegija}`, userData, {headers});
        } catch (error) {
            console.log("Greška prilikom unosa kolegija:", error);
        }
        window.alert("Kolegij uspješno ažuriran.")
        navigate("/kolegijiAdministrator");
        
    }

    return (
        <div className="unos-korisnika-container">
        <form className="login-form" onSubmit={spremi_podatke}>
            <div className="form-group">
                <label htmlFor="naziv_kolegija">Naziv kolegija: </label>
                <input type="text" id="naziv_kolegija" name="naziv_kolegija" value={naziv} onChange={handleNazivChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="Nastavnik">Nastavnik: </label>
                <select id="nastavnik" name="nastavnik" required>
                <option value={filteredKorisnici.length > 0 ? filteredKorisnici[0].id_korisnik : ""}>
                        {filteredKorisnici.length > 0 ? `${filteredKorisnici[0].ime} ${filteredKorisnici[0].prezime}` : "Odaberite nastavnika"}
                    </option>
                    {filteredKorisnici.slice(1).map((korisnik) => (
                        <option key={korisnik.id_korisnik} value={korisnik.id_korisnik}>
                            {korisnik.ime} {korisnik.prezime}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="Nastavnik">Studijski program: </label>
                <select id="studijski_program" name="studijski_program" required>
                    <option value={filteredStudenskiProgrami.length > 0 ? filteredStudenskiProgrami[0].id_studijskogPrograma : ""}>{filteredStudenskiProgrami.length > 0 ? filteredStudenskiProgrami[0].naziv : "Odaberite studijski program"}</option>
                    {filteredStudenskiProgrami.slice(1).map((program) => (
                        <option key={program.id_studijskogPrograma} value={program.id_studijskogPrograma}>
                            {program.naziv}
                        </option>
                    ))}
                </select>
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}

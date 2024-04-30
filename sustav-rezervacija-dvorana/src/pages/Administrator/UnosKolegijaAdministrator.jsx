import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function UnosKolegijaAdministrator() {

    const [searchTerm, setSearchTerm] = useState('');

    const [korisnici, setKorisnici] = useState([]);

    const [studenskiProgrami, setStudenskiProgrami] = useState([]);

    useEffect(() => {
        async function fetchInitialData() {

            // Get the JWT token from local storage
            const token = localStorage.getItem("token");
        
            // Set up the request headers to include the JWT token
            const headers = { Authorization: `Bearer ${token}` }; 

            try {
                const response = await axios.get(`http://localhost:3000/api/korisnici`, { headers });
                setKorisnici(response.data);

                const response1 = await axios.get(`http://localhost:3000/api/studijskiProgrami`, { headers });
                setStudenskiProgrami(response1.data);
              
            } catch (error) {
                console.log("Greška prilikom dohvata podataka:", error);
            } 
            
        }

        fetchInitialData();
    }, []);

    const filteredKorisnici = korisnici.filter(korisnik =>
        korisnik.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        korisnik.prezime.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredStudenskiProgrami = studenskiProgrami.filter(studprog =>
        studprog.naziv.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navigate = useNavigate();

    const natrak_stisnuto = () => {
        navigate("/kolegijiAdministrator");
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
            const response = await axios.post("http://localhost:3000/api/unosKolegija", userData, {headers});
        } catch (error) {
            console.log("Greška prilikom spremanja kolegija:", error);
        }
        window.alert('Kolegij uspješno dodan.')
        navigate("/kolegijiAdministrator");
    }

    return (
        <div className="unos-korisnika-container">
        <form className="login-form" onSubmit={spremi_podatke}>
            <div className="form-group">
                <label htmlFor="naziv_kolegija">Naziv kolegija: </label>
                <input type="text" id="naziv_kolegija" name="naziv_kolegija" required />
            </div>
            <div className="form-group">
                <label htmlFor="nastavnik">Nastavnik: </label>
                <select id="nastavnik" name="nastavnik" required>
                    <option value="">Odaberite nastavnika</option>
                    {filteredKorisnici.map((korisnik) => (
                        <option key={korisnik.id_korisnik} value={korisnik.id_korisnik}>
                            {korisnik.ime} {korisnik.prezime}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="studijski_program">Studijski program: </label>
                <select id="studijski_program" name="studijski_program" required>
                    <option value="">Odaberite studijski program</option>
                    {filteredStudenskiProgrami.map((program) => (
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

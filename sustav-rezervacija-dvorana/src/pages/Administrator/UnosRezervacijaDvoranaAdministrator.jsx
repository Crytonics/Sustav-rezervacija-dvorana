import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function UnosRezervacijaDvoranaAdministrator() {

    const [searchTerm, setSearchTerm] = useState('');
    const [nastavnici, setNastavnici] = useState([]);
    const [kolegiji, setKolegiji] = useState([]);

    useEffect(() => {
        async function fetchInitialData() {
            // Get the JWT token from local storage
            const token = localStorage.getItem("token");
            // Set up the request headers to include the JWT token
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const response = await axios.get(`http://localhost:3000/api/nastavnici`, { headers });
                setNastavnici(response.data);

                const response1 = await axios.get(`http://localhost:3000/api/kolegiji`, { headers });
                setKolegiji(response1.data);

            } catch (error) {
                console.log("Greška prilikom dohvata podataka:", error);
            }
        }
        fetchInitialData();
    }, []);

    const navigate = useNavigate();

    const natrak_stisnuto = () => {
        navigate("/pregledRezervacijaDvoranaAdministrator");
    }

    const spremi_podatke = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const nastavnik = event.target.Nastavnik.value;
        const kolegij = event.target.Kolegij.value;
        const dvorana = event.target.Dvorana.value;
        const razlog = event.target.Razlog.value;
        const datum = event.target.Datum.value;
        const pocetak = event.target.Pocetak.value;
        const kraj = event.target.Kraj.value;

        const userData = { nastavnik, kolegij, dvorana, razlog, datum, pocetak, kraj };

        posalji_podatke(userData);
    }

    const posalji_podatke = async (userData) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.post("http://localhost:3000/api/unosRezervacijeDvorane", userData, {headers});
        } catch (error) {
            console.log("Greška prilikom spremanja rezervacije dvorane:", error);
        }
        window.alert('Rezervacija dvorane uspješno dodana.')
        navigate("/pregledRezervacijaDvoranaAdministrator");
    }

    return (
        <div className="unos-rezervacija-dvorana-container">
            <form className="login-form" onSubmit={spremi_podatke}>
                <div className="form-group">
                    <label htmlFor="Nastavnik">Nastavnik: </label>
                    <select id="Nastavnik" name="Nastavnik" required>
                        <option value="">Odaberite nastavnika</option>
                        {nastavnici.map((nastavnik) => (
                            <option key={nastavnik.id} value={nastavnik.id}>
                                {nastavnik.ime} {nastavnik.prezime}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="Kolegij">Kolegij: </label>
                    <select id="Kolegij" name="Kolegij" required>
                        <option value="">Odaberite kolegij</option>
                        {kolegiji.map((kolegij) => (
                            <option key={kolegij.id} value={kolegij.id}>
                                {kolegij.naziv}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="Dvorana">Dvorana: </label>
                    <select id="Dvorana" name="Dvorana" required>
                        <option value="">Odaberite dvoranu</option>
                        <option value="Dvorana1">Dvorana 1</option>
                        <option value="Dvorana2">Dvorana 2</option>
                        <option value="Dvorana3">Dvorana 3</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="Razlog">Razlog: </label>
                    <select id="Razlog" name="Razlog" required>
                        <option value="">Odaberite razlog</option>
                        <option value="Predavanja">Predavanja</option>
                        <option value="Ispit">Ispit</option>
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
                <div className="form-group toggle-group">
                    <label htmlFor="toggleInput" style={{marginLeft: '10px'}}>Ponavljanje</label>
                    <label className="switch">
                        <input type="checkbox" id="toggleInput" name="toggleInput" />
                        <span className="slider round"></span>
                    </label>
                </div>
                <button type="button" onClick={natrak_stisnuto}>Natrag</button>
                <button type="submit">Spremi</button>
            </form>
        </div>
    )
}

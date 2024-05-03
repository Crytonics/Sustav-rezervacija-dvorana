import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

export default function AzuriranjeKorisnikaAdministrator() {

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');


    const natrak_stisnuto = () => {
        navigate("/listaKorisnikaAdministrator");
    }

    const [korisnici, setKorisnici] = useState([]);
    const [ime, setIme] = useState([]);
    const [prezime, setPrezime] = useState([]);
    const [korisnicko_ime, setKorisnicko_ime] = useState([]);

    const { idKorisnika } = useParams()

    const filteredKorisnici = korisnici.filter(korisnik =>
        korisnik.korisnicko_ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        korisnik.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        korisnik.prezime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        korisnik.uloga.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImeChange = (event) => {
        setIme(event.target.value); // Update state on user input
    };

    const handlePrezimeChange = (event) => {
        setPrezime(event.target.value); // Update state on user input
    };

    const handleKorisnicko_imeChange = (event) => {
        setKorisnicko_ime(event.target.value); // Update state on user input
    };
    

    
    useEffect(() => {
        async function fetchInitialData() {

            // Get the JWT token from local storage
            const token = localStorage.getItem("token");
        
            // Set up the request headers to include the JWT token
            const headers = { Authorization: `Bearer ${token}` }; 

            try {
                const response = await axios.get(`http://localhost:3000/api/pojed_korisnici/${idKorisnika}`, { headers });
                setKorisnici(response.data);
                
                if (response.data.length > 0) {
                    setIme(response.data[0].ime);
                    setPrezime(response.data[0].prezime);
                    setKorisnicko_ime(response.data[0].korisnicko_ime);
                }
                
            } catch (error) {
                console.log("Greška prilikom dohvata korisnika:", error);
            } 
            console.log(korisnici);
            
            
        }

        fetchInitialData();
    }, []);

    const spremi_podatke = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const ime = event.target.ime.value;
        const prezime = event.target.prezime.value;
        const korisnicko_ime = event.target.korisnicko_ime.value;
        const password = event.target.password.value;
        const uloga = event.target.uloga.value;

        const userData = { ime, prezime, korisnicko_ime, password, uloga };

        posalji_podatke(userData);
    }

    const posalji_podatke = async (userData) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.put(`http://localhost:3000/api/azuriranjeKorisnika/${idKorisnika}`, userData, {headers});
        } catch (error) {
            console.log("Greška prilikom dohvata korisnika:", error);
        }
        window.alert("Korisnik uspješno ažuriran.")
        navigate("/listaKorisnikaAdministrator");
        
    }

    const uloga = filteredKorisnici.length > 0 ? filteredKorisnici[0].uloga : '';

    return (
        <div className="unos-korisnika-container">
        <form className="login-form" onSubmit={spremi_podatke}>
            <div className="form-group">
                <label htmlFor="ime">Ime: </label>
                <input type="text" id="ime" name="ime" value={ime} onChange={handleImeChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="prezime">Prezime: </label>
                <input type="text" id="prezime" name="prezime" value={prezime} onChange={handlePrezimeChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="korisnicko_ime">Korisničko ime: </label>
                <input type="text" id="korisnicko_ime" name="korisnicko_ime" value={korisnicko_ime} onChange={handleKorisnicko_imeChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="password">Lozinka: </label>
                <input type="password" id="password" name="password" required />
            </div>
            <div className="form-group">
                <label htmlFor="uloga">Uloga: </label>
                <select id="uloga" name="uloga" required>
                    {uloga === "admin" ? (
                        <>
                        <option value="admin">Admin</option>
                        <option value="nastavnik">nastavnik</option>
                        
                        </>
                    ) : (
                        <>
                        <option value="nastavnik">nastavnik</option>
                        <option value="admin">Admin</option>
                        </>
                    )}
                    
                </select>
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}

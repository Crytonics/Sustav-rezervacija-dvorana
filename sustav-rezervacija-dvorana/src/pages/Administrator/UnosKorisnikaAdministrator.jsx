import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function UnosKorisnikaAdministrator() {

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

    const natrak_stisnuto = () => {
        navigate("/listaKorisnikaAdministrator");
    }

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
            const response = await axios.post("http://localhost:3000/api/unosKorisnika", userData, {headers});
        } catch (error) {
            console.log("Greška prilikom dohvata korisnika:", error);
        }
        window.alert('Korisnik uspješno dodan.')
        navigate("/listaKorisnikaAdministrator");
    }

    return (
        <div className="unos-korisnika-container">
        <form className="login-form" onSubmit={spremi_podatke}>
            <div className="form-group">
                <label htmlFor="ime">Ime: </label>
                <input type="text" id="ime" name="ime" required />
            </div>
            <div className="form-group">
                <label htmlFor="prezime">Prezime: </label>
                <input type="text" id="prezime" name="prezime" required />
            </div>
            <div className="form-group">
                <label htmlFor="korisnicko_ime">Korisničko ime: </label>
                <input type="text" id="korisnicko_ime" name="korisnicko_ime" required />
            </div>
            <div className="form-group">
                <label htmlFor="password">Lozinka: </label>
                <input type="password" id="password" name="password" required />
            </div>
            <div className="form-group">
                <label htmlFor="uloga">Uloga: </label>
                <select id="uloga" name="uloga" required>
                    <option value="admin">Admin</option>
                    <option value="nastavnik">nastavnik</option>
                </select>
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}

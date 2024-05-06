import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function UnosStudijskihProgramaAdministrator() {

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
    
        return true;
    };

    const navigate = useNavigate();

    const natrak_stisnuto = () => {
        navigate("/kolegijiAdministrator");
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
        const naziv_studija = event.target.naziv.value;

        const userData = { naziv_studija };

        decodeToken(token);

        posalji_podatke(userData);
    }

    const posalji_podatke = async (userData) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.post("http://localhost:3000/api/unosStudijskogPrograma", userData, {headers});
        } catch (error) {
            console.log("Greška prilikom dohvata korisnika:", error);
        }
        window.alert('Korisnik uspješno dodan.')
        navigate("/studijskiProgramiAdministrator");
    }

    return (
        <div className="unos-korisnika-container">
        <form className="login-form" onSubmit={spremi_podatke}>
            <div className="form-group">
                <label htmlFor="naziv">Naziv studija: </label>
                <input type="text" id="naziv" name="naziv" required />
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}

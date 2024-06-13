import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function UnosDvoranaAdministrator() {

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
        navigate("/dvoraneAdministrator");
    }

    useEffect(() => {
        async function fetchInitialData() {

            // Get the JWT token from local storage
            const token = localStorage.getItem("token");
        
            // Set up the request headers to include the JWT token
            const headers = { Authorization: `Bearer ${token}` }; 

            decodeToken(token);
            
            isAdmin(token, headers);
        }

        fetchInitialData();
    }, []);

    const spremi_podatke = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const naziv = event.target.naziv.value;
        const svrha = event.target.svrha.value;
        

        const userData = { naziv, svrha };

        posalji_podatke(userData);
    }

    const posalji_podatke = async (userData) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.post("http://localhost:3000/api/unosDvorane", userData, {headers});
        } catch (error) {
            console.log("Greška prilikom dohvata dvorana:", error);
        }
        window.alert('Dvorana je uspješno dodana.')
        navigate("/dvoraneAdministrator");
    }

    return (
        <div className="unos-korisnika-container">
        <form className="login-form" onSubmit={spremi_podatke}>
            <div className="form-group">
                <label htmlFor="naziv">Naziv: </label>
                <input type="text" id="naziv" name="naziv" required />
            </div>
            <div className="form-group">
                <label htmlFor="svrha">Svrha: </label>
                <select id="svrha" name="svrha" required>
                    <option value="predavanje">Predavanje</option>
                    <option value="ispit">Ispit</option>
                </select>
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}

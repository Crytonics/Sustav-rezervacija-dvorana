import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function UnosDvoranaAdministrator() {

    const navigate = useNavigate();

    const natrak_stisnuto = () => {
        navigate("/dvoraneAdministrator");
    }

    const spremi_podatke = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const naziv = event.target.naziv.value;
        const opis = event.target.opis.value;
        const svrha = event.target.svrha.value;
        const aktivan = event.target.aktivan.value;
        

        const userData = { naziv, opis, svrha, aktivan };

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
        window.alert('Dvorana je  uspješno dodana.')
        navigate("/listaDvoranaAdministrator");
    }

    return (
        <div className="unos-korisnika-container">
        <form className="login-form" onSubmit={spremi_podatke}>
            <div className="form-group">
                <label htmlFor="naziv">Ime: </label>
                <input type="text" id="naziv" name="naziv" required />
            </div>
            <div className="form-group">
                <label htmlFor="Opis">Opis: </label>
                <input type="text" id="opis" name="opis" required />
            </div>
            <div className="form-group">
                <label htmlFor="svrha">Svrha: </label>
                <input type="text" id="svrha" name="svrha" required />
            </div>
            <div className="form-group">
                <label htmlFor="aktivan">Aktivna: </label>
                <input type="text" id="aktivan" name="aktivan" required />
            </div>
            
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}


   /* return (
        <div className="unos-korisnika-container">
        <form className="login-form">
            <div className="form-group">
                <label htmlFor="naziv">Naziv dvorane: </label>
                <input type="text" id="naziv" name="naziv" required />
            </div>
            <div className="form-group">
                <label htmlFor="opis">Opis dvorane: </label>
                <input type="text" id="opis" name="opis" required />
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
} */

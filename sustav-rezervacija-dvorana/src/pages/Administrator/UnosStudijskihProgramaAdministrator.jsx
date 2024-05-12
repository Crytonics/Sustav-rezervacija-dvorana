import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { ChromePicker } from 'react-color-v2';

export default function UnosStudijskihProgramaAdministrator() {

    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#fff');

    const navigate = useNavigate();

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

    const natrak_stisnuto = () => {
        navigate("/studijskiProgramiAdministrator");
    };

    useEffect(() => {
        async function fetchInitialData() {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` }; 
            isAdmin(token, headers);
        }

        fetchInitialData();
    }, []);

    const spremi_podatke = (event) => {
        event.preventDefault();
        const naziv_studija = event.target.naziv.value;
        const userData = { naziv_studija, backgroundColor };
        const token = localStorage.getItem("token");
        decodeToken(token);
        posalji_podatke(userData);
    };

    const posalji_podatke = async (userData) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            await axios.post("http://localhost:3000/api/unosStudijskogPrograma", userData, {headers});
            window.alert('Korisnik uspješno dodan.');
            navigate("/studijskiProgramiAdministrator");
        } catch (error) {
            console.log("Greška prilikom dohvata korisnika:", error);
        }
    };

    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleClose = () => {
        setDisplayColorPicker(false);
    };

    const handleColorPickerClick = (e) => {
        e.stopPropagation(); // Prevents the event from propagating to parent elements
    };

    const popover = {
        position: 'absolute',
        zIndex: '2',
    };

    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    };

    const handleChange = (color, event) => {
        setBackgroundColor(color.hex); // Update the background color state with the selected color
    }

    return (
        <div className="unos-korisnika-container">
            <form className="login-form" onSubmit={spremi_podatke}>
                <div className="form-group">
                    <label htmlFor="naziv">Naziv studija: </label>
                    <input type="text" id="naziv" name="naziv" required />
                </div>
                <div>
                <label htmlFor="colorPicker">Odaberite boju:</label>
                <br/>
                <button type="button" className="pick-color-button" onClick={handleClick}>Pick Color</button>
                    {displayColorPicker ? (
                        <div style={popover} onClick={handleColorPickerClick}>
                            <div style={cover} onClick={handleClose}/>
                            <ChromePicker 
                            color={ backgroundColor }
                            onChange={ handleChange }
                            disableAlpha />
                        </div>
                    ) : null}
                </div>
                <br/>
                <button type="button" onClick={natrak_stisnuto}>Natrag</button>
                <button type="submit">Spremi</button>
            </form>
        </div>
    );
}
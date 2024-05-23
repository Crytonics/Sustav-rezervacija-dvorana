import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { ChromePicker } from 'react-color-v2';

export default function AzuriranjeStudijskihProgramaAdministrator() {

    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('');

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
    
        dohvatiPodatke(headers);
        return true;
    };

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const natrak_stisnuto = () => {
        navigate("/studijskiProgramiAdministrator");
    }

    const [studenskiProgrami, setStudenskiProgrami] = useState([]);
    const [naziv, setNaziv] = useState([]);

    const { idStudProg } = useParams()

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

            decodeToken(token);

            isAdmin(token, headers);
        }

        fetchInitialData();
    }, []);

    const dohvatiPodatke = async (headers) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/pojed_studijskiProgrami/${idStudProg}`, { headers });
            setStudenskiProgrami(response.data);
            if (response.data.length > 0) {
                setNaziv(response.data[0].naziv);
                setBackgroundColor(response.data[0].boja);
            }
            
        } catch (error) {
            console.log("Greška prilikom dohvata studijskog programa:", error);
        } 
    }

    const spremi_podatke = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const naziv = event.target.naziv.value;

        const userData = { naziv };

        posalji_podatke(userData);
    }

    const posalji_podatke = async (userData) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.put(`http://localhost:3000/api/azuriranjeStudijskihPrograma/${idStudProg}`, userData, {headers});
        } catch (error) {
            console.log("Greška prilikom dohvata studijskog programa:", error);
        }
        window.alert("Studijski program je uspješno ažuriran.")
        navigate("/studijskiProgramiAdministrator");
        
    }

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
                <input type="text" id="naziv" name="naziv" value={naziv} onChange={handleNazivChange} required />
            </div>
            <div>
                <label htmlFor="colorPicker">Odaberite boju:</label>
                <br/>
                <button type="button" className="pick-color-button" onClick={handleClick}>Pick Color</button>
                Boja: {backgroundColor}
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
    )
}

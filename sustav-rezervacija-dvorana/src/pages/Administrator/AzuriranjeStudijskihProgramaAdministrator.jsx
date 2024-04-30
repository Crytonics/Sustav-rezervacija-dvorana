import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

export default function AzuriranjeStudijskihProgramaAdministrator() {

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const natrak_stisnuto = () => {
        navigate("/studijskiProgramiAdministrator");
    }

    const [studenskiProgrami, setStudenskiProgrami] = useState([]);

    const { idStudProg } = useParams()

    const filteredStudenskiProgrami = studenskiProgrami.filter(studprog =>
        studprog.naziv.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        async function fetchInitialData() {

            // Get the JWT token from local storage
            const token = localStorage.getItem("token");
        
            // Set up the request headers to include the JWT token
            const headers = { Authorization: `Bearer ${token}` }; 

            try {
                const response = await axios.get(`http://localhost:3000/api/pojed_studijskiProgrami/${idStudProg}`, { headers });
                setStudenskiProgrami(response.data);
              
                
                
            } catch (error) {
                console.log("Greška prilikom dohvata studijskog programa:", error);
            } 
            
        }

        fetchInitialData();
    }, []);

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

    return (
        <div className="unos-korisnika-container">
        <form className="login-form" onSubmit={spremi_podatke}>
            <div className="form-group">
                <label htmlFor="naziv">Naziv studija: </label>
                <input type="text" id="naziv" name="naziv" placeholder={filteredStudenskiProgrami.length > 0 ? filteredStudenskiProgrami[0].naziv : 'Unesite ime'} required />
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}

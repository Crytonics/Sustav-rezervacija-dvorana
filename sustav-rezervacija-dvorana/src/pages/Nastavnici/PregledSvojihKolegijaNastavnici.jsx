import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function PregledSvojihKolegijaNastavnici() {

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.uloga;

        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    const isAdminOrNastavnik = (token, headers) => {
        if (!token) {
            navigate('/odbijenPristup');
            return false;
        }
    
        const role = decodeToken(token);
        if (role !== "admin" && role !== "nastavnik") {
            navigate('/odbijenPristup');
            return false;
        }

        // Dobivanje informacija iz tokena
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        // Id iz tokena
        var payloadObj = JSON.parse(jsonPayload);
        const id_korisnika = (payloadObj.id);
    
        dohvatiKolegija(id_korisnika, headers);
        return true;
    };

    const [searchTerm, setSearchTerm] = useState('');
    
    const [kolegiji, setKolegiji] = useState([]);

    const [stupci, setStupci] = useState([
        {
            name: "naziv",
            required: true,
            label: "Naziv",
            align: "left",
            field: "naziv",
            sortable: true,
        },
        {
            name: "studijski_program",
            required: true,
            label: "Studijski program",
            align: "left",
            field: "studijski_program",
            sortable: true,
        },
    ]);
    
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const filteredKolegiji = kolegiji.filter(kolegij =>
        kolegij.naziv_kolegija.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kolegij.naziv_studijskog_programa.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredStupci = stupci.filter(stupc =>
        stupc.name.toLowerCase()
    );

    const navigate = useNavigate();

    const vidi_stisnuto = (idKolegija) => {
        navigate(`/pojediniKolegijiSvi/${idKolegija}`);
    }

    useEffect(() => {
        async function fetchInitialData() {
            // Get the JWT token from local storage
            const token = localStorage.getItem("token");
        
            // Set up the request headers to include the JWT token
            const headers = { Authorization: `Bearer ${token}` };

            decodeToken(token);

            isAdminOrNastavnik(token, headers);
        }

        fetchInitialData();
    }, []);

    const dohvatiKolegija = async (id_korisnika, headers) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/pojed_kolegiji?id_korisnika=${id_korisnika}`, {headers});
            setKolegiji(response.data);
            console.log("DATA:", response.data);
        } catch (error) {
            console.log("Greška prilikom dohvata korisnika:", error);
        } 
    }

    return (
        <div className="dvorane_svi">
            <h1>
                Popis kolegija
            </h1>

            <div className='okvir-pretrazivac'>
                <input
                    className='pretrazivac'
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder='Pretraži'
                />
            </div>

            <table>
                <thead>
                    <tr className='tr_naziv'>
                        {filteredStupci.length > 0 && 
                            filteredStupci.map(stupc => (
                                <th key={stupc.label}>{stupc.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredKolegiji.map((kolegij, index) => (
                        <tr key={index}>
                            <td>{kolegij.naziv_kolegija }</td>
                            <td>{kolegij.naziv_studijskog_programa}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

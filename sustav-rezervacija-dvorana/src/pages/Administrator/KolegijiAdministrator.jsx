import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function KolegijiAdministrator() {

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
    
        dohvatiKolegija(headers);
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
            name: "izvodjac_kolegija",
            required: true,
            label: "Izvođač kolegija",
            align: "left",
            field: "izvodjac_kolegija",
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
        {
            name: "funkcije",
            label: "Funkcije",
            align: "center",
        }
    ]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredKolegiji = kolegiji.filter(kolegij =>
        kolegij.naziv_kolegija.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kolegij.korisnicko_ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kolegij.naziv_studijskog_programa.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredStupci = stupci.filter(stupc =>
        stupc.name.toLowerCase()
    );

    const navigate = useNavigate();

    const dodaj_stisnuto = () => {
        navigate("/unosKolegijaAdministrator");
    }

    const vidi_stisnuto = (idKolegija) => {
        navigate(`/pojediniKolegijiSvi/${idKolegija}`);
    }
    
    const uredi_stisnuto = (idKolegija) => {
        navigate(`/azuriranjeKolegijaAdministrator/${idKolegija}`);
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

    const dohvatiKolegija = async (headers) => {
        try {
            const response = await axios.get("http://localhost:3000/api/kolegiji", {headers});
            setKolegiji(response.data);
        } catch (error) {
            console.log("Greška prilikom dohvata korisnika:", error);
        } 
    }

    const obrisiKorisnika = async (idKolegija) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        if(window.confirm('Jeste li sigurni da želite obrisati korisnika?')) {
            const response = await axios.put("http://localhost:3000/api/onemoguciKolegij/" + idKolegija, null, {headers}); //null zbog PUT 'payloada'
            const response2 = await axios.get("http://localhost:3000/api/kolegiji", {headers});
            setKolegiji(response2.data);
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
                <button className="gumb_dodaj" onClick={dodaj_stisnuto}>Dodaj kolegij</button>
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
                            <td>{kolegij.korisnicko_ime }</td>
                            <td>{kolegij.naziv_studijskog_programa}</td>
                            
                            <td>
                                <button className="gumb_uredi" onClick={() => uredi_stisnuto(kolegij.id_kolegija)}>Uredi</button>
                                <button className="gumb_obriši" onClick={() => obrisiKorisnika(kolegij.id_kolegija)}>Izbriši</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

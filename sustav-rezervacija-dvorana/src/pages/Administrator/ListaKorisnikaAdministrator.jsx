import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function ListaKorisnikaAdministrator() {

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
    
        dohvatiKorisnike(headers);
        return true;
    };

    const [searchTerm, setSearchTerm] = useState('');

    const [korisnici, setKorisnici] = useState([]);

    const [stupci, setStupci] = useState([
        {
            name: "korisnicko_ime",
            required: true,
            label: "Korisničko ime",
            align: "left",
            field: "korisnicko_ime",
            sortable: true,
        },
        {
            name: "ime",
            required: true,
            label: "Ime",
            align: "left",
            field: "ime",
            sortable: true,
        },
        {
            name: "prezime",
            required: true,
            label: "Prezime",
            align: "left",
            field: "prezime",
            sortable: true,
        },
        {
            name: "uloga",
            required: true,
            label: "Uloga",
            align: "left",
            field: "uloga",
            sortable: true,
        },
        {
            name: "funkcije",
            label: "Funkcije",
            align: "center",
        },
    ]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredKorisnici = korisnici.filter(korisnik =>
        korisnik.korisnicko_ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        korisnik.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        korisnik.prezime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        korisnik.uloga.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredStupci = stupci.filter(stupc =>
        stupc.name.toLowerCase()
    );

    const navigate = useNavigate();

    const dodaj_stisnuto = () => {
        navigate("/UnosKorisnikaAdministrator");
    }

    
    const uredi_stisnuto = async (idKorisnika) => {
        navigate(`/AzuriranjeKorisnikaAdministrator/${idKorisnika}`);
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

    const dohvatiKorisnike = async (headers) => {
        try {
            const response = await axios.get("http://localhost:3000/api/korisnici", {headers});
            setKorisnici(response.data);
        } catch (error) {
            console.log("Greška prilikom dohvata korisnika:", error);
        }
    }

    const obrisiKorisnika = async (idKorisnika) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        if(window.confirm('Jeste li sigurni da želite obrisati korisnika?')) {
            const response = await axios.put("http://localhost:3000/api/onemoguciKorisnika/" + idKorisnika, null, {headers}); //null zbog PUT 'payloada'
            const response2 = await axios.get("http://localhost:3000/api/korisnici", {headers});
            setKorisnici(response2.data);
        }
    }


    return (
        <div className="dvorane_svi">
            <h1>
                Popis korisnika
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
                <button className="gumb_dodaj" onClick={dodaj_stisnuto}>Dodaj korisnika</button>
            </div>

            <table>
                <thead>
                    <tr className='tr_naziv'>
                    {filteredStupci.length > 0 && 
                        filteredStupci.map(stupc => (
                            <th key={stupc.label}>{stupc.label}</th>
                        ))
                    }
                    </tr>
                </thead>
                <tbody>
                            {filteredKorisnici.map((korisnik, index) => (
                                <tr key={index}>
                                <td>{korisnik.korisnicko_ime}</td>
                                <td>{korisnik.ime}</td>
                                <td>{korisnik.prezime}</td>
                                <td>{korisnik.uloga}</td>
                            
                            <td>
                                <button className="gumb_uredi" onClick={() => uredi_stisnuto(korisnik.id_korisnik)}>Uredi</button>
                                <button className="gumb_obriši" onClick={() => obrisiKorisnika(korisnik.id_korisnik)}>Izbriši</button>
                            </td>
                        </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}

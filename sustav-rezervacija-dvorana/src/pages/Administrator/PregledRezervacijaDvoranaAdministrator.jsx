import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


export default function PregledRezervacijaDvoranaAdministrator() {

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

        // Dobivanje informacija iz tokena
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        // Id iz tokena
        var payloadObj = JSON.parse(jsonPayload);
        const id_korisnika = (payloadObj.id);
    
        dohvatiZahtjeve(id_korisnika, headers);
        return true;
    };

    const [searchTerm, setSearchTerm] = useState('');

    const [zahtjevi, setZahtjevi] = useState([]);

    const [stupci, setStupci] = useState([
        {
            name: "naziv_korisnik",
            required: true,
            label: "Korisnik (Korisničko ime)",
            align: "left",
            field: "naziv_korisnik",
            sortable: true,
        },
        {
            name: "naziv_kolegija",
            required: true,
            label: "Naziv kolegija",
            align: "left",
            field: "naziv_kolegija",
            sortable: true,
        },
        {
            name: "dvorana",
            required: true,
            label: "Dvorana",
            align: "left",
            field: "dvorana",
            sortable: true,
        },
        {
            name: "datum",
            required: true,
            label: "Datum",
            align: "left",
            field: "datum",
            sortable: true,
        },
        {
            name: "vrijeme",
            required: true,
            label: "Vrijeme",
            align: "left",
            field: "vrijeme",
            sortable: true,
        },
        {
            name: "svrha",
            required: true,
            label: "Svrha",
            align: "left",
            field: "svrha",
            sortable: true,
        },
        {
            name: "ponavljanje",
            required: true,
            label: "Ponavljanje",
            align: "left",
            field: "ponavljanje",
            sortable: true,
        },
        {
            name: "status",
            required: true,
            label: "Status",
            align: "left",
            field: "status",
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

    const filteredZahtjevi = zahtjevi.filter(zahtjev =>
        (zahtjev.korisnicko_ime && zahtjev.korisnicko_ime.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (zahtjev.kolegij && zahtjev.kolegij.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (zahtjev.dvorana && zahtjev.dvorana.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (zahtjev.datum && zahtjev.datum.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (zahtjev.vrijeme && zahtjev.vrijeme.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (zahtjev.svrha && zahtjev.svrha.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (zahtjev.ponavljanje && zahtjev.ponavljanje.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (zahtjev.status && zahtjev.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (zahtjev.id_kolegij && zahtjev.id_kolegij.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
        (zahtjev.id_entry && zahtjev.id_entry.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredStupci = stupci.filter(stupc =>
        stupc.name.toLowerCase()
    );

    const navigate = useNavigate();

    const dodaj_stisnuto = () => {
        navigate("/UnosRezervacijaDvoranaAdministrator");
    }

    const vidi_stisnuto = (id_entry) => {
        navigate(`/pojediniKolegijiSvi/${id_entry}`);
    }

    const uredi_stisnuto = async (id_entry) => {
        navigate(`/AzuriranjeRezervacijaDvoranaAdministrator/${id_entry}`);
    }

    const obrisiEntry = async (id_entry) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        if(window.confirm('Jeste li sigurni da želite obrisati rezervaciju?')) {
            const response = await axios.delete("http://localhost:3000/api/izbrisiRezervaciju/" + id_entry, {headers});
            window.location.reload()
        }
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

    const dohvatiZahtjeve = async (id_korisnika, headers) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/entryAdministrator`, {headers});

            const modifiedData = response.data.map(item => ({
                ...item,
                ponavljanje: item.ponavljanje === 0 ? "Ne" : (item.ponavljanje === 1 ? "Da" : item.ponavljanje),
                status: item.status === "0" ? "Odbijeno" : (item.status === "1" ? "Odobreno" : item.status)
            }));

            setZahtjevi(modifiedData);
            
        } catch (error) {
            console.log("Greška prilikom dohvata podataka:", error);
        } 
    }

    return (
        <div className="dvorane_svi">
            <h1>
                Popis rezervacija dvorana
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
                <button className="gumb_dodaj" onClick={dodaj_stisnuto}>Dodaj novu rezervaciju</button>
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
                    {filteredZahtjevi.map((zahtjev, index) => (
                        <tr key={index}>
                            <td>{zahtjev.korisnicko_ime}</td>
                            <td>{zahtjev.kolegij }</td>
                            <td>{zahtjev.dvorana }</td>
                            <td>{zahtjev.datum }</td>
                            <td>{zahtjev.vrijeme }</td>
                            <td>{zahtjev.svrha }</td>
                            <td>{zahtjev.ponavljanje }</td>
                            <td>{zahtjev.status }</td>
                            <td>
                            <button className="gumb_vidi" onClick={() => vidi_stisnuto(zahtjev.id_entry)}>Vidi</button>
                            <button className="gumb_uredi" onClick={() => uredi_stisnuto(zahtjev.id_entry)}>Uredi</button>
                            <button className="gumb_obriši" onClick={() => obrisiEntry(zahtjev.id_entry)}>Izbriši</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

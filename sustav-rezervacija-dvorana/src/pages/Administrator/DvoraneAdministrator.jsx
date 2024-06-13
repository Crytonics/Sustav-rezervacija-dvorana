import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function DvoraneAdministrator() {

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
    
        dohvatiDvorane(headers);
        return true;
    };

    const [searchTerm, setSearchTerm] = useState('');

    const [dvorane, setDvorane] = useState([]);

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
            name: "svrha",
            required: true,
            label: "Svrha",
            align: "left",
            field: "svrha",
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

    const filteredDvorane = dvorane.filter(dvorana =>
        dvorana.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dvorana.svrha.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredStupci = stupci.filter(stupc =>
        stupc.name.toLowerCase()
    );

    const navigate = useNavigate();

    const dodaj_stisnuto = () => {
        navigate("/unosDvoranaAdministrator");
    }

    const vidi_stisnuto = (id_dvorane) => {
        navigate(`/pojedineDvoraneSvi/${id_dvorane}`);
    }

    const uredi_stisnuto = async (id_dvorane) => {
        navigate(`/azuriranjeDvoranaAdministrator/${id_dvorane}`);
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

    const dohvatiDvorane = async (headers) => {
        try {
            const response = await axios.get("http://localhost:3000/api/dvorane", {headers});
            setDvorane(response.data);
        } catch (error) {
            console.log("Greška prilikom dohvata korisnika:", error);
        }
    }

    const obrisiKorisnika = async (id_dvorane) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        if(window.confirm('Jeste li sigurni da želite obrisati korisnika?')) {
            const response = await axios.put("http://localhost:3000/api/onemoguciDvoranu/" + id_dvorane, null, {headers}); //null zbog PUT 'payloada'
            const response2 = await axios.get("http://localhost:3000/api/dvorane", {headers});
            setDvorane(response2.data);
        }
    }

    return (
        <div className="dvorane_svi">
            <h1>
                Popis dvorana
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
                <button className="gumb_dodaj" onClick={dodaj_stisnuto}>Dodaj dvoranu</button>
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
                    {filteredDvorane.map((dvorana, index) => (
                        <tr key={index}>
                            <td>{dvorana.naziv}</td>
                            <td>{dvorana.svrha}</td>
                            <td>
                                <button className="gumb_uredi" onClick={() => uredi_stisnuto(dvorana.id_dvorane)}>Uredi</button>
                                <button className="gumb_obriši" onClick={() => obrisiKorisnika(dvorana.id_dvorane)}>Izbriši</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

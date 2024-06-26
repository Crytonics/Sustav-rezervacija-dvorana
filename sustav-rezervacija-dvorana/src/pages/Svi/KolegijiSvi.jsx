import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function KolegijiSvi() {

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

    const vidi_stisnuto = (idKolegija) => {
        navigate(`/pojediniKolegijiSvi/${idKolegija}`);
    }

    useEffect(() => {
        async function fetchInitialData() {

            dohvatiKolegija();
        }

        fetchInitialData();
    }, []);

    const dohvatiKolegija = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/kolegiji");
            setKolegiji(response.data);
        } catch (error) {
            console.log("Greška prilikom dohvata kolegija:", error);
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
                            <td>{kolegij.korisnicko_ime }</td>
                            <td>{kolegij.naziv_studijskog_programa}</td>
                            

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

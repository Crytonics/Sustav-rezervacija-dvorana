import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function DvoraneSvi() {

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

    const vidi_stisnuto = (id_dvorane) => {
        navigate(`/pojedineDvoraneSvi/${id_dvorane}`);
    }

    useEffect(() => {
        async function fetchInitialData() {

            dohvatiDvorane();
        }

        fetchInitialData();
    }, []);

    const dohvatiDvorane = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/dvorane");
            setDvorane(response.data);
        } catch (error) {
            console.log("Greška prilikom dohvata korisnika:", error);
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
            </div>

            <table>
                <thead>
                    <tr>
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
                                <button className="gumb_vidi" onClick={() => vidi_stisnuto(dvorana.id_dvorane)}>Vidi</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

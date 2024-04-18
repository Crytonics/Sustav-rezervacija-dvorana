import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function DvoraneSvi() {
    const [searchTerm, setSearchTerm] = useState('');

    const [programs, setPrograms] = useState([
        { id: 1, naziv: 'Dvorana 1', kat: '1. Kat'},
        { id: 2, naziv: 'Dvorana 2', kat: '2. Kat'},
        { id: 3, naziv: 'Dvorana 3', kat: '3. Kat'},
    ]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredPrograms = programs.filter(program =>
        program.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.kat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navigate = useNavigate();

    const vidi_stisnuto = () => {
        navigate("/pojedineDvoraneSvi");
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
                        <th>Naziv</th>
                        <th>Kat</th>
                        <th>Funkcije</th>
                    </tr>
                </thead>
                <tbody>
                   {filteredPrograms.map((program) => (
                        <tr key={program.id}>
                            <td>{program.naziv}</td>
                            <td>{program.kat}</td>
                            <td>
                                <button className="gumb_vidi" onClick={vidi_stisnuto}>Vidi</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

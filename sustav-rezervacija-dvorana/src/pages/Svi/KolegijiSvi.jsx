import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function KolegijiSvi() {

    const [searchTerm, setSearchTerm] = useState('');

    const [programs, setPrograms] = useState([
        { id: 1, naziv: 'Programiranje', izvodjac: 'Primjer Izvođača', studij: 'Informatika'},
        { id: 2, naziv: 'Elementi telematike', izvodjac: 'Primjer Izvođača 2', studij: 'Telematika'},
        { id: 3, naziv: 'Baze podataka', izvodjac: 'Primjer Izvođača 3', studij: 'Promet'},
    ]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredPrograms = programs.filter(program =>
        program.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.izvodjac.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.studij.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navigate = useNavigate();

    const vidi_stisnuto = () => {
        navigate("/pojediniKolegijiSvi");
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
                    <tr>
                        <th>Naziv</th>
                        <th>Izvođač kolegija</th>
                        <th>Studijski program</th>
                        <th>Funkcije</th>
                    </tr>
                </thead>
                <tbody>
                {filteredPrograms.map((program) => (
                        <tr key={program.id}>
                            <td>{program.naziv}</td>
                            <td>{program.izvodjac}</td>
                            <td>{program.studij}</td>
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

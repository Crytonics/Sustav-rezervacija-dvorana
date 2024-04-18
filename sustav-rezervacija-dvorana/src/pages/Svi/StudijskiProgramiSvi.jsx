import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function StudijskiProgramiSvi() {

    const [searchTerm, setSearchTerm] = useState('');

    const [programs, setPrograms] = useState([
        { id: 1, naziv: 'Informatika' },
        { id: 2, naziv: 'Telematika' },
        { id: 3, naziv: 'Promet' },
    ]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredPrograms = programs.filter(program =>
        program.naziv.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navigate = useNavigate();

    const vidi_stisnuto = () => {
        navigate("/pojediniKolegijiPoStudijimaSvi");
    }

    return (
        <div className="dvorane_svi">
            <h1>
                Popis Studijskih programa
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
                        <th>Funkcije</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPrograms.map((program) => (
                        <tr key={program.id}>
                            <td>{program.naziv}</td>
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
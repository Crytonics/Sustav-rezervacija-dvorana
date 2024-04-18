import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function DvoraneAdministrator() {

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

    const dodaj_stisnuto = () => {
        navigate("/unosDvoranaAdministrator");
    }

    const vidi_stisnuto = () => {
        navigate("/pojedineDvoraneSvi");
    }

    const uredi_stisnuto = () => {
        navigate("/azuriranjeDvoranaAdministrator");
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
                                <button className="gumb_uredi" onClick={uredi_stisnuto}>Uredi</button>
                                <button className="gumb_obriši">Izbriši</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

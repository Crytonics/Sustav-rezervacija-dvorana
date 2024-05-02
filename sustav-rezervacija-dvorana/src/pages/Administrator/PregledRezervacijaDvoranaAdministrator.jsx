import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function PregledRezervacijaDvoranaAdministrator() {

    const [searchTerm, setSearchTerm] = useState('');

    const [programs, setPrograms] = useState([
        { id: 1, naziv_kolegija: 'Programiranje', dvorana:"Dvorana 1", datum: "05.04.2024", pocetak: "08:00", kraj: "11:45", izvodjac: 'Primjer Izvođača', razlog: 'Predavanje'},
        { id: 2, naziv_kolegija: 'Elementi telematike', dvorana:"Dvorana 2", datum: "15.04.2024", pocetak: "10:00", kraj: "16:45", izvodjac: 'Primjer Izvođača 2', razlog: 'Predavanje'},
        { id: 3, naziv_kolegija: 'Baze podataka', dvorana:"Dvorana 3", datum: "25.04.2024", pocetak: "16:30", kraj: "20:45", izvodjac: 'Primjer Izvođača 3', razlog: 'Ispit'},
    ]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredPrograms = programs.filter(program =>
        program.naziv_kolegija.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.dvorana.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.datum.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.pocetak.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.kraj.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.izvodjac.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.razlog.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navigate = useNavigate();

    const dodaj_stisnuto = () => {
        navigate("/unosRezervacijaDvoranaAdministrator");
    }
    
    const uredi_stisnuto = () => {
        navigate("/azuriranjeRezervacijaDvoranaAdministrator");
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
                    <tr>
                        <th>Naziv kolegija</th>
                        <th>Dvorana</th>
                        <th>Datum</th>
                        <th>Početak</th>
                        <th>Kraj</th>
                        <th>Izvođač kolegija</th>
                        <th>Razlog</th>
                        <th>Funkcije</th>
                    </tr>
                </thead>
                <tbody>
                {filteredPrograms.map((program) => (
                        <tr key={program.id}>
                            <td>{program.naziv_kolegija}</td>
                            <td>{program.dvorana}</td>
                            <td>{program.datum}</td>
                            <td>{program.pocetak}</td>
                            <td>{program.kraj}</td>
                            <td>{program.izvodjac}</td>
                            <td>{program.razlog}</td>
                            <td>
                                <button className="gumb_vidi">Vidi</button>
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

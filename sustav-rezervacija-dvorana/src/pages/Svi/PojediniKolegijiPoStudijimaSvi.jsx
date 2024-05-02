import React, { useState } from 'react';

export default function PojediniKolegijiPoStudijimaSvi() {

        const [searchTerm, setSearchTerm] = useState('');
    
        const [programs, setPrograms] = useState([
            { id: 1, naziv: 'Programiranje', izvodjac: 'Primjer Izvođača'},
            { id: 2, naziv: 'Elementi telematike', izvodjac: 'Primjer Izvođača 2'},
            { id: 3, naziv: 'Baze podataka', izvodjac: 'Primjer Izvođača 3'},
        ]);
    
        const handleSearchChange = (event) => {
            setSearchTerm(event.target.value);
        };
    
        const filteredPrograms = programs.filter(program =>
            program.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.izvodjac.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        return (
            <div className="dvorane_svi">
                <h1>
                    Popis kolegija za studij "Naziv studija"
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
                            <th>Funkcije</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredPrograms.map((program) => (
                            <tr key={program.id}>
                                <td>{program.naziv}</td>
                                <td>{program.izvodjac}</td>
                                <td>
                                    <button className="gumb_vidi">Vidi</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

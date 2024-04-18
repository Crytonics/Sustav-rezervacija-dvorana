import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function ListaKorisnikaAdministrator() {

    const [searchTerm, setSearchTerm] = useState('');

    const [programs, setPrograms] = useState([
        { id: 1, ime: "Ivan", prezime: "Ljeguja", korisnicko_ime: "iljeguja", uloga: 'Nastavnik' },
        { id: 2, ime: "Marko", prezime: "Šuker", korisnicko_ime: "msuker", uloga: 'Administrator' },
        { id: 3, ime: "Dorian", prezime: "Ljujo", korisnicko_ime: "dljujo", uloga: 'Nastavnik' },
    ]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredPrograms = programs.filter(program =>
        program.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.prezime.toLowerCase().includes(searchTerm.toLowerCase()) || 
        program.korisnicko_ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.uloga.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
    
    const navigate = useNavigate();

    const dodaj_stisnuto = () => {
        navigate("/unosKorisnikaAdministrator");
    }

    const uredi_stisnuto = () => {
        navigate("/azuriranjeKorisnikaAdministrator");
    }

    return (
        <div className="dvorane_svi">
            <h1>
                Popis korisnika u sustavu
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
                <button className="gumb_dodaj" onClick={dodaj_stisnuto}>Dodaj korisnika</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Korisničko ime</th>
                        <th>Uloga</th>
                        <th>Funkcije</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPrograms.map((program) => (
                        <tr key={program.id}>
                            <td>{program.ime}</td>
                            <td>{program.prezime}</td>
                            <td>{program.korisnicko_ime}</td>
                            <td>{program.uloga}</td>
                            <td>
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

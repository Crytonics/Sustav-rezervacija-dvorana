import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

export default function PojediniKolegijiPoStudijimaSvi() {

    const [searchTerm, setSearchTerm] = useState('');

    const [kolegiji, setKolegiji] = useState([]);
    const [studijskiProgram, setStudijskiProgram] = useState('');

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
            name: "studijski_program",
            required: true,
            label: "Studijski program",
            align: "left",
            field: "studijski_program",
            sortable: true,
        },
        {
            name: "funkcije",
            label: "Funkcije",
            align: "center",
        }
    ]);

    const { idStudProg } = useParams()

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredKolegiji = kolegiji.filter(kolegij =>
        kolegij.naziv_kolegija.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

            dohvatiKolegija(idStudProg);
        }

        fetchInitialData();
    }, []);

    const dohvatiKolegija = async (idStudProg) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/kolegiji_studijskiProgrami/${idStudProg}`);
            setKolegiji(response.data);
            setStudijskiProgram(response.data[0].naziv_studijskog_programa);
        } catch (error) {
            console.log("Greška prilikom dohvata korisnika:", error);
        } 
    }
    
        return (
            <div className="dvorane_svi">
                <h1>
                    Popis kolegija za studij "{studijskiProgram}"
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
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredKolegiji.map((kolegij, index) => (
                        <tr key={index}>
                            <td>{kolegij.naziv_kolegija }</td>
                            <td>{kolegij.naziv_studijskog_programa}</td>
                            
                            <td>
                            <button className="gumb_vidi" onClick={() => vidi_stisnuto(kolegij.id_kolegija)}>Vidi</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        )
    }

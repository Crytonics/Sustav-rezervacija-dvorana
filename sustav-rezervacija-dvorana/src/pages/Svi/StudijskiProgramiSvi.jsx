import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function StudijskiProgramiSvi() {

    const [searchTerm, setSearchTerm] = useState('');

    const [studenskiProgrami, setStudenskiProgrami] = useState([]);

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
            name: "funkcije",
            label: "Funkcije",
            align: "center",
        }
    ]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredStudenskiProgrami = studenskiProgrami.filter(studprog =>
        studprog.naziv.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredStupci = stupci.filter(stupc =>
        stupc.name.toLowerCase()
    );

    const navigate = useNavigate();

    const vidi_stisnuto = (idStudProg) => {
        navigate(`/pojediniKolegijiPoStudijimaSvi/${idStudProg}`);
    }

    useEffect(() => {
        async function fetchInitialData() {

            dohvatiStudijskePrograme();
        }

        fetchInitialData();
    }, []);

    const dohvatiStudijskePrograme = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/studijskiProgrami");
            setStudenskiProgrami(response.data);
        } catch (error) {
            console.log("Greška prilikom dohvata studijskih programa:", error);
        }
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
                    <tr className='tr_naziv'>
                        {filteredStupci.length > 0 && 
                        filteredStupci.map(stupc => (
                            <th key={stupc.label}>{stupc.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredStudenskiProgrami.map((studprog, index) => (
                        <tr key={index}>
                            <td>{studprog.naziv}</td>
                            
                            <td>
                                <button className="gumb_vidi" onClick={() => vidi_stisnuto(studprog.id_studijskogPrograma)}>Vidi</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
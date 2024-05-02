import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';

export default  function StudijskiProgramiAdministrator() {

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
        stupc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navigate = useNavigate();

    const dodaj_stisnuto = () => {
        navigate("/unosStudijskihProgramaAdministrator");
    }

    const vidi_stisnuto = (idStudProg) => {
        navigate(`/pojediniKolegijiPoStudijimaSvi/${idStudProg}`);
    }
    
    const uredi_stisnuto = async (idStudProg) => {
        navigate(`/azuriranjeStudijskihProgramaAdministrator/${idStudProg}`);
    }

    useEffect(() => {
        async function fetchInitialData() {
            // Get the JWT token from local storage
            const token = localStorage.getItem("token");
        
            // Set up the request headers to include the JWT token
            const headers = { Authorization: `Bearer ${token}` };

            dohvatiStudijskePrograme(headers);
        }

        fetchInitialData();
    }, []);

    const dohvatiStudijskePrograme = async (headers) => {
        try {
            const response = await axios.get("http://localhost:3000/api/studijskiProgrami", {headers});
            setStudenskiProgrami(response.data);
        } catch (error) {
            console.log("Greška prilikom dohvata studijskih programa:", error);
        }
    }

    const obrisiStudijskiProgram = async (idStudProg) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        if(window.confirm('Jeste li sigurni da želite obrisati studijski program?')) {
            const response = await axios.put("http://localhost:3000/api/onemoguciStudijskiProgram/" + idStudProg, null, {headers}); //null zbog PUT 'payloada'
            const response2 = await axios.get("http://localhost:3000/api/studijskiProgrami", {headers});
            setStudenskiProgrami(response2.data);
            window.alert('Studijski program je uspješno izbrisan.')
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
                <button className="gumb_dodaj" onClick={dodaj_stisnuto}>Dodaj studij</button>
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
                    {filteredStudenskiProgrami.map((studprog, index) => (
                        <tr key={index}>
                            <td>{studprog.naziv}</td>
                            
                            <td>
                                <button className="gumb_vidi" onClick={() => vidi_stisnuto(studprog.id_studijskogPrograma)}>Vidi</button>
                                <button className="gumb_uredi" onClick={() => uredi_stisnuto(studprog.id_studijskogPrograma)}>Uredi</button>
                                <button className="gumb_obriši" onClick={() => obrisiStudijskiProgram(studprog.id_studijskogPrograma)}>Izbriši</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

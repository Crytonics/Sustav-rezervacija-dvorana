import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

export default function AzuriranjeDvorane() {

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const [dvorane, setDvorane] = useState([]);
    const [naziv, setNaziv] = useState([]);

    const natrak_stisnuto = () => {
        navigate("/dvoraneAdministrator");
    }

    const { id_dvorane } = useParams()

    const filteredDvorane = dvorane.filter(dvorane =>
        dvorane.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dvorane.svrha.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNazivChange = (event) => {
        setNaziv(event.target.value);
    };

    useEffect(() => {
        async function fetchInitialData() {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` }; 

            try {
                const response = await axios.get(`http://localhost:3000/api/pojed_dvorane/${id_dvorane}`, { headers });
                setDvorane(response.data);
                if (response.data.length > 0) {
                    setNaziv(response.data[0].naziv);
                }
            } catch (error) {
                console.log("Greška prilikom dohvata podataka:", error);
            }
            console.log(id_dvorane);
        }

        fetchInitialData();
    }, []);

    const spremi_podatke = (event) => {
        event.preventDefault();
        const naziv = event.target.naziv.value;
        const svrha = event.target.svrha.value;

        const userData = { naziv, svrha };

        posalji_podatke(userData);
    }

    const posalji_podatke = async (userData) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.put(`http://localhost:3000/api/azuriranjeDvorane/${id_dvorane}`, userData, {headers});
        } catch (error) {
            console.log("Greška prilikom ažuriranja dvorane:", error);
        }
        window.alert("Dvorana uspješno ažurirana.")
        navigate("/dvoraneAdministrator");
    }

    const uloga = filteredDvorane.length > 0 ? filteredDvorane[0].svrha : '';

    return (
        <div className="unos-korisnika-container">
        <form className="login-form" onSubmit={spremi_podatke}>
            <div className="form-group">
                <label htmlFor="naziv">Naziv dvorane: </label>
                <input type="text" id="naziv" name="naziv" value={naziv} onChange={handleNazivChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="svrha">Uloga: </label>
                <select id="svrha" name="svrha" required>
                    {uloga === "predavanje" ? (
                        <>
                        <option value="predavanje">Predavanje</option>
                        <option value="ispit">Ispit</option>
                        
                        </>
                    ) : (
                        <>
                        <option value="ispit">Ispit</option>
                        <option value="predavanje">Predavanje</option>
                        </>
                    )}
                    
                </select>
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}

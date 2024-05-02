import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

export default function AzuriranjeDvorane() {

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const [dvorane, setDvorane] = useState([]);

    const natrak_stisnuto = () => {
        navigate("/dvoraneAdministrator");
    }

    const { idDvorane } = useParams()

    const filteredDvorane = dvorane.filter(dvorane =>
        dvorane.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dvorane.opis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dvorane.svrha.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dvorane.aktivan.toLowerCase().includes(searchTerm.toLowerCase())
    );


    useEffect(() => {
        async function fetchInitialData() {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` }; 

            try {
                const response = await axios.get(`http://localhost:3000/api/dvorane/${idDvorane}`, { headers });
                setDvorane(response.data);
            } catch (error) {
                console.log("Greška prilikom dohvata podataka:", error);
            } 
        }

        fetchInitialData();
    }, []);

    const spremi_podatke = (event) => {
        event.preventDefault();
        const naziv = event.target.naziv.value;
        const opis = event.target.opis.value;
        const svrha = event.target.svrha.value;
        const aktivan = event.target.aktivan.checked;

        const userData = { naziv, opis, svrha, aktivan };

        posalji_podatke(userData);
    }

    const posalji_podatke = async (userData) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.put(`http://localhost:3000/api/dvorane/${idDvorane}`, userData, {headers});
        } catch (error) {
            console.log("Greška prilikom ažuriranja dvorane:", error);
        }
        window.alert("Dvorana uspješno ažurirana.")
        navigate("/dvoraneAdministrator");
    }

    return (
        <div className="unos-dvorane-container">
        <form className="login-form" onSubmit={spremi_podatke}>
            <div className="form-group">
                <label htmlFor="naziv">Naziv dvorane: </label>
                <input type="text" id="naziv" name="naziv" placeholder={dvorane.naziv || 'Unesite naziv'} required />
            </div>
            <div className="form-group">
                <label htmlFor="opis">Opis: </label>
                <input type="text" id="opis" name="opis" placeholder={dvorane.opis || 'Unesite opis'} required />
            </div>
            <div className="form-group">
                <label htmlFor="svrha">Svrha: </label>
                <input type="text" id="svrha" name="svrha" placeholder={dvorane.svrha || 'Unesite svrhu'} required />
            </div>
            <div className="form-group">
                <label htmlFor="aktivan">Aktivan: </label>
                <input type="checkbox" id="aktivan" name="aktivan" defaultChecked={dvorane.aktivan} />
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}

import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function UnosStudijskihProgramaAdministrator() {

    const navigate = useNavigate();

    const natrak_stisnuto = () => {
        navigate("/kolegijiAdministrator");
    }

    const spremi_podatke = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const naziv_studija = event.target.naziv.value;

        const userData = { naziv_studija };

        posalji_podatke(userData);
    }

    const posalji_podatke = async (userData) => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.post("http://localhost:3000/api/unosStudijskogPrograma", userData, {headers});
        } catch (error) {
            console.log("Greška prilikom dohvata korisnika:", error);
        }
        window.alert('Korisnik uspješno dodan.')
        navigate("/studijskiProgramiAdministrator");
    }

    return (
        <div className="unos-korisnika-container">
        <form className="login-form" onSubmit={spremi_podatke}>
            <div className="form-group">
                <label htmlFor="naziv">Naziv studija: </label>
                <input type="text" id="naziv" name="naziv" required />
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}

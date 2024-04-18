import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function UnosKorisnikaAdministrator() {

    const navigate = useNavigate();

    const natrak_stisnuto = () => {
        navigate("/listaKorisnikaAdministrator");
    }

    return (
        <div className="unos-korisnika-container">
        <form className="login-form">
            <div className="form-group">
                <label htmlFor="ime">Ime: </label>
                <input type="text" id="ime" name="ime" required />
            </div>
            <div className="form-group">
                <label htmlFor="prezime">Prezime: </label>
                <input type="text" id="prezime" name="prezime" required />
            </div>
            <div className="form-group">
                <label htmlFor="korisnicko_ime">Korisničko ime: </label>
                <input type="text" id="korisnicko_ime" name="korisnicko_ime" required />
            </div>
            <div className="form-group">
                <label htmlFor="password">Lozinka: </label>
                <input type="password" id="password" name="password" required />
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}

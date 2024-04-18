import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function UnosDvoranaAdministrator() {

    const navigate = useNavigate();

    const natrak_stisnuto = () => {
        navigate("/dvoraneAdministrator");
    }

    return (
        <div className="unos-korisnika-container">
        <form className="login-form">
            <div className="form-group">
                <label htmlFor="naziv">Naziv dvorane: </label>
                <input type="text" id="naziv" name="naziv" required />
            </div>
            <div className="form-group">
                <label htmlFor="opis">Opis dvorane: </label>
                <input type="text" id="opis" name="opis" required />
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}

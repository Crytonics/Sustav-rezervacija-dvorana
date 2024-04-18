import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AzuriranjeStudijskihProgramaAdministrator() {

    const navigate = useNavigate();

    const natrak_stisnuto = () => {
        navigate("/studijskiProgramiAdministrator");
    }

    return (
        <div className="unos-korisnika-container">
        <form className="login-form">
            <div className="form-group">
                <label htmlFor="naziv">Naziv studija: </label>
                <input type="text" id="naziv" name="naziv" placeholder="Informatika" required />
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}

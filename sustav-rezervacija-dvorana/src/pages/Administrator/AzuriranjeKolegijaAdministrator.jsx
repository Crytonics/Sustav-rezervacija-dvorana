import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default  function AzuriranjeKolegijaAdministrator() {

    const navigate = useNavigate();

    const natrak_stisnuto = () => {
        navigate("/kolegijiAdministrator");
    }

    return (
        <div className="unos-korisnika-container">
        <form className="login-form">
            <div className="form-group">
                <label htmlFor="naziv">Naziv kolegija: </label>
                <input type="text" id="naziv" name="naziv" placeholder="Programiranje" required />
            </div>
            <div className="form-group">
                <label htmlFor="Nastavnik">Nastavnik: </label>
                <select id="Nastavnik" name="Nastavnik" required>
                    <option value="">Odaberite nastavnika</option>
                    <option value="nastavnik1" selected>Primjer Izvođača</option>
                    <option value="nastavnik2">Primjer Izvođača 2</option>
                    <option value="nastavnik3">Primjer Izvođača 3</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="Nastavnik">Studijski program: </label>
                <select id="Studij" name="Studij" required>
                    <option value="">Odaberite studijski program</option>
                    <option value="Studij1" selected>Informatika</option>
                    <option value="Studij2">Telematika</option>
                    <option value="Studij3">Promet</option>
                </select>
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}

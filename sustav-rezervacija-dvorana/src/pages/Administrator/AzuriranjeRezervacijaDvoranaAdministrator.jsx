import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AzuriranjeRezervacijaDvoranaAdministrator() {

    const navigate = useNavigate();

    const natrak_stisnuto = () => {
        navigate("/pregledRezervacijaDvoranaAdministrator");
    }

    function generateTimeOptions() {
        const options = [];
        for (let hour = 8; hour <= 22; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                options.push(<option key={time} value={time}>{time}</option>);
            }
        }
        return options;
    }

    return (
        <div className="unos-korisnika-container">
        <form className="login-form">
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
                <label htmlFor="Nastavnik">Kolegij: </label>
                <select id="Kolegij" name="Kolegij" required>
                    <option value="">Odaberite kolegij</option>
                    <option value="Kolegij1" selected>Informatika</option>
                    <option value="Kolegij2">Telematika</option>
                    <option value="Kolegij3">Promet</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="Dvorana">Dvorana: </label>
                <select id="Dvorana" name="Dvorana" required>
                    <option value="">Odaberite kolegij</option>
                    <option value="Dvorana1" selected>Dvorana 1</option>
                    <option value="Dvorana2">Dvorana 2</option>
                    <option value="Dvorana3">Dvorana 3</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="Razlog">Razlog: </label>
                <select id="Razlog" name="Razlog" required>
                    <option value="">Odaberite kolegij</option>
                    <option value="Razlog1" selected>Predavanja</option>
                    <option value="Razlog2">Ispit</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="Datum">Datum: </label>
                <input type="date" id="Datum" name="Datum" required />
            </div>
            <div className="form-group">
                <label htmlFor="Pocetak">Početak: </label>
                <select id="Pocetak" name="Pocetak" required>
                    <option value="">Odaberite početak</option>
                    {generateTimeOptions()}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="Kraj">Kraj: </label>
                <select id="Kraj" name="Kraj" required>
                    <option value="">Odaberite kraj</option>
                    {generateTimeOptions()}
                </select>
            </div>
            <div className="form-group toggle-group">
                <label htmlFor="toggleInput" style={{marginLeft: '10px'}}>Ponavljanje</label>
                <label className="switch">
                    <input type="checkbox" id="toggleInput" name="toggleInput" />
                    <span className="slider round"></span>
                </label>
            </div>
            <button type="button" onClick={natrak_stisnuto}>Natrag</button>
            <button type="submit">Spremi</button>
        </form>
    </div>
    )
}

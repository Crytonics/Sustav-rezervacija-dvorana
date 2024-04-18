import React, { useState } from 'react';
import { Link, NavLink, Outlet } from "react-router-dom";

export default function MainLayout() {
    // State to manage drawer visibility
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Function to toggle drawer
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <div className="main-layout">
            <header>
                <nav>
                    <div className={`top-bar ${isDrawerOpen ? 'shrink' : ''}`}>
                        <button onClick={toggleDrawer}>
                            {isDrawerOpen ? 'Close' : 'Menu'}
                        </button>
                        <NavLink to="Pocetna" className="Pocetna">Sustav rezervacija dvorana</NavLink>
                        <NavLink to="Prijava" className="gumb">Prijava</NavLink>
                    </div>
                    {/* Button to toggle drawer */}
                    {/* Conditionally render the drawer based on isDrawerOpen state */}
                    <div className={`layout-drawer ${isDrawerOpen ? 'open' : ''}`}>
                        {/* Svi */}
                        <li><NavLink to="dvoraneSvi" className="link">Sve Dvorane</NavLink></li>
                        <li><NavLink to="kolegijiSvi" className="link">Svi Kolegiji</NavLink></li>
                        <li><NavLink to="studijskiProgramiSvi" className="link">Studijski Programi</NavLink></li>
                        <br />
                        {/* Nastavnici */}
                        <li><NavLink to="zatraziRezervacijuNastavnici" className="link">Zahtjev za Rezervaciju</NavLink></li>
                        <li><NavLink to="pregledSvojihRezervacijaNastavnici" className="link">Pregled Rezervacija</NavLink></li>
                        <li><NavLink to="pregledSvojihKolegijaNastavnici" className="link">Pregled Kolegija</NavLink></li>
                        <br />
                        {/* Administrator */}
                        <li><NavLink to="listaKorisnikaAdministrator" className="link">Lista Korisnika</NavLink></li>
                        <li><NavLink to="pregledRezervacijaDvoranaAdministrator" className="link">Pregled Rezervacija Dvorana</NavLink></li>
                        <li><NavLink to="dvoraneAdministrator" className="link">Dvorane</NavLink></li>
                        <li><NavLink to="kolegijiAdministrator" className="link">Kolegiji</NavLink></li>
                        <li><NavLink to="studijskiProgramiAdministrator" className="link">Studijski Programi</NavLink></li>
                        <li><NavLink to="odobravanjeTerminaDvoranaAdministrator" className="link">Odobravanje Termina Dvorana</NavLink></li>
                        </div>
                </nav>
            </header>
            
            <main>
                <Outlet />
            </main>
        </div>
    )
}

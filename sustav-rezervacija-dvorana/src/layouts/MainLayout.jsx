import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function MainLayout() {
    // State to manage drawer visibility
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Function to toggle drawer
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const potvrdiOdjavu = () => {
      // Clear JWT token from local storage
      localStorage.removeItem("token");
      // Reload the page
      window.location.reload();
    }

    const isAdmin = () => {
        const token = localStorage.getItem("token");
        if (isAuthenticated() && token) {
            const decodeToken = (token) => {
                try {
                    const decoded = jwtDecode(token);
                    return decoded.uloga;
                } catch (error) {
                    console.error("Error decoding token:", error);
                    return null;
                }
            };
    
            return decodeToken(token) === "admin";
        }
        return false;
    };

    const isNastavnik = () => {
        const token = localStorage.getItem("token");
        if (isAuthenticated() && token) {
            const decodeToken = (token) => {
                try {
                    const decoded = jwtDecode(token);
                    return decoded.uloga;
                } catch (error) {
                    console.error("Error decoding token:", error);
                    return null;
                }
            };
    
            return decodeToken(token) === "nastavnik";
        }
        return false;
    };

    const isAuthenticated = () => {
        const token = localStorage.getItem("token");
        return !!token;
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
                        {isAuthenticated() && <NavLink className='gumb' onClick={potvrdiOdjavu}>Odjava</NavLink>}
                        {!isAuthenticated() && <NavLink to="Prijava" className="gumb">Prijava</NavLink>}
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
                        {(isNastavnik() || isAdmin()) && <li><NavLink to="zatraziRezervacijuNastavnici" className="link">Zahtjev za Rezervaciju</NavLink></li>}
                        {(isNastavnik() || isAdmin()) && <li><NavLink to="pregledSvojihRezervacijaNastavnici" className="link">Pregled Rezervacija</NavLink></li>}
                        {(isNastavnik() || isAdmin()) && <li><NavLink to="pregledSvojihKolegijaNastavnici" className="link">Pregled Kolegija</NavLink></li>}
                        {(isNastavnik() || isAdmin()) && <br />}
                        {/* Administrator */}
                        {isAdmin() && <li><NavLink to="listaKorisnikaAdministrator" className="link">Lista Korisnika</NavLink></li>}
                        {isAdmin() && <li><NavLink to="pregledRezervacijaDvoranaAdministrator" className="link">Pregled Rezervacija Dvorana</NavLink></li>}
                        {isAdmin() && <li><NavLink to="dvoraneAdministrator" className="link">Dvorane</NavLink></li>}
                        {isAdmin() && <li><NavLink to="kolegijiAdministrator" className="link">Kolegiji</NavLink></li>}
                        {isAdmin() && <li><NavLink to="studijskiProgramiAdministrator" className="link">Studijski Programi</NavLink></li>}
                        {isAdmin() && <li><NavLink to="odobravanjeTerminaDvoranaAdministrator" className="link">Odobravanje Termina Dvorana</NavLink></li>}
                        </div>
                </nav>
            </header>
            
            <main>
                <Outlet />
            </main>
        </div>
    )
}

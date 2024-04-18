import React, { useState } from 'react';
import { Link, NavLink, Outlet } from "react-router-dom";

export default function prijava() {
    return (
        <div className="login-container">
            <form className="login-form">
                <div className="form-group">
                    <label htmlFor="korisnicko_ime">Korisničko ime: </label>
                    <input type="text" id="korisnicko_ime" name="korisnicko_ime" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Lozinka: </label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit">Prijava</button>
            </form>
        </div>
    )
}

import React, { useState } from 'react';
import { Link, NavLink, Outlet } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { key } from "../../recaptcha_key";

export default function prijava() {

    const [CaptchaIsDone, setCaptchaDone] = useState(false);
    const [showMessage, setShowMessage] = useState(false);


    function onChange(){
       console.log("Changed")
       setCaptchaDone(true);
       setShowMessage(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!CaptchaIsDone) {
            setShowMessage(true);
        } else {
            console.log("Otvaranje stranice")
        }
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="korisnicko_ime">Korisničko ime: </label>
                    <input type="text" id="korisnicko_ime" name="korisnicko_ime" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Lozinka: </label>
                    <input type="password" id="password" name="password" required />
                </div>
                <ReCAPTCHA sitekey={key} onChange={onChange}
                />
                {showMessage && <div>Please complete the ReCAPTCHA to proceed.</div>}
                <br></br>
                <button type="submit">Prijava</button>
            </form>
        </div>
    )
}
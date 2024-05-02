import React, { useState } from 'react';
import { Link, NavLink, Outlet } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { key } from "../../recaptcha_key";
import axios from 'axios';

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
            spremi_podatke(e);
        }
    }

    const spremi_podatke = (e) => {
        const korisnicko_ime = e.target.korisnicko_ime.value;
        const password = e.target.password.value;

        const userData = { korisnicko_ime, password };

        // Here you can handle the data, e.g., send it to a server
        console.log({userData});
        // Example: postDataToServer({ ime, prezime, korisnicko_ime, password });
        login(userData);
    }

    const login = async (userData) => {
        try {
            const response = await axios.post("http://localhost:3000/api/login", userData);
            if (response.data.success) {
                // Save the JWT token to local storage
                localStorage.setItem("token", response.data.token);
      
                // Redirect to the desired page
                window.location.href = "/Pocetna";
              } else {
                // Show error message if login fails
                alert(response.data.message);
              }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Prijava nije uspjela. Provjerite podatke i pokušajte ponovno.");
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
import { Link } from "react-router-dom";

function pocetna() {
    return (
        <>
        <h1>Pocetna</h1>
        <li><Link to="/prijava">Go to Prijava</Link></li>
        <li><Link to="/pojedineDvoraneSvi">Go to PojedineDvoraneSvi</Link></li>
        <li><Link to="/pojediniKolegijiSvi">Go to PojediniKolegijiSvi</Link></li>
        <li><Link to="/pojediniKolegijiPoStudijimaSvi">Go to PojediniKolegijiPoStudijimaSvi</Link></li>
        <li><Link to="/dvoraneSvi">Go to DvoraneSvi</Link></li>
        <li><Link to="/kolegijiSvi">Go to KolegijiSvi</Link></li>
        <li><Link to="/studijskiProgramiSvi">Go to StudijskiProgramiSvi</Link></li>
        <li></li>
        <li><Link to="/zatraziRezervacijuNastavnici">Go to ZatraziRezervacijuNastavnici</Link></li>
        <li><Link to="/pregledSvojihRezervacijaNastavnici">Go to PregledSvojihRezervacijaNastavnici</Link></li>
        <li><Link to="/pregledSvojihKolegijaNastavnici">Go to PregledSvojihKolegijaNastavnici</Link></li>
        <li></li>
        <li><Link to="/listaKorisnikaAdministrator">Go to ListaKorisnikaAdministrator</Link></li>
        <li><Link to="/unosKorisnikaAdministrator">Go to UnosKorisnikaAdministrator</Link></li>
        <li><Link to="/azuriranjeKorisnikaAdministrator">Go to AzuriranjeKorisnikaAdministrator</Link></li>
        <li><Link to="/pregledRezervacijaDvoranaAdministrator">Go to PregledRezervacijaDvoranaAdministrator</Link></li>
        <li><Link to="/unosRezervacijaDvoranaAdministrator">Go to UnosRezervacijaDvoranaAdministrator</Link></li>
        <li><Link to="/azuriranjeRezervacijaDvoranaAdministrator">Go to AzuriranjeRezervacijaDvoranaAdministrator</Link></li>
        <li><Link to="/dvoraneAdministrator">Go to DvoraneAdministrator</Link></li>
        <li><Link to="/kolegijiAdministrator">Go to KolegijiAdministrator</Link></li>
        <li><Link to="/unosKolegijaAdministrator">Go to UnosKolegijaAdministrator</Link></li>
        <li><Link to="/azuriranjeKolegijaAdministrator">Go to AzuriranjeKolegijaAdministrator</Link></li>
        <li><Link to="/studijskiProgramiAdministrator">Go to StudijskiProgramiAdministrator</Link></li>
        <li><Link to="/unosStudijskihProgramaAdministrator">Go to UnosStudijskihProgramaAdministrator</Link></li>
        <li><Link to="/azuriranjeStudijskihProgramaAdministrator">Go to AzuriranjeStudijskihProgramaAdministrator</Link></li>
        <li><Link to="/unosDvoranaAdministrator">Go to UnosDvoranaAdministrator</Link></li>
        <li><Link to="/azuriranjeDvoranaAdministrator">Go to AzuriranjeDvoranaAdministrator</Link></li>
        <li><Link to="/odobravanjeTerminaDvoranaAdministrator">Go to OdobravanjeTerminaDvoranaAdministrator</Link></li>
        </>
        
    )
}

export default pocetna;


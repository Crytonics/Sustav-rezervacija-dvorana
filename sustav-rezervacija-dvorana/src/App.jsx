import { BrowserRouter, Routes, Route } from "react-router-dom";

import Prijava from './pages/prijava';
import Pocetna from './pages/pocetna';
import PojedineDvoraneSvi from "./pages/Svi/PojedineDvoraneSvi";
import PojediniKolegijiSvi from "./pages/Svi/PojediniKolegijiSvi";
import PojediniKolegijiPoStudijimaSvi from "./pages/Svi/PojediniKolegijiPoStudijimaSvi";
import DvoraneSvi from "./pages/Svi/DvoraneSvi";
import KolegijiSvi from "./pages/Svi/KolegijiSvi";
import StudijskiProgramiSvi from "./pages/Svi/StudijskiProgramiSvi";

import ZatraziRezervacijuNastavnici from "./pages/Nastavnici/ZatraziRezervacijuNastavnici";
import PregledSvojihRezervacijaNastavnici from "./pages/Nastavnici/PregledSvojihRezervacijaNastavnici";
import PregledSvojihKolegijaNastavnici from "./pages/Nastavnici/PregledSvojihKolegijaNastavnici";

import ListaKorisnikaAdministrator from "./pages/Administrator/ListaKorisnikaAdministrator";
import UnosKorisnikaAdministrator from "./pages/Administrator/UnosKorisnikaAdministrator";
import AzuriranjeKorisnikaAdministrator from "./pages/Administrator/AzuriranjeKorisnikaAdministrator";
import PregledRezervacijaDvoranaAdministrator from "./pages/Administrator/PregledRezervacijaDvoranaAdministrator";
import UnosRezervacijaDvoranaAdministrator from "./pages/Administrator/UnosRezervacijaDvoranaAdministrator";
import AzuriranjeRezervacijaDvoranaAdministrator from "./pages/Administrator/AzuriranjeRezervacijaDvoranaAdministrator";
import DvoraneAdministrator from "./pages/Administrator/DvoraneAdministrator";
import KolegijiAdministrator from "./pages/Administrator/KolegijiAdministrator";
import UnosKolegijaAdministrator from "./pages/Administrator/UnosKolegijaAdministrator";
import AzuriranjeKolegijaAdministrator from "./pages/Administrator/AzuriranjeKolegijaAdministrator";
import StudijskiProgramiAdministrator from "./pages/Administrator/StudijskiProgramiAdministrator";
import UnosStudijskihProgramaAdministrator from "./pages/Administrator/UnosStudijskihProgramaAdministrator";
import AzuriranjeStudijskihProgramaAdministrator from "./pages/Administrator/AzuriranjeStudijskihProgramaAdministrator";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pocetna />} />
        <Route path="prijava" element={<Prijava />} />
        <Route path="pojedineDvoraneSvi" element={<PojedineDvoraneSvi />} />
        <Route path="pojediniKolegijiSvi" element={<PojediniKolegijiSvi />} />
        <Route path="pojediniKolegijiPoStudijimaSvi" element={<PojediniKolegijiPoStudijimaSvi />} />
        <Route path="dvoraneSvi" element={<DvoraneSvi />} />
        <Route path="kolegijiSvi" element={<KolegijiSvi />} />
        <Route path="studijskiProgramiSvi" element={<StudijskiProgramiSvi />} />

        <Route path="zatraziRezervacijuNastavnici" element={<ZatraziRezervacijuNastavnici />} />
        <Route path="pregledSvojihRezervacijaNastavnici" element={<PregledSvojihRezervacijaNastavnici />} />
        <Route path="pregledSvojihKolegijaNastavnici" element={<PregledSvojihKolegijaNastavnici />} />

        <Route path="listaKorisnikaAdministrator" element={<ListaKorisnikaAdministrator />} />
        <Route path="unosKorisnikaAdministrator" element={<UnosKorisnikaAdministrator />} />
        <Route path="azuriranjeKorisnikaAdministrator" element={<AzuriranjeKorisnikaAdministrator />} />
        <Route path="pregledRezervacijaDvoranaAdministrator" element={<PregledRezervacijaDvoranaAdministrator />} />
        <Route path="unosRezervacijaDvoranaAdministrator" element={<UnosRezervacijaDvoranaAdministrator />} />
        <Route path="azuriranjeRezervacijaDvoranaAdministrator" element={<AzuriranjeRezervacijaDvoranaAdministrator />} />
        <Route path="dvoraneAdministrator" element={<DvoraneAdministrator />} />
        <Route path="kolegijiAdministrator" element={<KolegijiAdministrator />} />
        <Route path="unosKolegijaAdministrator" element={<UnosKolegijaAdministrator />} />
        <Route path="azuriranjeKolegijaAdministrator" element={<AzuriranjeKolegijaAdministrator />} />
        <Route path="studijskiProgramiAdministrator" element={<StudijskiProgramiAdministrator />} />
        <Route path="unosStudijskihProgramaAdministrator" element={<UnosStudijskihProgramaAdministrator />} />
        <Route path="azuriranjeStudijskihProgramaAdministrator" element={<AzuriranjeStudijskihProgramaAdministrator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
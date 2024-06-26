import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import NotFoundPage from './pages/NotFoundPage';
import OdbijenPristup from "./pages/odbijenPristup.jsx";

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
import AzuriranjeSvojihRezervacija from "./pages/Nastavnici/AzuriranjeSvojihRezervacija.jsx"

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
import OdobravanjeTerminaDvoranaAdministrator from "./pages/Administrator/OdobravanjeTerminaDvoranaAdministrator.jsx";
import UnosDvoranaAdministrator from "./pages/Administrator/UnosDvoranaAdministrator.jsx"
import AzuriranjeDvoranaAdministrator from "./pages/Administrator/AzuriranjeDvoranaAdministrator.jsx"

function App() {
  
  const realCurrentDate = new Date(); // This remains constant, representing the real-world current date
  const currentMonth2 = realCurrentDate.getMonth();
  const currentYear2 = realCurrentDate.getFullYear();
  const todayDate = realCurrentDate.toLocaleDateString('en-US', { day: 'numeric' });
  const joinedDate = `${currentYear2}-${(currentMonth2 + 1).toString().padStart(2, '0')}-${todayDate.toString().padStart(2, '0')}`;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to={`/pocetna/${joinedDate}`} replace />} />
          <Route path="pocetna/:datum" element={<Pocetna />} />
          <Route path="prijava" element={<Prijava />} />
          <Route path="/pojedineDvoraneSvi/:id_dvorane" element={<PojedineDvoraneSvi />} />
          <Route path="pojediniKolegijiSvi" element={<PojediniKolegijiSvi />} />
          <Route path="/PojediniKolegijiSvi/:id_entry" element={<PojediniKolegijiSvi />} />
          <Route path="pojediniKolegijiPoStudijimaSvi" element={<PojediniKolegijiPoStudijimaSvi />} />
          <Route path="/PojediniKolegijiPoStudijimaSvi/:idStudProg" element={<PojediniKolegijiPoStudijimaSvi />} />
          <Route path="dvoraneSvi" element={<DvoraneSvi />} />
          <Route path="kolegijiSvi" element={<KolegijiSvi />} />
          <Route path="studijskiProgramiSvi" element={<StudijskiProgramiSvi />} />

          <Route path="zatraziRezervacijuNastavnici" element={<ZatraziRezervacijuNastavnici />} />
          <Route path="pregledSvojihRezervacijaNastavnici" element={<PregledSvojihRezervacijaNastavnici />} />
          <Route path="pregledSvojihKolegijaNastavnici" element={<PregledSvojihKolegijaNastavnici />} />
          <Route path="/AzuriranjeSvojihRezervacija/:id_entry" element={<AzuriranjeSvojihRezervacija />} />

          <Route path="listaKorisnikaAdministrator" element={<ListaKorisnikaAdministrator />} />
          <Route path="unosKorisnikaAdministrator" element={<UnosKorisnikaAdministrator />} />
          <Route path="/AzuriranjeKorisnikaAdministrator/:idKorisnika" element={<AzuriranjeKorisnikaAdministrator />} />
          <Route path="pregledRezervacijaDvoranaAdministrator" element={<PregledRezervacijaDvoranaAdministrator />} />
          <Route path="unosRezervacijaDvoranaAdministrator" element={<UnosRezervacijaDvoranaAdministrator />} />
          <Route path="/AzuriranjeRezervacijaDvoranaAdministrator/:id_entry" element={<AzuriranjeRezervacijaDvoranaAdministrator />} />
          <Route path="dvoraneAdministrator" element={<DvoraneAdministrator />} />
          <Route path="kolegijiAdministrator" element={<KolegijiAdministrator />} />
          <Route path="unosKolegijaAdministrator" element={<UnosKolegijaAdministrator />} />
          <Route path="azuriranjeKolegijaAdministrator" element={<AzuriranjeKolegijaAdministrator />} />
          <Route path="/AzuriranjeKolegijaAdministrator/:idKolegija" element={<AzuriranjeKolegijaAdministrator />} />
          <Route path="studijskiProgramiAdministrator" element={<StudijskiProgramiAdministrator />} />
          <Route path="unosStudijskihProgramaAdministrator" element={<UnosStudijskihProgramaAdministrator />} />
          <Route path="/AzuriranjeStudijskihProgramaAdministrator/:idStudProg" element={<AzuriranjeStudijskihProgramaAdministrator />} />
          <Route path="odobravanjeTerminaDvoranaAdministrator" element={<OdobravanjeTerminaDvoranaAdministrator />} />
          <Route path="unosDvoranaAdministrator" element={<UnosDvoranaAdministrator />} />
          <Route path="/azuriranjeDvoranaAdministrator/:id_dvorane" element={<AzuriranjeDvoranaAdministrator />} />
          
          <Route path="odbijenPristup" element={<OdbijenPristup />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
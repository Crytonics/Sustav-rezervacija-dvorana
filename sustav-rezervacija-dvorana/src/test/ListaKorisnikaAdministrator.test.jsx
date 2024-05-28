import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import ListaKorisnikaAdministrator from '../pages/Administrator/ListaKorisnikaAdministrator';
import { act } from 'react-dom/test-utils';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ListaKorisnikaAdministrator', () => {
    const users = [
        { id_korisnik: 1, korisnicko_ime: 'user1', ime: 'Ime1', prezime: 'Prezime1', uloga: 'admin' },
        { id_korisnik: 2, korisnicko_ime: 'user2', ime: 'Ime2', prezime: 'Prezime2', uloga: 'user' },
      ];
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: users });

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
        if (key === 'token') {
            return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywia29yaXNuaWNrb19pbWUiOiJ0ZXN0MyIsInVsb2dhIjoiYWRtaW4iLCJpYXQiOjE3MTY4MTM5NTIsImV4cCI6MTcxNjkwMDM1Mn0.IAFj9MBHe_EX-ndTo0fRwPZiao3UfegJb1UnNMKrBdo';
        }
        return null;
    });

    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
});

  test('prikazuje komponentu', async () => {
    render(
      <BrowserRouter>

        <ListaKorisnikaAdministrator />
      </BrowserRouter>
    );

    expect(screen.getByText('Popis korisnika')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Pretraži')).toBeInTheDocument();
    expect(screen.getByText('Dodaj korisnika')).toBeInTheDocument();
  });

  test('dohvaća i prikazuje korisnike', async () => {
    await act(async () => {
        render(

        <BrowserRouter>
            <ListaKorisnikaAdministrator />
        </BrowserRouter>
        );
    });

    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('Ime1')).toBeInTheDocument();
      expect(screen.getByText('Prezime1')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
    });
  });

  test('navigira na stranicu za dodavanje korisnika nakon klika na gumb', async () => {
    await act(async () => {
        render(

        <BrowserRouter>
            <ListaKorisnikaAdministrator />
        </BrowserRouter>
        );
    });

    const addButtons = screen.getAllByText('Dodaj korisnika', { selector: 'button' });
        act(() => {
            fireEvent.click(addButtons[0]);
        });

    expect(mockNavigate).toHaveBeenCalledWith('/UnosKorisnikaAdministrator');
  });

  test('filtrira korisnike na temelju pojma za pretraživanje', async () => {
    await act(async () => {
        render(
        <BrowserRouter>
            <ListaKorisnikaAdministrator />
        </BrowserRouter>
        );
    });

    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Pretraži'), { target: { value: 'user1' } });

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.queryByText('user2')).not.toBeInTheDocument();
  });

  test('navigira na stranicu za uređivanje korisnika nakon klika na gumb', async () => {
    await act(async () => {

        render(

        <BrowserRouter>
            <ListaKorisnikaAdministrator />
        </BrowserRouter>
        );
    });

    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Uredi', { selector: 'button' });
        act(() => {
            fireEvent.click(editButtons[0]);
        });
    expect(mockNavigate).toHaveBeenCalledWith('/AzuriranjeKorisnikaAdministrator/1');
  });
});


import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import StudijskiProgramiAdministrator from '../pages/Administrator/StudijskiProgramiAdministrator';
import { act } from 'react-dom/test-utils';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('StudijskiProgramiAdministrator', () => {
  const studijskiProgrami = [
    { id_studijskogPrograma: 1, naziv: 'Program 1' },
    { id_studijskogPrograma: 2, naziv: 'Program 2' },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: studijskiProgrami });

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'token') {
        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywia29yaXNuaWNrb19pbWUiOiJ0ZXN0MyIsInVsb2dhIjoiYWRtaW4iLCJpYXQiOjE3MTY4MTM5NTIsImV4cCI6MTcxNjkwMDM1Mn0.IAFj9MBHe_EX-ndTo0fRwPZiao3UfegJb1UnNMKrBdo';
      }
      return null;
    });

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('prikazuje komponentu StudijskiProgramiAdministrator', async () => {
    await act(async () => {
      render(

        <BrowserRouter>
          <StudijskiProgramiAdministrator />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('Popis Studijskih programa')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Pretraži')).toBeInTheDocument();
    expect(screen.getByText('Dodaj studij')).toBeInTheDocument();
  });

  test('filtrira studijski programi na temelju pojma za pretraživanje', async () => {
    await act(async () => {
      render(

        <BrowserRouter>
          <StudijskiProgramiAdministrator />
        </BrowserRouter>
      );
    });

    const searchInput = screen.getByPlaceholderText('Pretraži');
    fireEvent.change(searchInput, { target: { value: 'Program 1' } });

    await waitFor(() => {
      expect(screen.getByText('Program 1')).toBeInTheDocument();
      expect(screen.queryByText('Program 2')).not.toBeInTheDocument();
    });
  });

  test('navigira na stranicu za dodavanje novog programu nakon klika na gumb', async () => {
    await act(async () => {
      render(

        <BrowserRouter>
          <StudijskiProgramiAdministrator />
        </BrowserRouter>
      );
    });

    const addButton = screen.getByText('Dodaj studij');
    fireEvent.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith('/unosStudijskihProgramaAdministrator');
  });

  test('navigira na stranicu za pregled programu nakon klika na gumb', async () => {
    await act(async () => {
      render(

        <BrowserRouter>
          <StudijskiProgramiAdministrator />
        </BrowserRouter>
      );
    });

    const viewButton = screen.getAllByText('Vidi', { selector: 'button' })[0];
    fireEvent.click(viewButton);

    expect(mockNavigate).toHaveBeenCalledWith('/pojediniKolegijiPoStudijimaSvi/1');
  });

  test('navigira na stranicu za uređivanje programu nakon klika na gumb', async () => {
    await act(async () => {
      render(

        <BrowserRouter>
          <StudijskiProgramiAdministrator />
        </BrowserRouter>
      );
    });

    const editButton = screen.getAllByText('Uredi', { selector: 'button' })[0];
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/azuriranjeStudijskihProgramaAdministrator/1');
  });

  test('brise program nakon klika na gumb', async () => {
    axios.put.mockResolvedValue({});
    axios.get.mockResolvedValueOnce({ data: studijskiProgrami }).mockResolvedValueOnce({ data: [] });


    await act(async () => {
      render(
        <BrowserRouter>
          <StudijskiProgramiAdministrator />
        </BrowserRouter>
      );
    });

    const deleteButton = screen.getAllByText('Izbriši', { selector: 'button' })[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Jeste li sigurni da želite obrisati studijski program?');
      expect(window.alert).toHaveBeenCalledWith('Studijski program je uspješno izbrisan.');
    });
  });
});
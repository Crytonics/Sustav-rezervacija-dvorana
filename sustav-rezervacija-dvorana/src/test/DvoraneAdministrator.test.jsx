import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import DvoraneAdministrator from '../pages/Administrator/DvoraneAdministrator';

jest.mock('axios');

describe('DvoraneAdministrator', () => {
    const mockDvorane = [
        { id_dvorane: 1, naziv: 'Dvorana 1', svrha: 'Svrha 1' },
        { id_dvorane: 2, naziv: 'Dvorana 2', svrha: 'Svrha 2' },
    ];

    beforeEach(() => {
        axios.get.mockImplementation((url) => {
            if (url.includes('pojed_kolegiji_sp_id')) {
                return Promise.resolve({ data: mockKolegiji });
            } else if (url.includes('dvorane')) {
                return Promise.resolve({ data: mockDvorane });
            } else {
                return Promise.resolve({ data: [] });
            }
        });

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

    test('prikazuje komponentu i dohvaća podatke', async () => {
        await act(async () => {
            render(
                <Router>
                    <DvoraneAdministrator />
                </Router>
            );
        });

        expect(screen.getByText('Popis dvorana')).toBeInTheDocument();
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
        expect(screen.getByText('Dvorana 1')).toBeInTheDocument();
        expect(screen.getByText('Dvorana 2')).toBeInTheDocument();
    });

    test('filtrira dvorane prema pojmu za pretraživanje', async () => {
        await act(async () => {
            render(
                <Router>
                    <DvoraneAdministrator />
                </Router>
            );
        });

        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

        act(() => {
            fireEvent.change(screen.getByPlaceholderText('Pretraži'), { target: { value: 'Dvorana 1' } });
        });

        expect(screen.getByText('Dvorana 1')).toBeInTheDocument();
        expect(screen.queryByText('Dvorana 2')).not.toBeInTheDocument();
    });

    test('navigira na stranicu za dodavanje dvorane nakon klika na gumb', async () => {
        let container;
        await act(async () => {
            container = render(
                <Router>
                    <DvoraneAdministrator />
                </Router>
            ).container;
        });

        act(() => {
            fireEvent.click(screen.getByText('Dodaj dvoranu'));
        });

        expect(window.location.pathname).toBe('/unosDvoranaAdministrator');
    });

    test('navigira na stranicu za pregled dvorane nakon klika na gumb', async () => {
        await act(async () => {
            render(

                <Router>
                    <DvoraneAdministrator />
                </Router>
            );
        });

        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));

        act(() => {
            fireEvent.click(screen.getAllByText('Vidi')[0]);
        });

        expect(window.location.pathname).toBe('/pojedineDvoraneSvi/1');
    });

    test('navigira na stranicu za uređivanje dvorane nakon klika na gumb', async () => {
        await act(async () => {
            render(

                <Router>
                    <DvoraneAdministrator />
                </Router>
            );
        });

        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(5));

        act(() => {
            fireEvent.click(screen.getAllByText('Uredi')[0]);
        });

        expect(window.location.pathname).toBe('/azuriranjeDvoranaAdministrator/1');
    });

    test('brise dvoranu nakon klika na gumb', async () => {
        axios.put.mockResolvedValue({});
        await act(async () => {

            render(
                <Router>
                    <DvoraneAdministrator />
                </Router>
            );
        });

        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(6));

        act(() => {
            fireEvent.click(screen.getAllByText('Izbriši')[0]);
        });

        await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(0));
        expect(axios.get).toHaveBeenCalledTimes(6); // Called again after deletion
    });
});
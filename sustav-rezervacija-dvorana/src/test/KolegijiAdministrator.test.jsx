import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import KolegijiAdministrator from '../pages/Administrator/KolegijiAdministrator';

jest.mock('axios');

describe('KolegijiAdministrator', () => {
    const mockKolegiji = [
        { id_kolegija: 1, naziv_kolegija: 'Kolegij 1', korisnicko_ime: 'User 1', naziv_studijskog_programa: 'Program 1' },
        { id_kolegija: 2, naziv_kolegija: 'Kolegij 2', korisnicko_ime: 'User 2', naziv_studijskog_programa: 'Program 2' }
    ];

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockKolegiji });
        axios.delete.mockResolvedValue({});

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

    test('renders the component', () => {
        render(
            <Router>
                <KolegijiAdministrator />
            </Router>
        );
        expect(screen.getByText('Popis kolegija')).toBeInTheDocument();
    });

    test('fetches and displays kolegiji', async () => {
        await act(async () => {
            render(
                <Router>
                    <KolegijiAdministrator />
                </Router>
            );
        });

        await waitFor(() => {
            expect(screen.getByText('Kolegij 1')).toBeInTheDocument();
            expect(screen.getByText('Kolegij 2')).toBeInTheDocument();
        });
    });

    test('search functionality works', async () => {
        await act(async () => {
            render(
                <Router>
                    <KolegijiAdministrator />
                </Router>
            );
        });

        await waitFor(() => {
            expect(screen.getByText('Kolegij 1')).toBeInTheDocument();
            expect(screen.getByText('Kolegij 2')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.change(screen.getByPlaceholderText('Pretraži'), { target: { value: 'Kolegij 1' } });
        });

        expect(screen.getByText('Kolegij 1')).toBeInTheDocument();
        expect(screen.queryByText('Kolegij 2')).not.toBeInTheDocument();
    });

    test('navigates to add kolegij page on button click', async () => {
        await act(async () => {
            render(
                <Router>
                    <KolegijiAdministrator />
                </Router>
            );
        });

        act(() => {
            fireEvent.click(screen.getByText('Dodaj kolegij'));
        });

        expect(window.location.pathname).toBe('/unosKolegijaAdministrator');
    });

    test('navigates to edit kolegij page on button click', async () => {
        await act(async () => {
            render(
                <Router>
                    <KolegijiAdministrator />
                </Router>
            );
        });

        await waitFor(() => {
            expect(screen.getByText('Kolegij 1')).toBeInTheDocument();
            expect(screen.getByText('Kolegij 2')).toBeInTheDocument();
        });

        const editButtons = screen.getAllByText('Uredi', { selector: 'button' });
        act(() => {
            fireEvent.click(editButtons[0]);
        });

        expect(window.location.pathname).toBe('/azuriranjeKolegijaAdministrator/1');
    });

    test('navigates to view kolegij page on button click', async () => {
        await act(async () => {
            render(
                <Router>
                    <KolegijiAdministrator />
                </Router>
            );
        });

        await waitFor(() => {
            expect(screen.getByText('Kolegij 1')).toBeInTheDocument();
            expect(screen.getByText('Kolegij 2')).toBeInTheDocument();
        });

        const viewButtons = screen.getAllByText('Vidi', { selector: 'button' });
        act(() => {
            fireEvent.click(viewButtons[0]); // Click the first "Vidi" button
        });

        expect(window.location.pathname).toBe('/pojediniKolegijiSvi/1');
    });
});
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import ZatraziRezervacijuNastavnici from '../pages/Nastavnici/ZatraziRezervacijuNastavnici';

jest.mock('axios');

describe('ZatraziRezervacijuNastavnici Component', () => {
    const mockKolegiji = [
        { naziv_kolegija: 'Kolegij 1', id_kolegija: 1, id_studijskogPrograma: 'Program 1' },
        { naziv_kolegija: 'Kolegij 2', id_kolegija: 2, id_studijskogPrograma: 'Program 2' },
    ];

    const mockDvorane = [
        { naziv: 'Dvorana 1', id_dvorane: 1 },
        { naziv: 'Dvorana 2', id_dvorane: 2 },
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

    test('renders component and fetches data', async () => {
        await act(async () => {
            render(
                <Router>
                    <ZatraziRezervacijuNastavnici />
                </Router>
            );
        });

        expect(screen.getByText('Kolegij:')).toBeInTheDocument();
        expect(screen.getByText('Dvorana:')).toBeInTheDocument();
        expect(screen.getByText('Svrha:')).toBeInTheDocument();
        expect(screen.getByText('Datum:')).toBeInTheDocument();
        expect(screen.getByText('Početak:')).toBeInTheDocument();
        expect(screen.getByText('Kraj:')).toBeInTheDocument();
        expect(screen.getByText('Ponavljanje do:')).toBeInTheDocument();
    });

    test('handles form submission', async () => {
        axios.post.mockResolvedValue({});

        await act(async () => {
            render(
                <Router>
                    <ZatraziRezervacijuNastavnici />
                </Router>
            );
        });

        fireEvent.change(screen.getByLabelText('Kolegij:'), { target: { value: '1,Program 1' } });
        fireEvent.change(screen.getByLabelText('Dvorana:'), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText('Svrha:'), { target: { value: 'predavanje' } });
        fireEvent.change(screen.getByLabelText('Datum:'), { target: { value: '2023-10-01' } });
        fireEvent.change(screen.getByLabelText('Početak:'), { target: { value: '10:00' } });
        fireEvent.change(screen.getByLabelText('Kraj:'), { target: { value: '12:00' } });
        fireEvent.change(screen.getByLabelText('Ponavljanje do:'), { target: { value: '2023-10-31' } });

        fireEvent.click(screen.getByText('Spremi'));

    });
});
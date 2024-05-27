import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PregledSvojihKolegijaNastavnici from '../pages/Nastavnici/PregledSvojihKolegijaNastavnici';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('PregledSvojihKolegijaNastavnici Component', () => {
    const mockKolegiji = [
        { naziv_kolegija: 'Kolegij 1', naziv_studijskog_programa: 'Program 1', id_kolegija: 1 },
        { naziv_kolegija: 'Kolegij 2', naziv_studijskog_programa: 'Program 2', id_kolegija: 2 },
    ];

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockKolegiji });
        // Mock the user ID directly in the component
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            if (key === 'token') {
                // Mock a valid JWT token with a payload containing the user ID
                return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywia29yaXNuaWNrb19pbWUiOiJ0ZXN0MyIsInVsb2dhIjoiYWRtaW4iLCJpYXQiOjE3MTY4MTM5NTIsImV4cCI6MTcxNjkwMDM1Mn0.IAFj9MBHe_EX-ndTo0fRwPZiao3UfegJb1UnNMKrBdo';
            }
            return null;
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders component and fetches data', async () => {
        await act(async () => {
            render(
                <Router>
                    <PregledSvojihKolegijaNastavnici />
                </Router>
            );
        });

        expect(screen.getByText('Popis kolegija')).toBeInTheDocument();
        expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/pojed_kolegiji?id_korisnika=7', { headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywia29yaXNuaWNrb19pbWUiOiJ0ZXN0MyIsInVsb2dhIjoiYWRtaW4iLCJpYXQiOjE3MTY4MTM5NTIsImV4cCI6MTcxNjkwMDM1Mn0.IAFj9MBHe_EX-ndTo0fRwPZiao3UfegJb1UnNMKrBdo' } });

        const kolegij1 = await screen.findByText('Kolegij 1');
        const kolegij2 = await screen.findByText('Kolegij 2');

        expect(kolegij1).toBeInTheDocument();
        expect(kolegij2).toBeInTheDocument();
    });

    test('filters kolegiji based on search term', async () => {
        await act(async () => {
            render(
                <Router>
                    <PregledSvojihKolegijaNastavnici />
                </Router>
            );
        });

        const searchInput = screen.getByPlaceholderText('Pretraži');
        fireEvent.change(searchInput, { target: { value: 'Kolegij 1' } });

        const kolegij1 = await screen.findByText('Kolegij 1');
        expect(kolegij1).toBeInTheDocument();

        const kolegij2 = screen.queryByText('Kolegij 2');
        expect(kolegij2).not.toBeInTheDocument();
    });
});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import KolegijiSvi from '../pages/Svi/KolegijiSvi';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('KolegijiSvi Component', () => {
    const mockKolegiji = [
        { naziv_kolegija: 'Kolegij 1', korisnicko_ime: 'Profesor 1', naziv_studijskog_programa: 'Program 1' },
        { naziv_kolegija: 'Kolegij 2', korisnicko_ime: 'Profesor 2', naziv_studijskog_programa: 'Program 2' },
    ];

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockKolegiji });
    });

    test('renders component and fetches data', async () => {
        render(
            <Router>
                <KolegijiSvi />
            </Router>
        );

        expect(screen.getByText('Popis kolegija')).toBeInTheDocument();
        expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/kolegiji');

        const kolegij1 = await screen.findByText('Kolegij 1');
        const kolegij2 = await screen.findByText('Kolegij 2');

        expect(kolegij1).toBeInTheDocument();
        expect(kolegij2).toBeInTheDocument();
    });

    test('filtrira kolegije prema pojmu za pretraživanje', async () => {
        render(
            <Router>
                <KolegijiSvi />
            </Router>
        );

        const searchInput = screen.getByPlaceholderText('Pretraži');
        fireEvent.change(searchInput, { target: { value: 'Kolegij 1' } });

        const kolegij1 = await screen.findByText('Kolegij 1');
        expect(kolegij1).toBeInTheDocument();

        const kolegij2 = screen.queryByText('Kolegij 2');
        expect(kolegij2).not.toBeInTheDocument();
    });
});
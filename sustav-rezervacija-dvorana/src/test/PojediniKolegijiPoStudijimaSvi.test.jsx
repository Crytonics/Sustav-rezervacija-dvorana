import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PojediniKolegijiPoStudijimaSvi from '../pages/Svi/PojediniKolegijiPoStudijimaSvi';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('PojediniKolegijiPoStudijimaSvi Component', () => {
    const mockKolegiji = [
        { naziv_kolegija: 'Kolegij 1', naziv_studijskog_programa: 'Program 1' },
        { naziv_kolegija: 'Kolegij 2', naziv_studijskog_programa: 'Program 2' },
    ];

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockKolegiji });
    });

    test('renders component and fetches data', async () => {
        await act(async () => {
            render(
                <Router>
                    <PojediniKolegijiPoStudijimaSvi />
                </Router>
            );
        });

        //expect(screen.getByText('Popis kolegija za studij')).toBeInTheDocument();
        expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/kolegiji_studijskiProgrami/undefined');

        const kolegij1 = await screen.findByText('Kolegij 1');
        const kolegij2 = await screen.findByText('Kolegij 2');

        expect(kolegij1).toBeInTheDocument();
        expect(kolegij2).toBeInTheDocument();
    });

    test('filters kolegiji based on search term', async () => {
        await act(async () => {
            render(
                <Router>
                    <PojediniKolegijiPoStudijimaSvi />
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
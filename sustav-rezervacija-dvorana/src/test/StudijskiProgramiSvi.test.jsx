import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudijskiProgramiSvi from '../pages/Svi/StudijskiProgramiSvi';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('StudijskiProgramiSvi Component', () => {
    const mockStudijskiProgrami = [
        { naziv: 'Program 1', id_studijskogPrograma: 1 },
        { naziv: 'Program 2', id_studijskogPrograma: 2 },
    ];

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockStudijskiProgrami });
    });

    test('prikazuje komponentu i dohvaća podatke', async () => {
        await act(async () => {
            render(

                <Router>
                    <StudijskiProgramiSvi />
                </Router>
            );
        });

        expect(screen.getByText('Popis Studijskih programa')).toBeInTheDocument();
        expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/studijskiProgrami');

        const program1 = await screen.findByText('Program 1');
        const program2 = await screen.findByText('Program 2');

        expect(program1).toBeInTheDocument();
        expect(program2).toBeInTheDocument();
    });

    test('filtrira studijski programi na temelju pojma za pretraživanje', async () => {
        await act(async () => {
            render(

                <Router>
                    <StudijskiProgramiSvi />
                </Router>
            );
        });

        const searchInput = screen.getByPlaceholderText('Pretraži');
        fireEvent.change(searchInput, { target: { value: 'Program 1' } });

        const program1 = await screen.findByText('Program 1');
        expect(program1).toBeInTheDocument();

        const program2 = screen.queryByText('Program 2');
        expect(program2).not.toBeInTheDocument();
    });
});
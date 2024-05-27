import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DvoraneSvi from '../pages/Svi/DvoraneSvi';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('DvoraneSvi Component', () => {
    const mockDvorane = [
        { naziv: 'Dvorana 1', svrha: 'Predavanje' },
        { naziv: 'Dvorana 2', svrha: 'Seminar' },
    ];

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockDvorane });
    });

    test('renders component and fetches data', async () => {
        render(
            <Router>
                <DvoraneSvi />
            </Router>
        );

        expect(screen.getByText('Popis dvorana')).toBeInTheDocument();
        expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/dvorane');

        const dvorana1 = await screen.findByText('Dvorana 1');
        const dvorana2 = await screen.findByText('Dvorana 2');

        expect(dvorana1).toBeInTheDocument();
        expect(dvorana2).toBeInTheDocument();
    });

    test('filters dvorane based on search term', async () => {
        render(
            <Router>
                <DvoraneSvi />
            </Router>
        );

        const searchInput = screen.getByPlaceholderText('Pretraži');
        fireEvent.change(searchInput, { target: { value: 'Dvorana 1' } });

        const dvorana1 = await screen.findByText('Dvorana 1');
        expect(dvorana1).toBeInTheDocument();

        const dvorana2 = screen.queryByText('Dvorana 2');
        expect(dvorana2).not.toBeInTheDocument();
    });
});
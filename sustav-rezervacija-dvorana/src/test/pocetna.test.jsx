import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Pocetna from '../pages/pocetna';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

describe('Pocetna Component', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('renders the correct date header', () => {
    fetch.mockResponseOnce(JSON.stringify({ data: 'Dnevni pregled' }));

    render(
      <Router>
        <Pocetna />
      </Router>
    );

    const dateHeader = screen.getByText(/Dnevni pregled/i);
    expect(dateHeader).toBeInTheDocument();
  });

  test('navigates to the next month', () => {
    fetch.mockResponseOnce(JSON.stringify({ data: 'Next month data' }));

    render(
      <Router>
        <Pocetna />
      </Router>
    );

    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);

    // Add your assertions here to check if the month has changed
  });

  test('navigates to the previous month', () => {
    fetch.mockResponseOnce(JSON.stringify({ data: 'Previous month data' }));

    render(
      <Router>
        <Pocetna />
      </Router>
    );

    const prevButton = screen.getByText(/Previous/i);
    fireEvent.click(prevButton);

    // Add your assertions here to check if the month has changed
  });
});
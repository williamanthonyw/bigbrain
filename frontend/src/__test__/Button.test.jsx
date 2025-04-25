import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from "vitest";
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import axios from 'axios';

import Login from '../Login';
import Register from '../Register';
import Dashboard from '../Dashboard/Dashboard';
import GameDetails from '../GameDetails';
import QuestionDetails from '../QuestionDetails';

vi.mock('axios');

const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({
      id: '1234567',
      gameId: '123',
      questionId: '456',
    }),
  };
});

describe('Login button', () => {
  let mockSetToken;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetToken = vi.fn();
  });

  it('renders the login button and handles click', () => {
    render(
      <BrowserRouter>
        <Login token={null} setfunction={mockSetToken} />
      </BrowserRouter>
    );

    const loginButton = screen.getByRole('button', { name: /log in/i });

    expect(loginButton).toBeInTheDocument();
    fireEvent.click(loginButton);
    expect(loginButton).toHaveTextContent(/log in/i);
  });

});

describe('Register button', () => {
  let mockSetToken;

  beforeEach(() => {
    mockSetToken = vi.fn();
    vi.clearAllMocks();
  });

  it('renders register button and handles click', async () => {
    axios.post.mockResolvedValueOnce({
      data: { token: 'mock-token-456' },
    });

    render(
      <BrowserRouter>
        <Register token={null} setfunction={mockSetToken} />
      </BrowserRouter>
    );

    const registerButton = screen.getByRole('button', { name: /register/i });

    expect(registerButton).toBeInTheDocument();

    fireEvent.click(registerButton);

    expect(registerButton).toHaveTextContent(/register/i);

});
});

describe('Dashboard logout button', () => {
  it('renders and can be clicked', () => {
    const mockLogout = vi.fn();

    render(
      <BrowserRouter>
        <Dashboard token="mock-token" logout={mockLogout} />
      </BrowserRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /logout/i });

    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

describe('GameDetails page buttons', () => {


  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Logout and Back buttons and allows clicking them', async () => {
    render(
      <MemoryRouter>
        <GameDetails token="mock-token" logout={mockLogout} />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    const backButton = screen.getByRole('button', { name: /← back/i });

    expect(logoutButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();

    fireEvent.click(logoutButton);
    fireEvent.click(backButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});

describe('QuestionDetails page buttons', () => {

  beforeEach(() => {
    vi.clearAllMocks();

    axios.get.mockResolvedValueOnce({
      data: {
        games: [
          {
            gameId: '123',
            questions: [
              {
                id: '456',
                title: 'Sample Question',
                type: 'single',
                answers: ['Answer 1', 'Answer 2'],
                correctAnswers: ['0'],
                duration: 10,
                points: 5,
                media: null
              },
            ],
          },
        ],
      },
    });
  });

  it('renders and clicks Save and Cancel buttons', async () => {
    render(
      <MemoryRouter>
        <QuestionDetails token="mock-token" logout={vi.fn()} />
      </MemoryRouter>
    );

    const saveBtn = await screen.findByRole('button', { name: /save/i });
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });

    expect(saveBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();

    fireEvent.click(saveBtn);
    fireEvent.click(cancelBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/game/123');
  });

  it('adds and deletes an answer field', async () => {
    render(
      <MemoryRouter>
        <QuestionDetails token="mock-token" logout={vi.fn()} />
      </MemoryRouter>
    );

    const inputs = await screen.findAllByPlaceholderText(/answer/i);
    expect(inputs).toHaveLength(2); 

    const addButton = screen.getByRole('button', { name: /\+ add answer/i });
    fireEvent.click(addButton);

    const updatedInputs = screen.getAllByPlaceholderText(/answer/i);
    expect(updatedInputs).toHaveLength(3);

    const deleteBtn = screen.getByTestId('delete-answer-2'); 
    fireEvent.click(deleteBtn);


    const inputsAfterDelete = screen.getAllByPlaceholderText(/answer/i);
    expect(inputsAfterDelete).toHaveLength(2);
  });

});

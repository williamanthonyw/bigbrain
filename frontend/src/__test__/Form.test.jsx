import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { ThemeProvider } from 'react-bootstrap';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import axios from 'axios';

import Login from '../Login';
import Register from '../Register';
import Play from '../Play';
import PlayJoin from '../PlayJoin';
import PlayGame from '../PlayGame';
import QuestionDetails from '../QuestionDetails';

vi.mock('axios');
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ gameId: '123', questionId: '456', sessionId: 'session123', playerId: 'player123' }),
  };
});

describe('Login Form', () => {
    it('renders and accepts user input', () => {
      render(
        <BrowserRouter>
          <ThemeProvider>
            <Login token={null} setfunction={vi.fn()} />
          </ThemeProvider>
        </BrowserRouter>
      );
  
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
 
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
  
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
  
      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('password123');
    });
});

describe('Register Form', () => {
  it('renders and accepts user input', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <Register token={null} setfunction={vi.fn()} />
        </ThemeProvider>
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/enter username/i);
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    const confirmPassword = screen.getByPlaceholderText(/enter password/i);

    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPassword).toBeInTheDocument();

    fireEvent.change(usernameInput, { target: { value: 'test' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPassword, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('test');
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPassword.value).toBe('password123');
  });
});

describe('Play - enter game pin', () => {
  it('renders and accepts user input', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <Play token={null} />
        </ThemeProvider>
      </BrowserRouter>
    );

    const pinInput = screen.getByPlaceholderText(/enter game pin/i);
    expect(pinInput).toBeInTheDocument();

    fireEvent.change(pinInput, {target: { value: '1234567'} });
    expect(pinInput.value).toBe('1234567');
    
  });
});

describe('Play - Join session - enter name', () => {
  it('renders and accepts user input', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <PlayJoin />
        </ThemeProvider>
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText(/your name/i);
    expect(nameInput).toBeInTheDocument();

    fireEvent.change(nameInput, {target: { value: 'jeff'} });
    expect(nameInput.value).toBe('jeff');
  });
});

describe('QuestionDetails answer input forms', () => {
  
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
              }
            ]
          }
        ]
      }
    });
  });

  it('renders all form fields and allows input interaction', async () => {
    render(
      <MemoryRouter>
        <QuestionDetails token="mock-token" />
      </MemoryRouter>
    );

    const titleInput = await screen.findByPlaceholderText('Question Title');
    expect(titleInput).toBeInTheDocument();
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    expect(titleInput.value).toBe('Updated Title');

    const questionType = screen.getByLabelText(/question type/i);
    expect(questionType).toBeInTheDocument();
    fireEvent.change(questionType, { target: { value: 'multiple' } });
    expect(questionType.value).toBe('multiple');

    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, { target: { value: 30 } });
    expect(durationInput.value).toBe('30');

    const pointsInput = screen.getByLabelText(/points/i);
    fireEvent.change(pointsInput, { target: { value: 20 } });
    expect(pointsInput.value).toBe('20');

    const answerInputs = screen.getAllByPlaceholderText(/answer/i);
    expect(answerInputs).toHaveLength(2);
    fireEvent.change(answerInputs[0], { target: { value: 'New Answer 1' } });
    expect(answerInputs[0].value).toBe('New Answer 1');
  });
});
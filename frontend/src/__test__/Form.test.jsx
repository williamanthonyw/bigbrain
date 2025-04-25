import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { ThemeProvider } from 'react-bootstrap';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

import Login from '../Login';
import Register from '../Register';
import Play from '../Play';
import PlayJoin from '../PlayJoin';
import PlayGame from '../PlayGame';
import QuestionDetails from '../QuestionDetails';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImplZmZAZ21haWwuY29tIiwiaWF0IjoxNzQ1NTcwOTM5fQ.uHStShQHtdFJ7-ae863oN2b2FVg922nsHUIQiK-LzeU';




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

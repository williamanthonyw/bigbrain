import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import * as RRD from 'react-router-dom';  

import QuestionDetails from '../QuestionDetails';
import GameDetails from '../GameDetails';

vi.mock('axios');
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ gameId: '123', questionId: '456' }),
    useNavigate: () => mockNavigate,
  };
});

vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}));


describe('Modal functionality in QuestionDetails', () => {
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
                duration: 20,
                points: 10,
                media: null,
              },
            ],
          },
        ],
      },
    });
  });

  it('opens and closes the media modal', async () => {
    render(
      <MemoryRouter>
        <QuestionDetails token="mock-token" />
      </MemoryRouter>
    );
  
    // Wait for question to be fetched
    const input = await screen.findByPlaceholderText('Question Title');
    expect(input).toHaveValue('Sample Question');
  
    // Use the test ID to click the media box
    const mediaBox = screen.getByTestId('media-box');
    fireEvent.click(mediaBox);
  
    // Modal should appear
    const modalTitle = await screen.findByText(/upload media/i);
    expect(modalTitle).toBeInTheDocument();
  
    // get the modal
    const modal = await screen.findByRole('dialog'); // `role="dialog"` is standard for Bootstrap modals

    // narrow to modal content
    const cancelButton = within(modal).getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton);

    // modal should close (you can assert by checking it's not in the DOM anymore)
    await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('renders correct input for YouTube selection', async () => {
    render(
      <MemoryRouter>
        <QuestionDetails token="mock-token" />
      </MemoryRouter>
    );

    // Wait for the media thumbnail to show up
    const mediaBox = await screen.findByTestId('media-box');
    fireEvent.click(mediaBox); // Opens the modal

    // Wait for the modal's select (combobox)
    const select = await screen.findByTestId('media-type-select');
    expect(select).toBeInTheDocument();
    fireEvent.change(select, { target: { value: 'youtube' } });

    // Wait for YouTube input to appear
    const input = await screen.findByPlaceholderText(/enter link to youtube video/i);
    expect(input).toBeInTheDocument();

    // Check the Upload button is disabled initially
    const uploadBtn = screen.getByRole('button', { name: /upload/i });
    expect(uploadBtn).toBeDisabled();
  });
});



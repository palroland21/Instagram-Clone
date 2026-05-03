import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';


// Mock the useNavigate hook from react-router-dom
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('LoginForm', () => {
    beforeEach(() => {
        localStorage.clear();
        mockNavigate.mockClear();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders username and password inputs', () => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
    });

    it('allows the user to type username and password', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        const usernameInput = screen.getByPlaceholderText(/username/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);

        await user.type(usernameInput, 'vasi');
        await user.type(passwordInput, 'parola123');

        expect(usernameInput).toHaveValue('vasi');
        expect(passwordInput).toHaveValue('parola123');
    });

    //verific submit-ul formularului
    it('submits login data and stores user information on successful login', async () => {
        const user = userEvent.setup();
        const setMessage = vi.fn();
        const setError = vi.fn();


        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                token: 'fake-token-123',
                userId: 7,
                username: 'vasi',
            }),
        });

        vi.stubGlobal('fetch', fetchMock); //backend fals

        render(
            <MemoryRouter>
                <LoginForm setMessage={setMessage} setError={setError} />
            </MemoryRouter>
        );

        await user.type(screen.getByPlaceholderText(/username/i), 'vasi');
        await user.type(screen.getByPlaceholderText(/password/i), 'parola123');

        await user.click(screen.getByRole('button', { name: /^login$/i }));

        expect(fetchMock).toHaveBeenCalledWith(
            'http://localhost:9090/auth/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'vasi',
                    password: 'parola123',
                }),
            }
        );

        expect(localStorage.getItem('token')).toBe('fake-token-123');
        expect(localStorage.getItem('userId')).toBe('7');
        expect(localStorage.getItem('username')).toBe('vasi');

        expect(setMessage).toHaveBeenCalledWith('Login successful!');
        expect(setError).toHaveBeenCalledWith('');
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
});
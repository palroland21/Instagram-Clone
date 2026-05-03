import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from '../../components/RegisterForm';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('RegisterForm', () => {
    beforeEach(() => {
        localStorage.clear();
        mockNavigate.mockClear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders all register form fields', () => {
        const setMessage = vi.fn();
        const setError = vi.fn();
        const goToLogin = vi.fn();

        render(
            <MemoryRouter>
                <RegisterForm setMessage={setMessage} setError={setError} goToLogin={goToLogin} />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/bio/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^register$/i })).toBeInTheDocument();
    });

    it('shows an error when passwords do not match', async () => {
        const user = userEvent.setup();
        const setMessage = vi.fn();
        const setError = vi.fn();
        const goToLogin = vi.fn();

        render(
            <MemoryRouter>
                <RegisterForm setMessage={setMessage} setError={setError} goToLogin={goToLogin} />
            </MemoryRouter>
        );

        await user.type(screen.getByPlaceholderText(/username/i), 'vasi');
        await user.type(screen.getByPlaceholderText(/email/i), 'vasi@test.com');
        await user.type(screen.getByPlaceholderText(/^password$/i), 'parola123');
        await user.type(screen.getByPlaceholderText(/confirm password/i), 'altaParola123');
        await user.type(screen.getByPlaceholderText(/full name/i), 'Vasi Test');
        await user.type(screen.getByPlaceholderText(/phone number/i), '0712345678');

        await user.click(screen.getByRole('button', { name: /^register$/i }));

        expect(setError).toHaveBeenCalledWith('Passwords do not match!');
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('shows an error when phone number is invalid', async () => {
        const user = userEvent.setup();
        const setMessage = vi.fn();
        const setError = vi.fn();
        const goToLogin = vi.fn();

        render(
            <MemoryRouter>
                <RegisterForm setMessage={setMessage} setError={setError} goToLogin={goToLogin} />
            </MemoryRouter>
        );

        await user.type(screen.getByPlaceholderText(/username/i), 'vasi');
        await user.type(screen.getByPlaceholderText(/email/i), 'vasi@test.com');
        await user.type(screen.getByPlaceholderText(/^password$/i), 'parola123');
        await user.type(screen.getByPlaceholderText(/confirm password/i), 'parola123');
        await user.type(screen.getByPlaceholderText(/full name/i), 'Vasi Test');
        await user.type(screen.getByPlaceholderText(/phone number/i), '123');

        const form = screen.getByRole('button', { name: /^register$/i }).closest('form');

        fireEvent.submit(form);//simuleaza submit event pe formular

        expect(setError).toHaveBeenCalledWith(
            'Phone number must contain only digits and must have between 10 and 15 digits.'
        );
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('submits register data and stores user information on successful registration', async () => {
        const user = userEvent.setup();
        const setMessage = vi.fn();
        const setError = vi.fn();
        const goToLogin = vi.fn();

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            text: async () =>
                JSON.stringify({
                    token: 'fake-register-token',
                    userId: 10,
                    username: 'vasi',
                    phoneNumber: '0712345678',
                }),
        });

        vi.stubGlobal('fetch', fetchMock);

        render(
            <MemoryRouter>
                <RegisterForm setMessage={setMessage} setError={setError} goToLogin={goToLogin} />
            </MemoryRouter>
        );

        await user.type(screen.getByPlaceholderText(/username/i), 'vasi');
        await user.type(screen.getByPlaceholderText(/email/i), 'vasi@test.com');
        await user.type(screen.getByPlaceholderText(/^password$/i), 'parola123');
        await user.type(screen.getByPlaceholderText(/confirm password/i), 'parola123');
        await user.type(screen.getByPlaceholderText(/full name/i), 'Vasi Test');
        await user.type(screen.getByPlaceholderText(/phone number/i), '0712345678');
        await user.type(screen.getByPlaceholderText(/bio/i), 'Test bio');

        await user.click(screen.getByRole('button', { name: /^register$/i }));

        expect(fetchMock).toHaveBeenCalledWith(
            'http://localhost:9090/auth/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'vasi',
                    email: 'vasi@test.com',
                    password: 'parola123',
                    fullName: 'Vasi Test',
                    phoneNumber: '0712345678',
                    bio: 'Test bio',
                    profilePicture: '',
                }),
            }
        );

        expect(localStorage.getItem('token')).toBe('fake-register-token');
        expect(localStorage.getItem('userId')).toBe('10');
        expect(localStorage.getItem('username')).toBe('vasi');
        expect(localStorage.getItem('phoneNumber')).toBe('0712345678');

        expect(setMessage).toHaveBeenCalledWith('Registration successful!');
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
});
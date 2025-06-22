import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../api/api';

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: jest.fn()
}));

jest.mock('../../api/api', () => ({
    loginUser: jest.fn()
}));

describe('LoginForm', () => {
    const mockLogin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useAuth.mockReturnValue({ login: mockLogin });
    });

    test('remplit les champs et envoie les données au submit', async () => {
        loginUser.mockResolvedValue('fake-token');

        render(<LoginForm />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith('admin@test.com', 'password123');
            expect(mockLogin).toHaveBeenCalledWith('fake-token');
        });
    });

    test('affiche un message d’erreur si les identifiants sont invalides', async () => {
        loginUser.mockRejectedValue(new Error('Invalid credentials'));

        render(<LoginForm />);

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'wrong@test.com' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'wrongpass' }
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/email or password is incorrect/i)).toBeInTheDocument();
        });

        expect(mockLogin).not.toHaveBeenCalled();
    });
});

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn()
}));

const TestComponent = () => {
    const { user, login, logout } = useAuth();

    return (
        <div>
            <p data-testid="user-email">{user?.email || 'no user'}</p>
            <button onClick={() => login('fake-token')}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
        jwtDecode.mockReset();
    });

    test('no user by default', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('user-email')).toHaveTextContent('no user');
    });

    test('login sets user and token', () => {
        jwtDecode.mockReturnValue({ data: [{ email: 'admin@test.com' }] });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        act(() => {
            screen.getByText('Login').click();
        });

        expect(localStorage.getItem('token')).toBe('fake-token');
        expect(screen.getByTestId('user-email')).toHaveTextContent('admin@test.com');
    });

    test('logout removes user and token', () => {
        jwtDecode.mockReturnValue({ data: [{ email: 'admin@test.com' }] });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        act(() => {
            screen.getByText('Login').click();
        });

        act(() => {
            screen.getByText('Logout').click();
        });

        expect(localStorage.getItem('token')).toBeNull();
        expect(screen.getByTestId('user-email')).toHaveTextContent('no user');
    });

    test('loads user from localStorage on init', () => {
        localStorage.setItem('token', 'persisted-token');
        jwtDecode.mockReturnValue({ data: [{ email: 'saved@test.com' }] });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('user-email')).toHaveTextContent('saved@test.com');
    });

    test('invalid token in localStorage is removed', () => {
        localStorage.setItem('token', 'invalid-token');
        jwtDecode.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(localStorage.getItem('token')).toBeNull();
        expect(screen.getByTestId('user-email')).toHaveTextContent('no user');

        spy.mockRestore();
    });
});

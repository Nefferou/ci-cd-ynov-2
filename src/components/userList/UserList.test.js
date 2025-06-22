import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserList from './UserList';
import { useAuth } from '../../contexts/AuthContext';
import '@testing-library/jest-dom';

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: jest.fn()
}));

const mockUseAuth = (userEmail = null) => {
    useAuth.mockReturnValue({
        user: userEmail ? { email: userEmail } : null,
        logout: jest.fn()
    });
};

const users = [
    {
        id: 1,
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        birthdate: '1990-01-01',
        city: 'Paris',
        postal_code: '75000'
    },
    {
        id: 2,
        name: 'Jane',
        surname: 'Smith',
        email: 'jane.smith@example.com',
        birthdate: '1992-02-02',
        city: 'Lyon',
        postal_code: '69000'
    }
];

describe('UserList', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('affiche la liste des utilisateurs sans bouton si non connecté', () => {
        mockUseAuth();

        render(<UserList users={users} onDelete={jest.fn()} />);

        expect(screen.getByText(/John Doe - john.doe@example.com/)).toBeInTheDocument();
        expect(screen.getByText(/Jane Smith - jane.smith@example.com/)).toBeInTheDocument();
        expect(screen.queryByText(/Supprimer/)).not.toBeInTheDocument();
    });

    test('affiche les boutons "Supprimer" si connecté', () => {
        mockUseAuth("admin@test.com");

        render(<UserList users={users} onDelete={jest.fn()} />);

        const deleteButtons = screen.getAllByText(/Supprimer/);
        expect(deleteButtons.length).toBe(2);
    });

    test('le clic sur un utilisateur ouvre la modale de détails', () => {
        mockUseAuth("admin@test.com");

        render(<UserList users={users} onDelete={jest.fn()} />);

        fireEvent.click(screen.getByText(/John Doe - john.doe@example.com/));

        expect(screen.getByText(/Détails de l'utilisateur/)).toBeInTheDocument();
        const emailOccurrences = screen.getAllByText(/john.doe@example.com/);
        expect(emailOccurrences.length).toBe(2);
    });

    test('le clic sur "Supprimer" appelle onDelete et n’ouvre pas la modale', () => {
        mockUseAuth("admin@test.com");
        const mockDelete = jest.fn();

        render(<UserList users={users} onDelete={mockDelete} />);

        const deleteButtons = screen.getAllByText(/Supprimer/);
        fireEvent.click(deleteButtons[0]);

        expect(mockDelete).toHaveBeenCalledWith(users[0]);
        expect(screen.queryByText(/Détails de l'utilisateur/)).not.toBeInTheDocument();
    });
});

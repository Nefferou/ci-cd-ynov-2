import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserDetailsModal from './UserDetailsModal';

describe('UserDetailsModal', () => {
    const sampleUser = {
        id: 1,
        name: 'Jean',
        surname: 'Dupont',
        email: 'jean.dupont@example.com',
        birthdate: '1990-01-01',
        city: 'Paris',
        postal_code: '75000'
    };

    test('ne rend rien si aucun utilisateur n’est fourni', () => {
        const { container } = render(<UserDetailsModal user={null} onClose={jest.fn()} />);
        expect(container.firstChild).toBeNull();
    });

    test('affiche les détails de l’utilisateur', () => {
        render(<UserDetailsModal user={sampleUser} onClose={jest.fn()} />);

        expect(screen.getByText("Détails de l'utilisateur")).toBeInTheDocument();
        expect(screen.getByText(/Jean/)).toBeInTheDocument();
        expect(screen.getByText(/Dupont/)).toBeInTheDocument();
        expect(screen.getByText(/jean.dupont@example.com/)).toBeInTheDocument();
        expect(screen.getByText(/1990-01-01/)).toBeInTheDocument();
        expect(screen.getByText(/Paris/)).toBeInTheDocument();
        expect(screen.getByText(/75000/)).toBeInTheDocument();
    });

    test('appelle la fonction onClose quand on clique sur Fermer', () => {
        const mockOnClose = jest.fn();
        render(<UserDetailsModal user={sampleUser} onClose={mockOnClose} />);

        const closeButton = screen.getByRole('button', { name: /fermer/i });
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});

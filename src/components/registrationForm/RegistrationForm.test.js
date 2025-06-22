import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import RegistrationForm from './RegistrationForm';
import * as api from '../../api/api';

jest.mock('../../api/api');

describe('RegistrationForm', () => {
    test('renders registration form', () => {
        render(<RegistrationForm addUser={() => {}} />);
        expect(screen.getByText(/Formulaire d'inscription/i)).toBeInTheDocument();
    });

    it('should validate form fields', () => {
        render(<RegistrationForm addUser={() => {}} />);
        fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/^surname$/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByLabelText(/^birthdate$/i), { target: { value: '2015-01-01' } });
        fireEvent.change(screen.getByLabelText(/^city$/i), { target: { value: 'Paris' } });
        fireEvent.change(screen.getByLabelText(/^postal_code$/i), { target: { value: '75000' } });
        fireEvent.submit(screen.getByText(/Sauvegarder/i));
        expect(screen.getByText(/Email invalide./i)).toBeInTheDocument();
        expect(screen.getByText(/Vous devez avoir au moins 18 ans./i)).toBeInTheDocument();
    });

    it('should submit form when valid', async () => {
        const mockAddUser = jest.fn().mockResolvedValue({});
        api.addUser.mockImplementation(mockAddUser);
        render(<RegistrationForm/>);
        fireEvent.change(screen.getByLabelText(/^name$/i), {target: {value: 'John'}});
        fireEvent.change(screen.getByLabelText(/^surname$/i), {target: {value: 'Doe'}});
        fireEvent.change(screen.getByLabelText(/^email$/i), {target: {value: 'john.doe@example.com'}});
        fireEvent.change(screen.getByLabelText(/^birthdate$/i), {target: {value: '2000-01-01'}});
        fireEvent.change(screen.getByLabelText(/^city$/i), {target: {value: 'Paris'}});
        fireEvent.change(screen.getByLabelText(/^postal_code$/i), {target: {value: '75000'}});
        fireEvent.submit(screen.getByText(/Sauvegarder/i));
        await waitFor(() => {
            expect(mockAddUser).toHaveBeenCalledWith({
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                birthdate: '2000-01-01',
                city: 'Paris',
                postal_code: '75000'
            });
            expect(screen.getByText(/Registration successful!/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/^name$/i).value).toBe('');
            expect(screen.getByLabelText(/^surname$/i).value).toBe('');
            expect(screen.getByLabelText(/^email$/i).value).toBe('');
            expect(screen.getByLabelText(/^birthdate$/i).value).toBe('');
            expect(screen.getByLabelText(/^city$/i).value).toBe('');
            expect(screen.getByLabelText(/^postal_code$/i).value).toBe('');
        });
    });

    it('should disable submit button when fields are empty', () => {
        render(<RegistrationForm addUser={() => {}} />);
        expect(screen.getByText(/Sauvegarder/i)).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: 'John' } });
        expect(screen.getByText(/Sauvegarder/i)).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/^surname$/i), { target: { value: 'Doe' } });
        expect(screen.getByText(/Sauvegarder/i)).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'john.doe@example.com' } });
        expect(screen.getByText(/Sauvegarder/i)).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/^birthdate$/i), { target: { value: '2000-01-01' } });
        fireEvent.change(screen.getByLabelText(/^city$/i), { target: { value: 'Paris' } });
        fireEvent.change(screen.getByLabelText(/^postal_code$/i), { target: { value: '75000' } });
        expect(screen.getByText(/Sauvegarder/i)).toBeEnabled();
    });
})
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import App from './App';
import * as api from './api/api';
import {useAuth} from "./contexts/AuthContext";

jest.mock('./api/api');

jest.mock('./contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

const mockUseAuth = (userEmail = null) => {
  useAuth.mockReturnValue({
    user: userEmail ? { email: userEmail } : null,
    logout: jest.fn()
  });
};

describe('App Component', () => {
  const initialUsers = [
    {
      name: 'Jane',
      surname: 'Doe',
      email: 'jane.doe@example.com',
      birthdate: '1995-05-05',
      city: 'Lyon',
      postal_code: '69000'
    }
  ];

  beforeEach(() => {
    api.fetchUsers.mockResolvedValue(initialUsers);
    api.addUser.mockResolvedValue({});
    api.deleteUser.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render LoginForm if user is not logged in', async () => {
    mockUseAuth();

    render(<App />);

    expect(screen.getByText(/Formulaire de Login/i)).toBeInTheDocument();
    expect(screen.queryByText(/Logged in as/i)).not.toBeInTheDocument();
  });

  it('should show logged-in state', async () => {
    mockUseAuth('admin@test.com');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText((content, element) =>
          element?.textContent === 'Logged in as admin@test.com'
      )).toBeInTheDocument();
    });
  });

  it('should render the registration form and user list', async () => {
    mockUseAuth('admin@test.com');

    render(<App />);

    expect(screen.getByText(/Formulaire d'inscription/i)).toBeInTheDocument();
    expect(screen.getByText(/Users Manager/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/1 user\(s\) already registered/i)).toBeInTheDocument();
    });
  });

  it('should add a user and refreshes the user list from API', async () => {
    mockUseAuth('admin@test.com');

    render(<App />);

    const newUser = {
      name: 'John',
      surname: 'Smith',
      email: 'john.smith@example.com',
      birthdate: '2000-01-01',
      city: 'Paris',
      postal_code: '75000'
    };

    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: newUser.name } });
    fireEvent.change(screen.getByLabelText(/^surname$/i), { target: { value: newUser.surname } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: newUser.email } });
    fireEvent.change(screen.getByLabelText(/^birthdate$/i), { target: { value: newUser.birthdate } });
    fireEvent.change(screen.getByLabelText(/^city$/i), { target: { value: newUser.city } });
    fireEvent.change(screen.getByLabelText(/^postal_code$/i), { target: { value: newUser.postal_code } });

    const updatedUsers = [...initialUsers, newUser];
    api.fetchUsers.mockResolvedValueOnce(updatedUsers); // simulate refresh

    fireEvent.submit(screen.getByText(/Sauvegarder/i));

    await waitFor(() => {
      expect(api.addUser).toHaveBeenCalledWith(newUser);
      expect(api.fetchUsers).toHaveBeenCalledTimes(2);
      expect(screen.getByText(/John Smith/i)).toBeInTheDocument();
      expect(screen.getByText(/2 user\(s\) already registered/i)).toBeInTheDocument();
    });
  });

  it('should display an error when fetchUsers fails', async () => {
    mockUseAuth('admin@test.com');

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    api.fetchUsers.mockRejectedValueOnce(new Error('Erreur API'));
    render(<App />);

    await waitFor(() => {
      expect(api.fetchUsers).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error loading users:',
          expect.any(Error)
      );
    });
  });

  it('should delete a user and refresh the list', async () => {
    mockUseAuth('admin@test.com');

    const userToDelete = initialUsers[0];

    api.fetchUsers.mockResolvedValueOnce(initialUsers);
    api.fetchUsers.mockResolvedValueOnce([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/Supprimer/);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(api.deleteUser).toHaveBeenCalledWith(userToDelete);
      expect(api.fetchUsers).toHaveBeenCalledTimes(2);
      expect(screen.queryByText(/Jane Doe/)).not.toBeInTheDocument();
      expect(screen.getByText(/0 user\(s\) already registered/)).toBeInTheDocument();
    });
  });

  it('should log an error when deleteUser fails', async () => {
    mockUseAuth('admin@test.com');

    const userToDelete = initialUsers[0];

    api.fetchUsers.mockResolvedValueOnce(initialUsers);
    api.deleteUser.mockRejectedValue(new Error('Suppression échouée'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/Supprimer/);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(api.deleteUser).toHaveBeenCalledWith(userToDelete);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error deleting user:',
          expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
})
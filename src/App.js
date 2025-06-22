import React, {useEffect, useState} from 'react';
import RegistrationForm from './components/registrationForm/RegistrationForm';
import UserList from './components/userList/UserList';
import './App.css';
import {deleteUser, fetchUsers} from "./api/api";
import LoginForm from "./components/loginForm/LoginForm";
import {useAuth} from "./contexts/AuthContext";

function App() {
    const [users, setUsers] = useState([]);
    const [usersCount, setUsersCount] = useState(0);
    const {user, logout} = useAuth();

    const loadUsers = async () => {
        try {
            const utilisateurs = await fetchUsers();
            setUsers(utilisateurs);
            setUsersCount(utilisateurs.length);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDeleteUser = async (userToDelete) => {
        try {
            await deleteUser(userToDelete);
            await loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="App">
            <header className="App-Header">
                <h1>Users Manager</h1>
                <p>{usersCount} user(s) already registered</p>
            </header>
            <div className="App-Body">
                <div className="component">
                    {!user ? (
                        <LoginForm/>
                    ) : (
                        <div>
                            <p>Logged in as <strong>{user.email}</strong></p>
                            <button onClick={logout}>Logout</button>
                        </div>
                    )}
                </div>
                <div className="component">
                    <RegistrationForm onSuccess={loadUsers}/>
                </div>
                <div className="component">
                    <UserList users={users} onDelete={handleDeleteUser}/>
                </div>
            </div>
        </div>
    );
}

export default App;

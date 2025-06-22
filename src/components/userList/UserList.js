import React, {useState} from 'react';
import {useAuth} from "../../contexts/AuthContext";
import UserDetailsModal from "../userDetailsModal/UserDetailsModal";

const UserList = ({ users, onDelete }) => {
    const { user } = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div>
            <h2>Liste des inscrits</h2>
            <ul>
                {users.map((u, index) => (
                    <li
                        key={index}
                        onClick={() => user && setSelectedUser(u)}
                        style={{
                            cursor: user ? 'pointer' : 'default',
                        }}
                    >
                        {u.name} {u.surname} - {u.email}
                        {user && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(u)
                                }}
                            >
                                Supprimer
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
};

export default UserList;
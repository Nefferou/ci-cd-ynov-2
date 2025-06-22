import React from 'react';

const UserDetailsModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2>Détails de l'utilisateur</h2>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Nom:</strong> {user.name}</p>
                <p><strong>Prénom:</strong> {user.surname}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Date de naissance:</strong> {user.birthdate}</p>
                <p><strong>Ville:</strong> {user.city}</p>
                <p><strong>Code postal:</strong> {user.postal_code}</p>
                <button onClick={onClose}>Fermer</button>
            </div>
        </div>
    );
};

const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
};

const modalStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)'
};

export default UserDetailsModal;
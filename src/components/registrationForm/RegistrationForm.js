import React, { useState, useEffect } from 'react';
import { validateForm } from '../../utils/validation';
import Toastr from '../toastr/Toastr';
import {addUser} from "../../api/api";

const RegistrationForm = ({ onSuccess }) => {
    const [form, setForm] = useState({
        name: '',
        surname: '',
        email: '',
        birthdate: '',
        city: '',
        postal_code: ''
    });
    const [errors, setErrors] = useState({});
    const [successful, setSuccessful] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        const validationErrors = validateForm(form);
        setErrors(validationErrors);
        setIsFormValid(Object.keys(validationErrors).length === 0);
    }, [form]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        if (isFormValid) {
            try {
                await addUser(form);
                setSuccessful(true);
                setForm({ name: '', surname: '', email: '', birthdate: '', city: '', postal_code: '' });
                setHasSubmitted(false);
                if (onSuccess) onSuccess();
            } catch (error) {
                console.error("Erreur lors de l'ajout:", error);
            }
        } else {
            setSuccessful(false);
        }
    };

    const allFieldsFilled = Object.values(form).every((v) => v.trim() !== '');

    return (
        <div data-testid="registration-form">
            <h2>Formulaire d'inscription</h2>
            {successful && <Toastr message="Registration successful!"/>}
            {hasSubmitted && !isFormValid && (
                <Toastr type="error" message="Formulaire invalide. Veuillez corriger les erreurs." />
            )}
            <form onSubmit={handleSubmit}>
                {['name', 'surname', 'email', 'birthdate', 'city', 'postal_code'].map((field) => (
                    <div key={field}>
                        <label htmlFor={field}>{field}</label>
                        <input
                            id={field}
                            type={field === 'birthdate' ? 'date' : 'text'}
                            name={field}
                            value={form[field]}
                            onChange={handleChange}
                        />
                        {hasSubmitted  && errors[field] && <span style={{ color: 'red' }}>{errors[field]}</span>}
                    </div>
                ))}
                <button type="submit" disabled={!allFieldsFilled}>Sauvegarder</button>
            </form>
        </div>
    );
};

export default RegistrationForm;

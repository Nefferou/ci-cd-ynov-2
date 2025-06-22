export const isValidName = (name) => /^[a-zA-ZÀ-ÿ '-]+$/.test(name);
export const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) &&
    !email.includes('..');
export const isValidPostalCode = (postalCode) => /^\d{5}$/.test(postalCode);
export const isValidBirthdate = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const hasHadBirthdayThisYear = (
        today.getMonth() > birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate())
    );

    if (!hasHadBirthdayThisYear) age--;

    return age >= 18;
};

export const validateForm = (form) => {
    const errors = {};
    if (!isValidName(form.name)) errors.name = "Prénom invalide.";
    if (!isValidName(form.surname)) errors.surname = "Nom invalide.";
    if (!isValidEmail(form.email)) errors.email = "Email invalide.";
    if (!isValidBirthdate(form.birthdate)) errors.birthdate = "Vous devez avoir au moins 18 ans.";
    if (!isValidName(form.city)) errors.city = "Ville invalide.";
    if (!isValidPostalCode(form.postal_code)) errors.postal_code = "Code postal invalide.";
    return errors;
};
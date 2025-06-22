import api from './axiosInstance';

export const fetchUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data.utilisateurs;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const addUser = async (user) => {
    try {
        await api.post('/users', user);
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const deleteUser = async (user) => {
    try {
        const token = localStorage.getItem("token");
        await api.delete(`/users/${user.id}`,{headers: {Authorization: `Bearer ${token}`}});
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}
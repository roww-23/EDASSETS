const API_BASE_URL = 'http://127.0.0.1:8000/api';

class API {
    static get token() {
        return localStorage.getItem('auth_token');
    }

    static async request(endpoint, method = 'GET', body = null, isFile = false) {
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Token ${this.token}`;
        }

        const config = {
            method,
            headers,
        };

        if (body) {
            if (isFile) {
                // Determine if body is FormData or not
                config.body = body;
                // Do NOT set Content-Type for FormData, browser sets it with boundary
            } else {
                headers['Content-Type'] = 'application/json';
                config.body = JSON.stringify(body);
            }
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Something went wrong');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async login(username, password) {
        // Login endpoint expects form data or json? our view is default ObtainAuthToken which accepts JSON
        const data = await this.request('/login/', 'POST', { username, password });
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    }

    static async register(username, email, password) {
        return await this.request('/register/', 'POST', { username, email, password });
    }

    static logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    }

    static async getAssets() {
        return await this.request('/assets/');
    }

    static async uploadAsset(formData) {
        return await this.request('/assets/', 'POST', formData, true);
    }

    static async downloadAsset(id) {
        return await this.request(`/assets/${id}/download/`, 'POST');
    }

    static async getDashboard() {
        return await this.request('/dashboard/');
    }
}

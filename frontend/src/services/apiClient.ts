const API_BASE_URL = 'http://localhost:3000/api';

export const apiClient = async <T,>(endpoint: string, options?: RequestInit): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            throw new Error(`API Error: ${response.status}`);
        }
        throw errorData.error || new Error('Unknown API Error');
    }

    return response.json();
};

interface LoginResponse {
  message?: string;
  user_id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  error?: string;
}

interface GoogleAuthResponse {
  credential: string;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
}

interface SignupResponse {
  message?: string;
  error?: string;
}

const API_BASE_URL = 'https://backend-aec-experimental.onrender.com';

export const userAuthAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Server error during login');
    }
  },

  googleAuth: async (response: GoogleAuthResponse): Promise<LoginResponse> => {
    try {
      const result = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: response.credential })
      });

      return await result.json();
    } catch (error) {
      console.error('Google auth error:', error);
      throw new Error('Server error during Google authentication');
    }
  },

  signup: async (data: SignupData): Promise<SignupResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Server error during registration');
    }
  }
};
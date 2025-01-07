const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/resume";
const API_VERSION = import.meta.env.VITE_API_VERSION || "v1";
const API_URL = `${API_BASE_URL}/${API_VERSION}`;

export default API_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in the environment variables.");
}

const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(", "));
  }
  return response.json();
};

interface UserData {
  email: string;
  password: string;
  password_confirmation?: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : {
        "Content-Type": "application/json",
      };
};

export const registerUser = async (userData: UserData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const loginUser = async (credentials: Credentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};






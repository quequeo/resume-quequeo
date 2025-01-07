import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from '../pages/Login';
import { loginUser } from '../utils/Api';

vi.mock('../utils/Api', () => ({
  loginUser: vi.fn()
}));

test('submits login form and logs in', async () => {
  const mockLoginResponse = {
    user: { email: 'test@example.com' },
    token: '12345'
  };
  
  (loginUser as jest.Mock).mockResolvedValue(mockLoginResponse);
  const mockLogin = vi.fn();

  render(
    <AuthContext.Provider value={{ login: mockLogin, user: null }}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthContext.Provider>
  );

  fireEvent.change(screen.getByLabelText(/email/i), { 
    target: { value: 'test@example.com' } 
  });
  fireEvent.change(screen.getByLabelText(/password/i), { 
    target: { value: 'password123' } 
  });
  
  fireEvent.submit(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(loginUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(mockLogin).toHaveBeenCalledWith(
      mockLoginResponse.user,
      mockLoginResponse.token
    );
  });
});

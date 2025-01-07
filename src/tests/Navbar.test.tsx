import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

test('renders Navbar with links and toggles theme', () => {
  const mockLogout = vi.fn();
  
  render(
    <AuthContext.Provider value={{ logout: mockLogout, user: null }}>
      <ThemeProvider>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </ThemeProvider>
    </AuthContext.Provider>
  );

  expect(screen.getByText(/home/i)).toBeInTheDocument();
  expect(screen.getByText(/login/i)).toBeInTheDocument();
  
  const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
  fireEvent.click(themeToggle);
});
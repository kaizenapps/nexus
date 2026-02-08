import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardLayout from './DashboardLayout';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('DashboardLayout Security', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it('should redirect to login when unauthenticated', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Expect navigation to root
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should render dashboard content when authenticated', () => {
    localStorage.setItem('nexus_auth', 'true');

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardLayout />} />
        </Routes>
      </MemoryRouter>
    );

    // Expect dashboard content (e.g., sidebar items) to be visible
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Graph View')).toBeInTheDocument();

    // Expect NO navigation
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect, Mock } from 'vitest';
import DatabaseView from './DatabaseView';
import * as DataContext from '../context/DataContext';

vi.mock('../context/DataContext', () => ({
  useData: vi.fn(),
}));

describe('DatabaseView Functionality', () => {
    const nodes = [
        { id: '1', name: 'Alpha', group: 'person', val: 1, role: 'CEO', email: 'a@a.com', status: 'Active' },
        { id: '2', name: 'Beta', group: 'company', val: 1, role: 'Inc', email: 'b@b.com', status: 'Active' },
        { id: '3', name: 'Gamma', group: 'person', val: 1, role: 'CTO', email: 'c@c.com', status: 'Active' },
    ];

    const mockUseData = {
        graphData: { nodes, links: [] },
        setGraphData: vi.fn(),
        addNodes: vi.fn(),
    };

    it('renders nodes correctly', () => {
        (DataContext.useData as Mock).mockReturnValue(mockUseData);
        render(<DatabaseView />);

        expect(screen.getByText('Alpha')).toBeInTheDocument();
        expect(screen.getByText('Beta')).toBeInTheDocument();
        expect(screen.getByText('Gamma')).toBeInTheDocument();
    });

    it('filters by search term', () => {
        (DataContext.useData as Mock).mockReturnValue(mockUseData);
        render(<DatabaseView />);

        const searchInput = screen.getByPlaceholderText('Search...');
        fireEvent.change(searchInput, { target: { value: 'Alpha' } });

        expect(screen.getByText('Alpha')).toBeInTheDocument();
        expect(screen.queryByText('Beta')).not.toBeInTheDocument();
        expect(screen.queryByText('Gamma')).not.toBeInTheDocument();
    });

    it('filters by group', () => {
        (DataContext.useData as Mock).mockReturnValue(mockUseData);
        render(<DatabaseView />);

        // Dropdown select
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'company' } });

        expect(screen.queryByText('Alpha')).not.toBeInTheDocument(); // person
        expect(screen.getByText('Beta')).toBeInTheDocument(); // company
        expect(screen.queryByText('Gamma')).not.toBeInTheDocument(); // person
    });

    it('sorts by name', () => {
        (DataContext.useData as Mock).mockReturnValue(mockUseData);
        render(<DatabaseView />);

        const nameHeader = screen.getByText(/Name/i).closest('th');
        if (!nameHeader) throw new Error('Sort header not found');

        // Initial order: Alpha, Beta, Gamma (id 1, 2, 3)
        // Check rendered rows order
        // Note: Table rows might be rendered in order, so checking indices or using `getAllByRole('row')` is good.

        let rows = screen.getAllByRole('row');
        // Row 0 is header.
        expect(rows[1]).toHaveTextContent('Alpha');
        expect(rows[2]).toHaveTextContent('Beta');
        expect(rows[3]).toHaveTextContent('Gamma');

        // Click to sort DESC (first click ASC, second DESC? No. Code: 'asc' by default. Click again for 'desc'.)
        // Initial state is null. First click: ASC.
        // It was already sorted by ID implicitly because of array order.
        // Let's check reverse sort.

        // Click once: ASC
        fireEvent.click(nameHeader);
        // Alpha, Beta, Gamma
        rows = screen.getAllByRole('row');
        expect(rows[1]).toHaveTextContent('Alpha');

        // Click again: DESC
        fireEvent.click(nameHeader);
        // Gamma, Beta, Alpha
        rows = screen.getAllByRole('row');
        expect(rows[1]).toHaveTextContent('Gamma');
        expect(rows[2]).toHaveTextContent('Beta');
        expect(rows[3]).toHaveTextContent('Alpha');
    });
});

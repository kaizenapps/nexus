import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, vi, Mock } from 'vitest';
import DatabaseView from './DatabaseView';
import * as DataContext from '../context/DataContext';

// Mock the DataContext
vi.mock('../context/DataContext', () => ({
  useData: vi.fn(),
}));

describe('DatabaseView Performance Benchmark', () => {
    const generateNodes = (count: number) => {
        return Array.from({ length: count }, (_, i) => ({
            id: `node-${i}`,
            name: `Node ${i}`,
            group: i % 2 === 0 ? 'person' : 'company',
            val: 1,
            role: 'Role',
            email: 'email@example.com',
            status: 'Active'
        }));
    };

    it('benchmarks filtering and sorting with 50,000 nodes', () => {
        const largeNodes = generateNodes(50000);
        const mockUseData = {
            graphData: { nodes: largeNodes, links: [] },
            setGraphData: vi.fn(),
            addNodes: vi.fn(),
        };

        (DataContext.useData as Mock).mockReturnValue(mockUseData);

        const startRender = performance.now();
        render(<DatabaseView />);
        const endRender = performance.now();
        console.log(`Initial render time (50k nodes): ${(endRender - startRender).toFixed(2)}ms`);

        // Measure sorting performance (Full List)
        const sortHeader = screen.getByText(/Name/i).closest('th');

        if (!sortHeader) throw new Error('Sort header not found');

        const startSort = performance.now();
        act(() => {
            fireEvent.click(sortHeader);
        });
        const endSort = performance.now();
        console.log(`Sort time (Full 50k nodes): ${(endSort - startSort).toFixed(2)}ms`);

        // Measure filtering performance
        const searchInput = screen.getByPlaceholderText('Search...');

        const startFilter = performance.now();
        act(() => {
            fireEvent.change(searchInput, { target: { value: 'Node 999' } });
        });
        const endFilter = performance.now();

        console.log(`Filter time (50k nodes): ${(endFilter - startFilter).toFixed(2)}ms`);
    });
});

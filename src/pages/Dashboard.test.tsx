import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom';
import * as analytics from '../lib/analytics';

// Mock ResizeObserver for Recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock analytics to count calls
vi.mock('../lib/analytics', async (importOriginal) => {
  const actual = await importOriginal<typeof analytics>();
  return {
    ...actual,
    calculateGraphMetrics: vi.fn(actual.calculateGraphMetrics),
    findStrategicMove: vi.fn(actual.findStrategicMove),
  };
});

// Mock Recharts to avoid rendering issues
vi.mock('recharts', async () => {
    return {
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        RadarChart: () => <div>RadarChart</div>,
        Radar: () => null,
        PolarGrid: () => null,
        PolarAngleAxis: () => null,
        PolarRadiusAxis: () => null,
        Tooltip: () => null,
    };
});

// Stable data
const mockGraphData = {
    nodes: [
        { id: '1', name: 'A', group: 'person', role: 'CEO' },
        { id: '2', name: 'B', group: 'person', role: 'CTO' },
    ],
    links: [
        { source: '1', target: '2' }
    ]
};

// Mock DataContext
vi.mock('../context/DataContext', async () => {
    return {
        useData: () => ({
            graphData: mockGraphData
        }),
        DataProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
    };
});

describe('Dashboard Performance', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('memoizes metrics across re-renders', () => {
        const { rerender } = render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        // Initial render
        expect(analytics.calculateGraphMetrics).toHaveBeenCalledTimes(1);
        expect(analytics.findStrategicMove).toHaveBeenCalledTimes(1);

        // Force re-render
        rerender(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        // Should NOT be called again if memoized
        expect(analytics.calculateGraphMetrics).toHaveBeenCalledTimes(1);
        expect(analytics.findStrategicMove).toHaveBeenCalledTimes(1);
    });
});

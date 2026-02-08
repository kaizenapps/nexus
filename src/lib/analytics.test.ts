import { describe, it, expect } from 'vitest';
import { calculateGraphMetrics, findStrategicMove } from './analytics';
import { GraphNode, GraphLink } from './analytics';

describe('calculateGraphMetrics', () => {
    it('should calculate metrics correctly', () => {
        const nodes: GraphNode[] = [
            { id: '1', name: 'A', group: 'person', role: 'CEO', industry: 'Tech', country: 'USA' },
            { id: '2', name: 'B', group: 'person', role: 'CTO', industry: 'Tech', country: 'USA' },
            { id: '3', name: 'C', group: 'person', role: 'Engineer', industry: 'Tech', country: 'Canada' },
            { id: '4', name: 'D', group: 'person', role: 'Sales Manager', industry: 'Finance', country: 'UK' },
        ];
        const links: GraphLink[] = [
            { source: '1', target: '2' },
            { source: '2', target: '3' },
        ];

        const metrics = calculateGraphMetrics(nodes, links);

        expect(metrics.totalNodes).toBe(4);
        expect(metrics.totalLinks).toBe(2);
        expect(metrics.roleCounts.Executives).toBe(2); // CEO, CTO
        expect(metrics.roleCounts.Engineers).toBe(1); // Engineer
        expect(metrics.roleCounts.Sales).toBe(1); // Sales Manager
        expect(metrics.topIndustries).toEqual([['Tech', 3], ['Finance', 1]]);
        expect(metrics.uniqueCountries).toBe(3);
    });
});

describe('findStrategicMove', () => {
    it('should find the most connected person', () => {
        const nodes: GraphNode[] = [
            { id: '1', name: 'A', group: 'person', role: 'CEO' },
            { id: '2', name: 'B', group: 'person', role: 'CTO' },
            { id: '3', name: 'C', group: 'person', role: 'Dev' },
        ];
        // B is connected to A and C, so B is the most connected
        const links: GraphLink[] = [
            { source: '1', target: '2' },
            { source: '2', target: '3' },
        ];

        const move = findStrategicMove(nodes, links);

        expect(move).not.toBeNull();
        expect(move?.nodeId).toBe('2');
        expect(move?.name).toBe('B');
        expect(move?.score).toBe(2);
    });

    it('should handle react-force-graph object links', () => {
        const nodes: GraphNode[] = [
            { id: '1', name: 'A', group: 'person' },
            { id: '2', name: 'B', group: 'person' },
        ];
        // react-force-graph changes source/target to objects
        const links: any[] = [
            { source: { id: '1' }, target: { id: '2' } },
        ];

        const move = findStrategicMove(nodes, links);

        // Both have 1 connection, sort might be based on original order or equal
        expect(move).not.toBeNull();
        expect(move?.score).toBe(1);
    });
});

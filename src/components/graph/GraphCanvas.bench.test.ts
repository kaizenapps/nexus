import { describe, it, expect } from 'vitest';

// Types for our mock data
interface MockNode {
    id: string;
    name: string;
    role?: string;
    description?: string;
    industry?: string;
    group?: string;
    [key: string]: any;
}

// Generate mock data
const generateNodes = (count: number): MockNode[] => {
    const roles = ['Software Engineer', 'Product Manager', 'Designer', 'CEO', 'Founder'];
    const industries = ['Tech', 'Finance', 'Healthcare', 'Education', 'Retail'];
    const groups = ['person', 'company', 'investor', 'event'];

    return Array.from({ length: count }, (_, i) => ({
        id: `node-${i}`,
        name: `User ${i} Name`,
        role: roles[i % roles.length],
        description: `This is a description for user ${i} who works in ${industries[i % industries.length]}`,
        industry: industries[i % industries.length],
        group: groups[i % groups.length],
        x: Math.random() * 1000,
        y: Math.random() * 1000
    }));
};

describe('GraphCanvas Performance Benchmark', () => {
    const NODE_COUNT = 10000;
    const ITERATIONS = 100; // Simulate 100 frames
    const SEARCH_TERM = "Manager";

    const nodes = generateNodes(NODE_COUNT);

    it('benchmarks search matching performance', () => {
        console.log(`\nStarting Benchmark with ${NODE_COUNT} nodes over ${ITERATIONS} iterations...`);

        // --- Baseline Measurement (Current Implementation) ---
        const startBaseline = performance.now();

        for (let i = 0; i < ITERATIONS; i++) {
            // Simulate render loop iterating over all nodes
            for (const node of nodes) {
                // The exact logic from GraphCanvas.tsx
                const isMatch = SEARCH_TERM && (
                    (node.name && node.name.toLowerCase().includes(SEARCH_TERM.toLowerCase())) ||
                    (node.role && node.role.toLowerCase().includes(SEARCH_TERM.toLowerCase())) ||
                    (node.description && node.description.toLowerCase().includes(SEARCH_TERM.toLowerCase())) ||
                    (node.industry && node.industry.toLowerCase().includes(SEARCH_TERM.toLowerCase())) ||
                    (node.group && node.group.toLowerCase().includes(SEARCH_TERM.toLowerCase()))
                );
                // logic to use isMatch would follow...
            }
        }

        const endBaseline = performance.now();
        const baselineTime = endBaseline - startBaseline;
        console.log(`Baseline (Inline Check): ${baselineTime.toFixed(2)}ms`);


        // --- Optimized Measurement (Proposed Implementation) ---
        const startOptimized = performance.now();

        // 1. Pre-calculation (runs once when search term changes)
        const matchedNodeIds = new Set<string>();
        if (SEARCH_TERM) {
            const lowerTerm = SEARCH_TERM.toLowerCase();
            for (const node of nodes) {
                const isMatch = (
                    (node.name && node.name.toLowerCase().includes(lowerTerm)) ||
                    (node.role && node.role.toLowerCase().includes(lowerTerm)) ||
                    (node.description && node.description.toLowerCase().includes(lowerTerm)) ||
                    (node.industry && node.industry.toLowerCase().includes(lowerTerm)) ||
                    (node.group && node.group.toLowerCase().includes(lowerTerm))
                );
                if (isMatch) {
                    matchedNodeIds.add(node.id);
                }
            }
        }

        // 2. Render Loop (runs many times)
        for (let i = 0; i < ITERATIONS; i++) {
            for (const node of nodes) {
                const isMatch = matchedNodeIds.has(node.id);
                 // logic to use isMatch would follow...
            }
        }

        const endOptimized = performance.now();
        const optimizedTime = endOptimized - startOptimized;
        console.log(`Optimized (Pre-calc + Lookup): ${optimizedTime.toFixed(2)}ms`);

        // Assert Improvement
        console.log(`Speedup: ${(baselineTime / optimizedTime).toFixed(2)}x`);
        expect(optimizedTime).toBeLessThan(baselineTime);
    });
});

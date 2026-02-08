
import { describe, it, expect } from 'vitest';
import { onRequest } from './graph';

describe('Graph API', () => {
    it('should return valid graph data with correct schema', async () => {
        // Mock context (not used in the function, but good to provide)
        const context = {};

        // Call the function
        const response = await onRequest(context);

        // Verify response status
        expect(response.status).toBe(200);

        // Verify content type
        expect(response.headers.get('Content-Type')).toBe('application/json');

        // Parse JSON body
        const data = await response.json();

        // Verify schema
        expect(data).toHaveProperty('nodes');
        expect(data).toHaveProperty('edges');

        // Verify nodes content
        expect(Array.isArray(data.nodes)).toBe(true);
        expect(data.nodes.length).toBeGreaterThan(0);
        data.nodes.forEach((node: any) => {
            expect(node).toHaveProperty('id');
            expect(node).toHaveProperty('type');
            expect(node).toHaveProperty('label');
            expect(node).toHaveProperty('lat');
            expect(node).toHaveProperty('lng');
        });

        // Verify specific node data (checking the mock data)
        const node1 = data.nodes.find((n: any) => n.id === '1');
        expect(node1).toBeDefined();
        expect(node1.label).toBe('Preston Zen');
        expect(node1.type).toBe('person');

        // Verify edges content
        expect(Array.isArray(data.edges)).toBe(true);
        expect(data.edges.length).toBeGreaterThan(0);
        data.edges.forEach((edge: any) => {
            expect(edge).toHaveProperty('id');
            expect(edge).toHaveProperty('source');
            expect(edge).toHaveProperty('target');
            expect(edge).toHaveProperty('type');
        });

        // Verify specific edge data
        const edge1 = data.edges.find((e: any) => e.id === 'e1');
        expect(edge1).toBeDefined();
        expect(edge1.source).toBe('1');
        expect(edge1.target).toBe('2');
    });
});

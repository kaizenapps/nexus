
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onRequestPost } from '../../../functions/api/analyze';

// Mock fetch globally
const fetch = vi.fn();
global.fetch = fetch;

// Mock console.error to avoid noise in test output
const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('analyze function', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return error if objective is missing', async () => {
        const request = new Request('http://localhost', {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const context: any = {
            request,
            env: {},
            next: vi.fn(),
            data: {},
            params: {},
            waitUntil: vi.fn(),
        };

        const response = await onRequestPost(context);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toEqual({ error: 'Objective is required' });
    });

    it('should return error if OpenRouter API key is missing', async () => {
        const request = new Request('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ objective: 'Test objective' }),
        });

        const context: any = {
            request,
            env: {}, // Missing OPENROUTER_API_KEY
            next: vi.fn(),
            data: {},
            params: {},
            waitUntil: vi.fn(),
        };

        const response = await onRequestPost(context);

        expect(response.status).toBe(500);
        // Note: The implementation returns 500 for missing key
    });

    it('should call AI service and return graph data', async () => {
        const request = new Request('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ objective: 'Test objective' }),
        });

        const env = {
            OPENROUTER_API_KEY: 'test-key',
            APIFY_API_TOKEN: '', // No Apify token for this test
            HUNTER_API_KEY: ''
        };

        const mockAiResponse = {
            choices: [{
                message: {
                    content: JSON.stringify({
                        nodes: [{ id: '1', name: 'Node 1', group: 'person', description: 'Desc' }],
                        links: []
                    })
                }
            }]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockAiResponse,
        } as Response);

        const context: any = {
            request,
            env,
            next: vi.fn(),
            data: {},
            params: {},
            waitUntil: vi.fn(),
        };

        const response = await onRequestPost(context);
        const data: any = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.nodes).toHaveLength(1);
        expect(data.data.nodes[0].id).toBe('1');

        // Verify AI call
        expect(fetch).toHaveBeenCalledWith('https://openrouter.ai/api/v1/chat/completions', expect.any(Object));
    });

    it('should attempt Apify enrichment if token is present and nodes have linkedinUrl', async () => {
         const request = new Request('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ objective: 'Test objective' }),
        });

        const env = {
            OPENROUTER_API_KEY: 'test-key',
            APIFY_API_TOKEN: 'apify-token',
            HUNTER_API_KEY: ''
        };

        // Mock AI response with LinkedIn URL (which we will add in implementation)
        const mockAiResponse = {
            choices: [{
                message: {
                    content: JSON.stringify({
                        nodes: [{
                            id: '1',
                            name: 'Test User',
                            group: 'person',
                            description: 'Desc',
                            linkedinUrl: 'https://www.linkedin.com/in/testuser'
                        }],
                        links: []
                    })
                }
            }]
        };

        // Mock AI fetch response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockAiResponse,
        } as Response);

        // Mock Apify fetch response
        const mockApifyResponse = [{
            input: { url: 'https://www.linkedin.com/in/testuser' },
            headline: 'Software Engineer',
            summary: 'Experienced developer',
            profilePic: 'https://example.com/pic.jpg'
        }];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockApifyResponse,
        } as Response);

        const context: any = {
            request,
            env,
            next: vi.fn(),
            data: {},
            params: {},
            waitUntil: vi.fn(),
        };

        const response = await onRequestPost(context);
        const data: any = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);

        // This assertion will fail until we implement the Apify logic
        // We expect the node to be enriched
        expect(data.data.nodes[0].headline).toBe('Software Engineer');
        expect(data.data.nodes[0].summary).toBe('Experienced developer');
        expect(data.data.nodes[0].profilePic).toBe('https://example.com/pic.jpg');

        // Check if Apify was called
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenLastCalledWith(
            expect.stringContaining('api.apify.com/v2/acts/dev_fusion~linkedin-profile-scraper/run-sync-get-dataset-items'),
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    startUrls: [{ url: 'https://www.linkedin.com/in/testuser' }]
                })
            })
        );
    });
});

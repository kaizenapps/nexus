export async function onRequestPost(context: any) {
    try {
        const { request } = context;
        const { prompt } = await request.json();

        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Prompt is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const mockResponse = {
            objective: `Analyze network for: ${prompt}`,
            suggested_queries: [
                `site:linkedin.com/in/ "${prompt}"`,
                `site:crunchbase.com "${prompt}"`
            ],
            potential_nodes: [
                { type: 'person', label: 'Expert A', reason: 'Top researcher' }
            ]
        };

        return new Response(JSON.stringify(mockResponse), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

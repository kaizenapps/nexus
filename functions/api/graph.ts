export async function onRequest(context: any) {
    const mockNodes = [
        { id: '1', type: 'person', label: 'Preston Zen', lat: 37.7749, lng: -122.4194 },
        { id: '2', type: 'company', label: 'Kaizen Apps', lat: 37.7849, lng: -122.4094 },
        { id: '3', type: 'event', label: 'AI Conference 2024', lat: 37.7649, lng: -122.4294 },
    ];

    const mockEdges = [
        { id: 'e1', source: '1', target: '2', type: 'founder' },
        { id: 'e2', source: '1', target: '3', type: 'attending' },
    ];

    return new Response(JSON.stringify({ nodes: mockNodes, edges: mockEdges }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

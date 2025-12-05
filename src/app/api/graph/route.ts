import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
    // In a real implementation, we would access D1 here.
    // For now, we'll return mock data or check if the binding exists.

    // const db = getRequestContext().env.DB;
    // const { results } = await db.prepare('SELECT * FROM nodes LIMIT 100').all();

    // Mock data for Alpha visualization
    const mockNodes = [
        { id: '1', type: 'person', label: 'Preston Zen', lat: 37.7749, lng: -122.4194 },
        { id: '2', type: 'company', label: 'Kaizen Apps', lat: 37.7849, lng: -122.4094 },
        { id: '3', type: 'event', label: 'AI Conference 2024', lat: 37.7649, lng: -122.4294 },
    ];

    const mockEdges = [
        { id: 'e1', source: '1', target: '2', type: 'founder' },
        { id: 'e2', source: '1', target: '3', type: 'attending' },
    ];

    return NextResponse.json({ nodes: mockNodes, edges: mockEdges });
}

export async function POST(request: Request) {
    const body = await request.json();
    // Logic to insert nodes/edges
    return NextResponse.json({ success: true, data: body });
}

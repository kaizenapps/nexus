export interface GraphNode {
    id: string;
    name: string;
    group: string;
    role?: string;
    industry?: string;
    country?: string;
    // Allow for react-force-graph internal properties
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    index?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface GraphLink {
    source: string | GraphNode;
    target: string | GraphNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface GraphMetrics {
    totalNodes: number;
    totalLinks: number;
    roleCounts: Record<string, number>;
    topIndustries: [string, number][];
    uniqueCountries: number;
}

export interface StrategicMove {
    type: 'connect' | 'strengthen';
    nodeId: string;
    name: string;
    role: string;
    reason: string;
    score: number;
}

export const calculateGraphMetrics = (nodes: GraphNode[], links: GraphLink[]): GraphMetrics => {
    const totalNodes = nodes.length;
    const totalLinks = links.length;

    // Role Counts
    const roleCounts: Record<string, number> = {
        Investors: 0,
        Founders: 0,
        Engineers: 0,
        Sales: 0,
        Product: 0,
        Executives: 0
    };

    nodes.forEach(node => {
        if (node.group === 'person' && node.role) {
            const role = node.role.toLowerCase();
            if (role.includes('investor') || role.includes('vc') || role.includes('partner') || role.includes('angel')) roleCounts.Investors++;
            else if (role.includes('founder') || role.includes('co-founder') || role.includes('owner')) roleCounts.Founders++;
            else if (role.includes('engineer') || role.includes('developer') || role.includes('architect')) roleCounts.Engineers++;
            else if (role.includes('sales') || role.includes('account') || role.includes('bd') || role.includes('business development')) roleCounts.Sales++;
            else if (role.includes('product') || role.includes('manager') || role.includes('head of product')) roleCounts.Product++;
            else if (role.includes('ceo') || role.includes('cto') || role.includes('vp') || role.includes('director') || role.includes('chief')) roleCounts.Executives++;
        }
    });

    // Top Industries
    const industries: Record<string, number> = {};
    nodes.forEach(node => {
        if (node.industry) {
            industries[node.industry] = (industries[node.industry] || 0) + 1;
        }
    });

    const topIndustries = Object.entries(industries)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5); // Top 5

    // Unique Countries
    const uniqueCountries = new Set(nodes.map(n => n.country).filter(Boolean)).size;

    return {
        totalNodes,
        totalLinks,
        roleCounts,
        topIndustries,
        uniqueCountries
    };
};

export const findStrategicMove = (nodes: GraphNode[], links: GraphLink[]): StrategicMove | null => {
    // 1. Calculate Degree Centrality for all nodes
    const degreeMap: Record<string, number> = {};
    links.forEach(link => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;

        degreeMap[sourceId] = (degreeMap[sourceId] || 0) + 1;
        degreeMap[targetId] = (degreeMap[targetId] || 0) + 1;
    });

    // 2. Identify potential high-value targets (e.g., high degree but not connected to "me" or similar)
    // For this simple implementation, we'll assume the "user" is not explicitly defined in the graph as a single node,
    // so we look for the "most connected person" in the network as a starting point for a "move".
    // A better approach might be to find a node that bridges two clusters (high betweenness), but that's complex to calc.

    // Let's find the person with the highest degree who is NOT in the "Executive" role (to find hidden gems)
    // OR just the highest degree person.

    const sortedNodes = [...nodes]
        .filter(n => n.group === 'person')
        .sort((a, b) => (degreeMap[b.id] || 0) - (degreeMap[a.id] || 0));

    if (sortedNodes.length === 0) return null;

    const bestNode = sortedNodes[0];
    const degree = degreeMap[bestNode.id] || 0;

    return {
        type: 'connect',
        nodeId: bestNode.id,
        name: bestNode.name,
        role: bestNode.role || 'Unknown Role',
        reason: `High centrality in the network with ${degree} connections.`,
        score: degree
    };
};

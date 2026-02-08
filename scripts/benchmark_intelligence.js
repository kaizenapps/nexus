
function generateMockData(numNodes, numLinks) {
    const nodes = [];
    const groups = ['person', 'company', 'investor', 'event'];
    const roles = ['investor', 'founder', 'engineer', 'sales', 'product', 'ceo', 'cto', 'vp', 'director', 'other'];
    const industries = ['Tech', 'Health', 'Finance', 'Energy', 'Consumer'];

    for (let i = 0; i < numNodes; i++) {
        const group = groups[Math.floor(Math.random() * groups.length)];
        nodes.push({
            id: `node-${i}`,
            name: `Node ${i}`,
            group: group,
            industry: group === 'company' ? industries[Math.floor(Math.random() * industries.length)] : undefined,
            role: group === 'person' ? roles[Math.floor(Math.random() * roles.length)] : undefined,
            val: Math.random() * 10
        });
    }

    const links = [];
    for (let i = 0; i < numLinks; i++) {
        links.push({
            source: `node-${Math.floor(Math.random() * numNodes)}`,
            target: `node-${Math.floor(Math.random() * numNodes)}`
        });
    }

    return { nodes, links };
}

function runCalculations(graphData) {
    const start = performance.now();

    // Top Industries
    const industries = {};
    graphData.nodes.forEach(node => {
        if (node.group === 'company' && node.industry) {
            industries[node.industry] = (industries[node.industry] || 0) + 1;
        }
    });
    const topIndustries = Object.entries(industries)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

    // Network Composition Data (Role-based)
    const roleCounts = {
        Investors: 0,
        Founders: 0,
        Engineers: 0,
        Sales: 0,
        Product: 0,
        Executives: 0
    };

    graphData.nodes.forEach(node => {
        if (node.group === 'person' && node.role) {
            const role = node.role.toLowerCase();
            if (role.includes('investor') || role.includes('vc') || role.includes('partner')) roleCounts.Investors++;
            else if (role.includes('founder') || role.includes('co-founder')) roleCounts.Founders++;
            else if (role.includes('engineer') || role.includes('developer')) roleCounts.Engineers++;
            else if (role.includes('sales') || role.includes('account')) roleCounts.Sales++;
            else if (role.includes('product') || role.includes('manager')) roleCounts.Product++;
            else if (role.includes('ceo') || role.includes('cto') || role.includes('vp') || role.includes('director')) roleCounts.Executives++;
        }
    });

    const radarData = [
        { subject: 'Investors', count: roleCounts.Investors, fullMark: 20 },
        { subject: 'Founders', count: roleCounts.Founders, fullMark: 20 },
        { subject: 'Engineers', count: roleCounts.Engineers, fullMark: 20 },
        { subject: 'Sales', count: roleCounts.Sales, fullMark: 20 },
        { subject: 'Product', count: roleCounts.Product, fullMark: 20 },
        { subject: 'Executives', count: roleCounts.Executives, fullMark: 20 },
    ];

    // Dynamic Next Move
    const potentialMoves = graphData.nodes.filter(n => n.group === 'person' && n.name !== 'Preston Zen');
    const nextMove = potentialMoves.length > 0
        ? potentialMoves[Math.floor(Math.random() * potentialMoves.length)]
        : { name: 'Sarah Chen', role: 'AI Research Lead', id: 'mock-sarah' };

    const end = performance.now();
    return end - start;
}

const numNodes = 5000;
const numLinks = 10000;
const iterations = 100;

console.log(`Generating mock data with ${numNodes} nodes and ${numLinks} links...`);
const graphData = generateMockData(numNodes, numLinks);

console.log(`Running calculations ${iterations} times...`);
let totalTime = 0;
for (let i = 0; i < iterations; i++) {
    totalTime += runCalculations(graphData);
}

console.log(`Average time per calculation: ${(totalTime / iterations).toFixed(4)}ms`);
console.log(`Total time for ${iterations} calculations: ${totalTime.toFixed(4)}ms`);

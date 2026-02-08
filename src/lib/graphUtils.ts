import { Node } from "../context/DataContext";

/**
 * Calculates the network composition based on person roles.
 * @param nodes - Array of graph nodes
 * @returns Formatted data for radar charts
 */
export function getNetworkComposition(nodes: Node[]) {
    const roleCounts = {
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
            if (role.includes('investor') || role.includes('vc') || role.includes('partner')) roleCounts.Investors++;
            else if (role.includes('founder') || role.includes('co-founder')) roleCounts.Founders++;
            else if (role.includes('engineer') || role.includes('developer')) roleCounts.Engineers++;
            else if (role.includes('sales') || role.includes('account')) roleCounts.Sales++;
            else if (role.includes('product') || role.includes('manager')) roleCounts.Product++;
            else if (role.includes('ceo') || role.includes('cto') || role.includes('vp') || role.includes('director')) roleCounts.Executives++;
        }
    });

    return [
        { subject: 'Investors', count: roleCounts.Investors, fullMark: 20 },
        { subject: 'Founders', count: roleCounts.Founders, fullMark: 20 },
        { subject: 'Engineers', count: roleCounts.Engineers, fullMark: 20 },
        { subject: 'Sales', count: roleCounts.Sales, fullMark: 20 },
        { subject: 'Product', count: roleCounts.Product, fullMark: 20 },
        { subject: 'Executives', count: roleCounts.Executives, fullMark: 20 },
    ];
}

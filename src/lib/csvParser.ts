import Papa from 'papaparse';
import { Node, Link } from '../context/DataContext'; // Reuse types

export interface ParseResult {
    nodes: Node[];
    links: Link[];
    type: 'contact' | 'account' | 'unknown';
}

export const parseCSVData = (csvContent: string): ParseResult => {
    const { data, meta } = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
    });

    const headers = meta.fields || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = data as any[];

    // Detect type based on headers
    // Contacts usually have firstName, lastName, accountId
    // Accounts usually have billingAddressCity or just name and website
    const isContact = headers.includes('firstName') || headers.includes('lastName');
    const isAccount = !isContact && (headers.includes('billingAddressCity') || headers.includes('website'));

    const nodes: Node[] = [];
    const links: Link[] = [];

    rows.forEach((row) => {
        if (!row.id) return; // Skip rows without ID

        if (isAccount) {
            nodes.push({
                id: row.id,
                name: row.name || 'Unknown Company',
                group: 'company',
                val: 25, // Larger size for companies
                ...row
            });
        } else if (isContact) {
            const fullName = `${row.firstName || ''} ${row.lastName || ''}`.trim() || row.name;
            nodes.push({
                id: row.id,
                name: fullName,
                group: 'person',
                val: 15,
                role: row.title || row.description, // Use title as role if available
                ...row
            });

            // Link to Account if present
            if (row.accountId) {
                // Ensure the account node exists? We can create a placeholder if we want,
                // but usually we might import accounts first.
                // For now, let's just create the link. The graph visualization handles missing nodes gracefully usually,
                // or we can add a placeholder node.

                // Let's add a placeholder node for the account if we don't know it exists?
                // Actually, duplicate nodes are filtered by `addGraphData`, so we can safely add a placeholder account node here.
                if (row.accountName) {
                     nodes.push({
                        id: row.accountId,
                        name: row.accountName,
                        group: 'company',
                        val: 25,
                        placeholder: true, // Mark as placeholder
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ...({} as any)
                    });
                }

                links.push({
                    source: row.id, // Person
                    target: row.accountId // Company
                });
            }
        }
    });

    return {
        nodes,
        links,
        type: isContact ? 'contact' : (isAccount ? 'account' : 'unknown')
    };
};

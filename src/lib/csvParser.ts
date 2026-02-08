import Papa from 'papaparse';
import { Node, Link } from '../types/graph';

export interface ParseResult {
    nodes: Node[];
    links: Link[];
    type: 'contact' | 'account' | 'unknown';
}

interface CSVRow {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    accountId?: string;
    accountName?: string;
    title?: string;
    description?: string;
    billingAddressCity?: string;
    website?: string;
    [key: string]: string | undefined;
}

export const parseCSVData = (csvContent: string): ParseResult => {
    const { data, meta } = Papa.parse<CSVRow>(csvContent, {
        header: true,
        skipEmptyLines: true,
    });

    const headers = meta.fields || [];
    const rows = data;

    // Detect type based on headers
    // Contacts usually have firstName, lastName, accountId
    // Accounts usually have billingAddressCity or just name and website
    const isContact = headers.includes('firstName') || headers.includes('lastName') || headers.includes('role') || headers.includes('title');
    const isAccount = !isContact && (headers.includes('billingAddressCity') || headers.includes('website'));

    const nodes: Node[] = [];
    const links: Link[] = [];

    rows.forEach((row) => {
        if (!row.id) return; // Skip rows without ID

        if (isAccount) {
            nodes.push({
                ...row,
                id: row.id,
                name: row.name || 'Unknown Company',
                group: 'company',
                val: 25, // Larger size for companies
            });
        } else if (isContact) {
            const fullName = `${row.firstName || ''} ${row.lastName || ''}`.trim() || row.name || 'Unknown Person';
            nodes.push({
                ...row,
                id: row.id,
                name: fullName,
                group: 'person',
                val: 15,
                email: row.email || row.emailAddress,
                role: row.role || row.title || row.description, // Use title as role if available
            });

            // Link to Account if present
            if (row.accountId) {
                // If accountName exists, create a placeholder node for the account
                if (row.accountName) {
                     nodes.push({
                        id: row.accountId,
                        name: row.accountName,
                        group: 'company',
                        val: 25,
                        placeholder: true, // Mark as placeholder
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

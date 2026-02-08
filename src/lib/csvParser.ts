import Papa from 'papaparse';
import { Node, Link } from '../context/DataContext';

export interface ParseResult {
    nodes: Node[];
    links: Link[];
    type: 'contact' | 'account' | 'unknown';
}

interface CSVBaseRow {
    id: string;
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Allow extra properties for spread into Node
}

interface CSVContactRow extends CSVBaseRow {
    firstName?: string;
    lastName?: string;
    title?: string;
    description?: string;
    accountId?: string;
    accountName?: string;
}

interface CSVAccountRow extends CSVBaseRow {
    billingAddressCity?: string;
    website?: string;
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
    const isContact = headers.includes('firstName') || headers.includes('lastName');
    const isAccount = !isContact && (headers.includes('billingAddressCity') || headers.includes('website'));

    const nodes: Node[] = [];
    const links: Link[] = [];

    if (isContact) {
        const contactRows = rows as CSVContactRow[];
        contactRows.forEach((row) => {
            if (!row.id) return;

            const fullName = `${row.firstName || ''} ${row.lastName || ''}`.trim() || row.name || '';

            nodes.push({
                name: fullName,
                group: 'person',
                val: 15,
                role: row.title || row.description,
                ...row
            });

            if (row.accountId) {
                if (row.accountName) {
                    nodes.push({
                        id: row.accountId,
                        name: row.accountName,
                        group: 'company',
                        val: 25,
                        placeholder: true,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ...({} as any)
                    });
                }

                links.push({
                    source: row.id,
                    target: row.accountId
                });
            }
        });
    } else if (isAccount) {
        const accountRows = rows as CSVAccountRow[];
        accountRows.forEach((row) => {
            if (!row.id) return;

            nodes.push({
                name: row.name || 'Unknown Company',
                group: 'company',
                val: 25,
                ...row
            });
        });
    }

    return {
        nodes,
        links,
        type: isContact ? 'contact' : (isAccount ? 'account' : 'unknown')
    };
};

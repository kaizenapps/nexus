import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseCSVData } from '../src/lib/csvParser';
import { Node, Link } from '../src/types/graph';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvDir = path.join(__dirname, '../csv_exports');
const outDir = path.join(__dirname, '../src/data');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

try {
    const accountsPath = path.join(csvDir, 'Export_Account.csv');
    const contactsPath = path.join(csvDir, 'Export_Contact.csv');

    if (!fs.existsSync(accountsPath) || !fs.existsSync(contactsPath)) {
        console.warn("CSV files not found in csv_exports. Skipping seed generation.");
        // Create empty data file so build doesn't fail if it imports this
        fs.writeFileSync(path.join(outDir, 'initialData.json'), JSON.stringify({ nodes: [], links: [] }, null, 2));
        process.exit(0);
    }

    const accountsRaw = fs.readFileSync(accountsPath, 'utf-8');
    const contactsRaw = fs.readFileSync(contactsPath, 'utf-8');

    const accountsResult = parseCSVData(accountsRaw);
    const contactsResult = parseCSVData(contactsRaw);

    // Merge nodes and links
    // Note: contactsResult.nodes might contain placeholder company nodes created from accountId.
    // If we have the real company node from accountsResult, we might have duplicates.
    // We should filter out placeholders if a real node exists with the same ID.

    const realCompanyIds = new Set(accountsResult.nodes.map(n => n.id));

    // Filter out placeholder nodes from contactsResult if the real node exists
    const contactsNodesFiltered = contactsResult.nodes.filter(n => {
        if (n.placeholder && realCompanyIds.has(n.id)) {
            return false; // Skip placeholder, we have the real deal
        }
        return true;
    });

    const nodes: Node[] = [...accountsResult.nodes, ...contactsNodesFiltered];
    const links: Link[] = [...accountsResult.links, ...contactsResult.links];

    // Post-processing: Link contacts to accounts by name if not linked by ID (and no link created yet)
    // parseCSVData creates link if accountId is present.
    // We need to handle cases where accountId is missing but accountName is present.

    contactsNodesFiltered.forEach(node => {
        if (node.group === 'person' && node.accountName && !node.accountId) {
             // Try to find account by name
             const account = nodes.find(n => n.group === 'company' && n.name === node.accountName);
             if (account) {
                 // Check if link already exists
                 const exists = links.some(l =>
                    (l.source === node.id && l.target === account.id) ||
                    ((l.source as any).id === node.id && (l.target as any).id === account.id)
                 );

                 if (!exists) {
                     links.push({
                         source: node.id,
                         target: account.id
                     });
                 }
             }
        }
    });

    const graphData = { nodes, links };

    fs.writeFileSync(path.join(outDir, 'initialData.json'), JSON.stringify(graphData, null, 2));
    console.log(`Successfully generated seed data with ${nodes.length} nodes and ${links.length} links.`);

} catch (err) {
    console.error("Error generating seed data:", err);
    process.exit(1);
}

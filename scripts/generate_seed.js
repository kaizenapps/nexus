import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvDir = path.join(__dirname, '../csv_exports');
const outDir = path.join(__dirname, '../src/data');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

function parseCSV(content) {
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV parser (handles quoted strings roughly)
        const values = [];
        let inQuote = false;
        let currentValue = '';

        for (let char of line) {
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                values.push(currentValue.trim().replace(/^"|"$/g, ''));
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        values.push(currentValue.trim().replace(/^"|"$/g, ''));

        const entry = {};
        headers.forEach((header, index) => {
            entry[header] = values[index] || '';
        });
        data.push(entry);
    }
    return data;
}

try {
    const accountsRaw = fs.readFileSync(path.join(csvDir, 'Export_Account.csv'), 'utf-8');
    const contactsRaw = fs.readFileSync(path.join(csvDir, 'Export_Contact.csv'), 'utf-8');

    const accounts = parseCSV(accountsRaw);
    const contacts = parseCSV(contactsRaw);

    const nodes = [];
    const links = [];

    const accountMap = new Map();

    // Process Accounts
    accounts.forEach(acc => {
        if (!acc.name) return;
        const id = acc.id || `acc-${Math.random()}`;
        nodes.push({
            id: id,
            name: acc.name,
            group: 'company',
            val: 20, // Size
            industry: acc.industry,
            website: acc.website,
            description: acc.description || 'Imported Account'
        });
        accountMap.set(acc.name, id);
    });

    // Process Contacts
    contacts.forEach(con => {
        if (!con.name) return;
        const contactId = con.id || `con-${Math.random()}`;
        nodes.push({
            id: contactId,
            name: con.name,
            group: 'person',
            val: 10, // Smaller size for people
            email: con.emailAddress,
            role: con.title || 'Contact',
            description: con.description || 'Imported Contact'
        });

        // Link to Account if exists
        // Note: CSV has accountId or accountName. We'll try to match by ID first, then Name.
        // The CSV header has 'accountId' and 'accountName'
        if (con.accountId) {
            links.push({
                source: contactId,
                target: con.accountId
            });
        } else if (con.accountName) {
            // Try to find account by name
            const accId = accountMap.get(con.accountName);
            if (accId) {
                links.push({
                    source: contactId,
                    target: accId
                });
            }
        }
    });

    const graphData = { nodes, links };

    fs.writeFileSync(path.join(outDir, 'initialData.json'), JSON.stringify(graphData, null, 2));
    console.log(`Successfully generated seed data with ${nodes.length} nodes and ${links.length} links.`);

} catch (err) {
    console.error("Error generating seed data:", err);
}

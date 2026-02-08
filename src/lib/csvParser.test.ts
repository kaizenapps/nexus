import { describe, it, expect } from 'vitest';
import { parseCSVData } from './csvParser';

describe('parseCSVData', () => {
    it('should parse Account CSV', () => {
        const csv = `id,name,website,billingAddressCity
1,Company A,http://a.com,New York
2,Company B,http://b.com,London`;

        const result = parseCSVData(csv);

        expect(result.type).toBe('account');
        expect(result.nodes.length).toBe(2);
        expect(result.nodes[0].name).toBe('Company A');
        expect(result.nodes[0].group).toBe('company');
        expect(result.links.length).toBe(0);
    });

    it('should parse Contact CSV and link to Accounts', () => {
        const csv = `id,firstName,lastName,accountId,accountName
101,John,Doe,1,Company A
102,Jane,Smith,2,Company B`;

        const result = parseCSVData(csv);

        expect(result.type).toBe('contact');
        // 2 people + 2 placeholder companies = 4 nodes
        expect(result.nodes.length).toBe(4);

        const person1 = result.nodes.find(n => n.id === '101');
        expect(person1).toBeDefined();
        expect(person1?.name).toBe('John Doe');
        expect(person1?.group).toBe('person');

        const company1 = result.nodes.find(n => n.id === '1');
        expect(company1).toBeDefined();
        expect(company1?.name).toBe('Company A');
        expect(company1?.group).toBe('company');

        expect(result.links.length).toBe(2);
        expect(result.links[0]).toEqual({ source: '101', target: '1' });
    });

    it('should handle missing accountId in Contact CSV', () => {
        const csv = `id,firstName,lastName,accountId
101,John,Doe,`;

        const result = parseCSVData(csv);

        expect(result.type).toBe('contact');
        expect(result.nodes.length).toBe(1);
        expect(result.links.length).toBe(0);
    });

    it('should handle name and role fields as Contact', () => {
        const csv = `id,name,role
101,John Doe,Developer`;

        const result = parseCSVData(csv);

        expect(result.type).toBe('contact');
        expect(result.nodes.length).toBe(1);
        const person = result.nodes[0];
        expect(person.name).toBe('John Doe');
        expect(person.role).toBe('Developer');
        expect(person.group).toBe('person');
    });
});

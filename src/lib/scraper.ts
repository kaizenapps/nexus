export interface ScrapedResult {
    title: string;
    url: string;
    snippet: string;
    source: 'google' | 'linkedin' | 'crunchbase' | 'other';
}

const APIFY_TOKEN = "apify_api_jWphHucgipgh1zcqdkMGlAyXqq6Rjo2NxYvs";

export async function scrapeGoogle(query: string): Promise<ScrapedResult[]> {
    console.log(`[Scraper] Searching Google for: ${query}`);

    // Use apify/google-search-scraper
    try {
        const response = await fetch(`https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                queries: [query],
                maxPagesPerQuery: 1,
                resultsPerPage: 5
            })
        });

        const data = await response.json();

        // Map Apify Google results to our format
        return Array.isArray(data) ? data.flatMap((item: any) =>
            item.organicResults ? item.organicResults.map((res: any) => ({
                title: res.title,
                url: res.url,
                snippet: res.description,
                source: 'google'
            })) : []
        ) : [];

    } catch (error) {
        console.error("Google Scrape failed", error);
        return [];
    }
}

export async function scrapeLinkedIn(profileUrl: string): Promise<any> {
    console.log(`[Scraper] Scraping LinkedIn profile: ${profileUrl}`);

    // Use dev_fusion/Linkedin-Profile-Scraper
    try {
        const response = await fetch(`https://api.apify.com/v2/acts/dev_fusion~Linkedin-Profile-Scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                profileUrls: [profileUrl]
            })
        });

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            const profile = data[0];
            return {
                name: profile.fullName || `${profile.firstName} ${profile.lastName}`,
                headline: profile.headline,
                location: profile.addressWithCountry || profile.jobLocation,
                about: profile.about,
                avatar: profile.profilePic,
                connections: profile.connections,
                experience: profile.experiences?.map((exp: any) => ({
                    title: exp.title,
                    company: exp.companyName,
                    duration: exp.currentJobDuration
                })) || []
            };
        }
    } catch (error) {
        console.error("LinkedIn Scrape failed", error);
    }

    return null;
}

export async function findConferences(topic: string, location: string): Promise<any[]> {
    // Reuse Google Search for conferences
    const results = await scrapeGoogle(`${topic} conferences in ${location} 2024 2025`);
    return results.map(r => ({
        name: r.title,
        url: r.url,
        snippet: r.snippet
    }));
}

export async function enrichContact(domain: string): Promise<any> {
    console.log(`[Enrichment] Hunting contacts for domain: ${domain}`);

    const API_KEY = "2ceedb5c63e4c9adb961d56e9e1a6eecdce5b6aa";

    try {
        const response = await fetch(`https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${API_KEY}`);
        const data = await response.json();

        if (data.data) {
            return data.data;
        }
    } catch (error) {
        console.error("Hunter.io API failed", error);
    }

    return {
        emails: [
            { value: `contact@${domain}`, type: "generic", confidence: 50 } // Fallback
        ]
    };
}

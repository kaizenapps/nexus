interface Env {
    HUNTER_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        let body: { domain?: string; company?: string; firstName?: string; lastName?: string };
        try {
            body = await request.json();
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _ = e;
            return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
        }

        const { domain, company, firstName, lastName } = body;
        const apiKey = env.HUNTER_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({
                success: false,
                error: "Hunter API Key missing in server configuration."
            }), { status: 500 });
        }

        if (!domain && !company) {
             return new Response(JSON.stringify({
                success: false,
                error: "Domain or Company name is required."
            }), { status: 400 });
        }

        let queryParams = `api_key=${apiKey}`;
        if (domain) queryParams += `&domain=${encodeURIComponent(domain)}`;
        else if (company) queryParams += `&company=${encodeURIComponent(company)}`;

        if (firstName && lastName) {
            // Email Finder
            queryParams += `&first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}`;

            const response = await fetch(`https://api.hunter.io/v2/email-finder?${queryParams}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = await response.json();

            return new Response(JSON.stringify(data), {
                headers: { "Content-Type": "application/json" }
            });
        } else {
            // Domain Search
            const response = await fetch(`https://api.hunter.io/v2/domain-search?${queryParams}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = await response.json();

            return new Response(JSON.stringify(data), {
                headers: { "Content-Type": "application/json" }
            });
        }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

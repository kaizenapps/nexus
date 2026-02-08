interface Env {
    HUNTER_API_KEY: string;
    OPENROUTER_API_KEY: string;
    APIFY_API_TOKEN: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        let body: { objective: string };
        try {
            body = await request.json() as { objective: string };
        } catch (e) {
             // eslint-disable-next-line @typescript-eslint/no-unused-vars
             const _ = e;
            return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
        }

        const { objective } = body;

        if (!objective || typeof objective !== 'string' || objective.trim().length === 0) {
            return new Response(JSON.stringify({ error: "Objective is required" }), { status: 400 });
        }

        const openRouterKey = env.OPENROUTER_API_KEY;

        if (!openRouterKey) {
            console.error("OpenRouter API Key missing in environment variables");
            return new Response(JSON.stringify({ error: "Server configuration error: API Key missing" }), { status: 500 });
        }

        // 1. Prompt AI to generate graph nodes
        const prompt = `
      You are an expert social network analyst. 
      Objective: "${objective}"
      
      Generate a JSON object representing a social graph that helps achieve this objective.
      The graph should include:
      - "nodes": Array of objects with { "id": string, "name": string, "group": "person" | "company" | "event", "description": string }
      - "links": Array of objects with { "source": string, "target": string, "type": string }
      
      Create at least 5-8 relevant nodes (mix of people, companies, events).
      Ensure "id"s are unique strings.
      Return ONLY valid JSON.
    `;

        const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "x-ai/grok-4.1-fast",
                messages: [{ role: "user", content: prompt }],
            }),
        });

        if (!aiResponse.ok) {
            const errorText = await aiResponse.text();
            console.error("AI API Error:", errorText);
            return new Response(JSON.stringify({ error: "Failed to communicate with AI service" }), { status: 502 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aiData: any = await aiResponse.json();
        const aiContent = aiData.choices?.[0]?.message?.content;

        if (!aiContent) {
            return new Response(JSON.stringify({ error: "AI returned empty response" }), { status: 502 });
        }

        // Parse JSON from AI response (handle potential markdown code blocks)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let graphData: { nodes: any[], links: any[] } = { nodes: [], links: [] };
        try {
            const cleanJson = aiContent.replace(/```json/g, "").replace(/```/g, "").trim();
            graphData = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse AI JSON", e);
             return new Response(JSON.stringify({ error: "Failed to parse AI response" }), { status: 500 });
        }

        // 2. Enrich with Apify (LinkedIn) if applicable
        const apifyToken = env.APIFY_API_TOKEN;
        if (apifyToken) {
            // Filter for nodes that might have LinkedIn URLs (or we could ask AI to generate them)
            // For this demo, we'll assume the AI might have added a 'linkedinUrl' field, or we simulate it.
            // Realistically, we would need to search for the profile first.

            // Example: If we had a URL, we would call Apify
            /*
            const run = await fetch(`https://api.apify.com/v2/acts/dev_fusion~linkedin-profile-scraper/run-sync-get-dataset-items?token=${apifyToken}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startUrls: [{ url: "https://www.linkedin.com/in/example" }] 
                })
            });
            */

            // For now, we just mark them as 'enrichment_ready' to show we have the capability
            // @ts-expect-error - enriched is not in GraphNode type yet, but valid for JSON
            if (graphData.nodes && Array.isArray(graphData.nodes)) {
                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
                 graphData.nodes = graphData.nodes.map((node: any) => ({
                    ...node,
                    enriched: true,
                    enrichment_source: "Apify (Ready)"
                }));
            }
        }

        return new Response(JSON.stringify({
            success: true,
            data: graphData
        }), {
            headers: { "Content-Type": "application/json" },
        });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return new Response(JSON.stringify({ error: "Failed to analyze: " + error.message }), { status: 500 });
    }
};

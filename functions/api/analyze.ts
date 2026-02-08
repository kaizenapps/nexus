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
      - "nodes": Array of objects with { "id": string, "name": string, "group": "person" | "company" | "event", "description": string, "linkedinUrl"?: string }
      - "links": Array of objects with { "source": string, "target": string, "type": string }
      
      Create at least 5-8 relevant nodes (mix of people, companies, events).
      For 'person' nodes, try to infer a plausible 'linkedinUrl' if appropriate (e.g., https://www.linkedin.com/in/name).
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
        if (apifyToken && graphData.nodes && Array.isArray(graphData.nodes)) {
            // Filter for nodes that have LinkedIn URLs
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nodesWithLinkedin = graphData.nodes.filter((node: any) => node.linkedinUrl && typeof node.linkedinUrl === 'string' && node.linkedinUrl.includes('linkedin.com'));

            if (nodesWithLinkedin.length > 0) {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const startUrls = nodesWithLinkedin.map((node: any) => ({ url: node.linkedinUrl }));

                    const apifyResponse = await fetch(`https://api.apify.com/v2/acts/dev_fusion~linkedin-profile-scraper/run-sync-get-dataset-items?token=${apifyToken}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            startUrls: startUrls
                        })
                    });

                    if (apifyResponse.ok) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const enrichedData: any[] = await apifyResponse.json();

                        // Map enriched data back to nodes
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        graphData.nodes = graphData.nodes.map((node: any) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const enrichedInfo = enrichedData.find((item: any) => item.input?.url === node.linkedinUrl);
                            if (enrichedInfo) {
                                return {
                                    ...node,
                                    headline: enrichedInfo.headline,
                                    summary: enrichedInfo.summary,
                                    profilePic: enrichedInfo.profilePic,
                                    enriched: true,
                                    enrichment_source: "Apify (LinkedIn)"
                                };
                            }
                            return node;
                        });
                    } else {
                        console.error("Apify API Error:", await apifyResponse.text());
                    }
                } catch (e) {
                    console.error("Failed to enrich with Apify", e);
                    // Continue without enrichment
                }
            } else {
                 // Just mark as ready if no URLs found but token exists
                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
                 graphData.nodes = graphData.nodes.map((node: any) => ({
                    ...node,
                    enriched: false,
                    enrichment_source: "Apify (Ready - No URL)"
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

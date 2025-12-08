import { X, MapPin, Building, Mail, Linkedin, Link as LinkIcon, Sparkles, Plus, CircleDashed } from "lucide-react";
import { useData } from "../../context/DataContext";
import { useState } from "react";

interface NodeDetailsProps {
    node: any;
    onClose: () => void;
}

export default function NodeDetailsPanel({ node, onClose }: NodeDetailsProps) {
    const { graphData, setGraphData } = useData();
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectSearch, setConnectSearch] = useState("");
    const [isEnriching, setIsEnriching] = useState(false);

    if (!node) return null;

    const handleConnect = (targetNode: any, type: 'solid' | 'proposed') => {
        setGraphData(prev => ({
            ...prev,
            links: [...prev.links, { source: node.id, target: targetNode.id, type }]
        }));
        setIsConnecting(false);
        setConnectSearch("");
        alert(`Connected to ${targetNode.name} (${type === 'proposed' ? 'Proposed' : 'Solid'})`);
    };

    const handleEnrich = async () => {
        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
        if (!apiKey) {
            alert("OpenRouter API Key not configured.");
            return;
        }

        setIsEnriching(true);
        const prompt = `Enrich this entity: ${node.name} (${node.group}). Provide JSON with: industry (string), role (string), description (short string).`;

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "x-ai/grok-beta",
                    "messages": [
                        { "role": "system", "content": "You are a data enrichment assistant. Output strictly valid JSON." },
                        { "role": "user", "content": prompt }
                    ]
                })
            });

            const data = await response.json();
            const content = data.choices[0]?.message?.content;

            // Clean markdown code blocks if present
            const cleanContent = content.replace(/```json\n?|```/g, '');
            const enriched = JSON.parse(cleanContent);

            setGraphData(prev => ({
                ...prev,
                nodes: prev.nodes.map(n => n.id === node.id ? { ...n, ...enriched } : n)
            }));
            alert("Enrichment complete!");

        } catch (error) {
            console.error("Enrichment failed:", error);
            alert("Enrichment failed. See console.");
        } finally {
            setIsEnriching(false);
        }
    };

    const filteredConnectNodes = isConnecting ? graphData.nodes.filter(n =>
        n.id !== node.id &&
        (n.name.toLowerCase().includes(connectSearch.toLowerCase()) ||
            (n.role && n.role.toLowerCase().includes(connectSearch.toLowerCase())))
    ).slice(0, 5) : [];

    return (
        <div className="absolute right-4 top-4 bottom-4 w-96 bg-[#0B1120]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold
                    ${node.group === 'person' ? 'bg-blue-500/20 text-blue-400' :
                        node.group === 'company' ? 'bg-purple-500/20 text-purple-400' :
                            node.group === 'event' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {node.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">{node.name}</h2>
                    <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                        {node.group.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={handleEnrich}
                    disabled={isEnriching}
                    className="flex-1 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 rounded-lg text-blue-300 text-sm font-medium flex items-center justify-center gap-2 transition-all">
                    <Sparkles className="h-4 w-4" />
                    {isEnriching ? "Enriching..." : "Enrich Data"}
                </button>
            </div>

            {/* Connection UI */}
            <div className="mb-6">
                {!isConnecting ? (
                    <button
                        onClick={() => setIsConnecting(true)}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-sm font-medium flex items-center justify-center gap-2 transition-all">
                        <LinkIcon className="h-4 w-4" />
                        Connect New Entity
                    </button>
                ) : (
                    <div className="space-y-2 bg-black/20 p-3 rounded-lg border border-white/5">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-400">Connect to...</span>
                            <button onClick={() => setIsConnecting(false)} className="text-xs text-gray-500 hover:text-white"><X className="h-3 w-3" /></button>
                        </div>
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search entities..."
                            value={connectSearch}
                            onChange={(e) => setConnectSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                            {filteredConnectNodes.map(target => (
                                <div key={target.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded group">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-200">{target.name}</span>
                                        <span className="text-xs text-gray-500">{target.role || target.group}</span>
                                    </div>
                                    <div className="flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleConnect(target, 'solid')}
                                            title="Solid Connection"
                                            className="p-1.5 bg-green-500/20 hover:bg-green-500/40 text-green-400 rounded">
                                            <Plus className="h-3 w-3" />
                                        </button>
                                        <button
                                            onClick={() => handleConnect(target, 'proposed')}
                                            title="Proposed Link (Dotted)"
                                            className="p-1.5 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 rounded">
                                            <CircleDashed className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {connectSearch && filteredConnectNodes.length === 0 && (
                                <p className="text-xs text-center text-gray-500 py-2">No matches found</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Details List */}
            <div className="space-y-4">
                {node.role && (
                    <div className="flex gap-3 text-sm">
                        <Building className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Role / Industry</p>
                            <p className="text-gray-200">{node.role} {node.industry ? `• ${node.industry}` : ''}</p>
                        </div>
                    </div>
                )}

                {node.description && (
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-sm leading-relaxed text-gray-300">
                        {node.description}
                    </div>
                )}

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {node.location && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <MapPin className="h-3 w-3" />
                            {node.location}
                        </div>
                    )}
                    {node.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{node.email}</span>
                        </div>
                    )}
                    {node.linkedin && (
                        <a href={node.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 col-span-2">
                            <Linkedin className="h-3 w-3" />
                            LinkedIn Profile
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

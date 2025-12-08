import { useState, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import GraphCanvas from "../components/graph/GraphCanvas";
import NodeDetailsPanel from "../components/graph/NodeDetailsPanel";
import { useData } from '../context/DataContext';

export default function GraphExplorer() {
    const { graphData, setGraphData } = useData();
    const [searchParams] = useSearchParams();
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [isObjectiveMode, setIsObjectiveMode] = useState(false);
    const [objective, setObjective] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check for search param
        const search = searchParams.get('search');
        if (search) {
            setObjective(search);
            setIsObjectiveMode(true); // Enable search mode automatically
        }

        // Initial mock data if empty
        if (graphData.nodes.length === 0) {
            const mockData = {
                nodes: [
                    { id: '1', name: 'Preston Zen', group: 'person', val: 20, lat: 37.7749, lng: -122.4194 },
                    { id: '2', name: 'Kaizen Apps', group: 'company', val: 30, lat: 37.7849, lng: -122.4094 },
                    { id: '3', name: 'AI Conference 2024', group: 'event', val: 15, lat: 37.7649, lng: -122.4294 },
                ],
                links: [
                    { source: '1', target: '2' },
                    { source: '1', target: '3' },
                ]
            };
            setGraphData(mockData);
        }
    }, []);

    const handleAnalyze = async () => {
        if (!objective.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ objective })
            });

            const data = await res.json();
            if (data.success && data.data) {
                // Merge new nodes/links with existing graph instead of replacing
                setGraphData(prev => {
                    const existingNodeIds = new Set(prev.nodes.map(n => n.id));
                    const newNodes = data.data.nodes.filter((n: any) => !existingNodeIds.has(n.id));

                    // Mark new links as 'proposed' for dotted lines
                    const newLinks = data.data.links.map((l: any) => ({ ...l, type: 'proposed' }));

                    return {
                        nodes: [...prev.nodes, ...newNodes],
                        links: [...prev.links, ...newLinks]
                    };
                });
                alert(`Analysis complete. Added ${data.data.nodes.length} entities.`);
            } else {
                console.error("Analysis failed", data.error);
            }
        } catch (error) {
            console.error("API Error", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full w-full relative bg-[#0B1120]">
            <div className="absolute inset-0">
                <GraphCanvas onNodeClick={setSelectedNode} data={graphData} searchTerm={objective} />
            </div>

            {selectedNode && (
                <NodeDetailsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
            )}

            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-2xl z-10 px-4 pointer-events-none">
                <div className="pointer-events-auto flex items-center space-x-3 bg-[#0B1120]/90 backdrop-blur-xl p-3 rounded-xl border-2 border-white/20 shadow-2xl transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    <div className="text-muted-foreground ml-1">
                        {isLoading ? <Sparkles className="h-6 w-6 text-purple-400 animate-spin" /> : (isObjectiveMode ? <Sparkles className="h-6 w-6 text-purple-400" /> : <Search className="h-6 w-6 text-white/70" />)}
                    </div>
                    <input
                        type="text"
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                        placeholder={isObjectiveMode ? "Describe your objective (e.g. 'Find Series A Investors in NYC')..." : "Search people, companies, events..."}
                        className="bg-transparent border-none focus:ring-0 text-white text-lg w-full placeholder:text-gray-500 h-10 font-medium"
                        disabled={isLoading}
                    />

                    {/* Toggle Button */}
                    <button
                        onClick={() => {
                            if (isObjectiveMode) {
                                // If mode is on, toggle it OFF
                                setIsObjectiveMode(false);
                                setObjective(""); // Clear search when toggling off
                            } else {
                                // If mode is off, toggle it ON
                                setIsObjectiveMode(true);
                            }
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 border-2 flex items-center gap-2 ${isObjectiveMode
                            ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:bg-purple-500"
                            : "bg-white/10 border-white/20 text-gray-300 hover:text-white hover:bg-white/20 hover:border-white/40"
                            }`}
                    >
                        <Sparkles className="h-4 w-4" />
                        {isObjectiveMode ? "Nexus Mode Active" : "Nexus Mode"}
                    </button>

                    {/* Run Button (Only visible in Nexus Mode) */}
                    {isObjectiveMode && (
                        <button
                            onClick={handleAnalyze}
                            disabled={!objective.trim() || isLoading}
                            className="px-4 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Run
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import { Search, Filter, Plus, ZoomIn, ZoomOut, Maximize, Sparkles } from "lucide-react";
import GraphCanvas from "../components/graph/GraphCanvas";
import NodeDetailsPanel from "../components/graph/NodeDetailsPanel";

export default function Dashboard() {
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [graphData, setGraphData] = useState<any>({ nodes: [], links: [] });
    const [isObjectiveMode, setIsObjectiveMode] = useState(false);

    useEffect(() => {
        // Fetch mock data for now, replacing API call
        const mockData = {
            nodes: [
                { id: '1', type: 'person', label: 'Preston Zen', lat: 37.7749, lng: -122.4194 },
                { id: '2', type: 'company', label: 'Kaizen Apps', lat: 37.7849, lng: -122.4094 },
                { id: '3', type: 'event', label: 'AI Conference 2024', lat: 37.7649, lng: -122.4294 },
            ],
            links: [
                { source: '1', target: '2', type: 'founder' },
                { source: '1', target: '3', type: 'attending' },
            ]
        };
        setGraphData(mockData);
    }, []);

    return (
        <div className="h-full w-full relative bg-[#0B1120]">
            <div className="absolute inset-0">
                <GraphCanvas onNodeClick={setSelectedNode} data={graphData} />
            </div>

            {selectedNode && (
                <NodeDetailsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
            )}

            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                <div className="pointer-events-auto flex items-center space-x-2 bg-secondary/80 backdrop-blur-md p-2 rounded-lg border border-white/10 shadow-lg w-full max-w-xl transition-all duration-300 focus-within:bg-secondary focus-within:border-primary/50">
                    <div className="text-muted-foreground ml-2">
                        {isObjectiveMode ? <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" /> : <Search className="h-5 w-5" />}
                    </div>
                    <input
                        type="text"
                        placeholder={isObjectiveMode ? "Describe your objective (e.g. 'Find Series A Investors in NYC')..." : "Search people, companies, events..."}
                        className="bg-transparent border-none focus:ring-0 text-foreground w-full placeholder:text-muted-foreground/50 h-9"
                    />
                    <button
                        onClick={() => setIsObjectiveMode(!isObjectiveMode)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border flex items-center gap-1.5 ${isObjectiveMode
                            ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]"
                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                            }`}
                    >
                        <Sparkles className="h-3 w-3" />
                        AI Objective
                    </button>
                </div>
            </div>
        </div>
    );
}

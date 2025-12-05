"use client";

import { useState, ReactNode } from "react";
import { Search, Filter, Plus, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import GraphCanvas from "./graph-wrapper";
import NodeDetailsPanel from "@/components/graph/NodeDetailsPanel";

export default function DashboardPage() {
    const [selectedNode, setSelectedNode] = useState<any>(null);

    return (
        <div className="h-full w-full relative bg-[#0B1120]">
            {/* Graph Canvas */}
            <div className="absolute inset-0">
                <GraphCanvas onNodeClick={setSelectedNode} />
            </div>

            {/* Node Details Panel */}
            {selectedNode && (
                <NodeDetailsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
            )}

            {/* Top Control Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                <div className="pointer-events-auto flex items-center space-x-2 bg-secondary/80 backdrop-blur-md p-2 rounded-lg border border-white/10 shadow-lg w-full max-w-xl">
                    <Search className="h-5 w-5 text-muted-foreground ml-2" />
                    <input
                        type="text"
                        placeholder="Enter objective (e.g., 'Connect with AI researchers in SF')..."
                        className="bg-transparent border-none focus:ring-0 text-foreground w-full placeholder:text-muted-foreground/50"
                    />
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
                        Analyze
                    </button>
                </div>

                <div className="pointer-events-auto flex items-center space-x-4">
                    {/* Distance Filter */}
                    <div className="bg-secondary/80 backdrop-blur-md p-2 rounded-lg border border-white/10 flex items-center space-x-3 px-4">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Distance</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            className="w-24 accent-primary h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-foreground font-mono">50km</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button className="p-2 bg-secondary/80 backdrop-blur-md rounded-lg border border-white/10 hover:bg-white/10 text-foreground transition-colors">
                            <Filter className="h-5 w-5" />
                        </button>
                        <button className="p-2 bg-primary text-white rounded-lg shadow-lg hover:bg-primary/90 transition-colors">
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col space-y-2 pointer-events-auto z-10">
                <ControlBtn icon={<ZoomIn className="h-5 w-5" />} />
                <ControlBtn icon={<ZoomOut className="h-5 w-5" />} />
                <ControlBtn icon={<Maximize className="h-5 w-5" />} />
            </div>
        </div>
    );
}

function ControlBtn({ icon }: { icon: ReactNode }) {
    return (
        <button className="p-2 bg-secondary/80 backdrop-blur-md rounded-lg border border-white/10 text-foreground hover:bg-white/10 shadow-lg transition-colors">
            {icon}
        </button>
    );
}

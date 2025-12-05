"use client";

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ForceGraph2D with no SSR
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-white/50">Loading Graph...</div>
});

interface GraphData {
    nodes: any[];
    links: any[];
}

interface GraphCanvasProps {
    onNodeClick?: (node: any) => void;
}

export default function GraphCanvas({ onNodeClick }: GraphCanvasProps) {
    const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch initial graph data
        fetch('/api/graph')
            .then(res => res.json())
            .then(data => {
                // Map edges to links for react-force-graph
                const graphData = {
                    nodes: data.nodes,
                    links: data.edges || []
                };
                setData(graphData);
            })
            .catch(err => console.error("Failed to fetch graph data", err));

        // Handle resize
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full bg-[#0B1120]">
            <ForceGraph2D
                width={dimensions.width}
                height={dimensions.height}
                graphData={data}
                nodeLabel="label"
                nodeColor={(node: any) => {
                    if (node.type === 'person') return '#3b82f6'; // Blue
                    if (node.type === 'company') return '#ef4444'; // Red
                    if (node.type === 'event') return '#10b981'; // Green
                    return '#9ca3af';
                }}
                nodeRelSize={6}
                linkColor={() => 'rgba(255,255,255,0.2)'}
                backgroundColor="#0B1120"
                onNodeClick={(node) => {
                    console.log("Clicked node:", node);
                    if (onNodeClick) onNodeClick(node);
                }}
            />
        </div>
    );
}

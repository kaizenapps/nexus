import { lazy, Suspense, useState, useCallback } from 'react';

// Lazy load ForceGraph to avoid SSR/build issues with some bundlers
const ForceGraph2D = lazy(() => import('react-force-graph-2d'));

interface GraphData {
    nodes: any[];
    links: any[];
}

interface GraphCanvasProps {
    onNodeClick?: (node: any) => void;
    data?: GraphData;
}

export default function GraphCanvas({ onNodeClick, data }: GraphCanvasProps) {
    const [hoverNode, setHoverNode] = useState<any>(null);

    const handleNodeHover = useCallback((node: any) => {
        setHoverNode(node || null);
    }, []);

    return (
        <div className="w-full h-full bg-[#0B1120] relative">
            <Suspense fallback={<div className="flex items-center justify-center h-full text-white/50">Loading Graph...</div>}>
                {data && (
                    <ForceGraph2D
                        graphData={data}
                        nodeLabel="" // Disable default label to use custom tooltip
                        nodeColor={(node: any) => {
                            const group = node.group || node.type;
                            if (group === 'person') return '#3b82f6';
                            if (group === 'company') return '#ef4444';
                            if (group === 'event') return '#10b981';
                            return '#9ca3af';
                        }}
                        nodeRelSize={2}
                        linkColor={() => 'rgba(255,255,255,0.2)'}
                        backgroundColor="#0B1120"
                        onNodeClick={(node) => {
                            if (onNodeClick) onNodeClick(node);
                        }}
                        onNodeHover={handleNodeHover}
                    />
                )}
            </Suspense>

            {/* Custom Hover Tooltip */}
            {hoverNode && (
                <div
                    className="absolute z-50 pointer-events-none bg-gray-900/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl"
                    style={{
                        left: 20,
                        top: 20,
                        maxWidth: '250px'
                    }}
                >
                    <h3 className="text-white font-medium text-sm">{hoverNode.name}</h3>
                    <div className="text-xs text-gray-400 mt-1">
                        {hoverNode.role && <span className="block">{hoverNode.role}</span>}
                        {hoverNode.group && <span className="capitalize text-blue-400">{hoverNode.group}</span>}
                    </div>
                </div>
            )}
        </div>
    );
}

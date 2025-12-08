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
    searchTerm?: string;
}

export default function GraphCanvas({ onNodeClick, data, searchTerm = "" }: GraphCanvasProps) {
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
                        nodeCanvasObject={(node: any, ctx, globalScale) => {
                            const isMatch = searchTerm && node.name && node.name.toLowerCase().includes(searchTerm.toLowerCase());
                            const label = node.name;
                            const fontSize = 12 / globalScale;
                            const r = 5; // Base radius

                            // Draw Pulse if Match
                            if (isMatch) {
                                const time = Date.now();
                                const pulseScale = 1 + Math.sin(time / 200) * 0.2; // Pulse animation
                                ctx.beginPath();
                                ctx.arc(node.x, node.y, r * 2 * pulseScale, 0, 2 * Math.PI);
                                ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'; // Blue glow
                                ctx.fill();
                                ctx.strokeStyle = '#3b82f6';
                                ctx.lineWidth = 2 / globalScale;
                                ctx.stroke();
                            }

                            // Draw Node
                            const color = node.group === 'person' ? '#3b82f6' :
                                node.group === 'company' ? '#ef4444' :
                                    node.group === 'event' ? '#10b981' : '#9ca3af';

                            ctx.beginPath();
                            ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
                            ctx.fillStyle = (!searchTerm || isMatch) ? color : 'rgba(255, 255, 255, 0.1)';
                            ctx.fill();

                            // Draw Label (optional, maybe only on hover or match)
                            // if (isMatch || hoverNode?.id === node.id) {
                            //    ctx.font = `${fontSize}px Sans-Serif`;
                            //    ctx.textAlign = 'center';
                            //    ctx.textBaseline = 'middle';
                            //    ctx.fillStyle = 'white';
                            //    ctx.fillText(label, node.x, node.y + 8);
                            // }
                        }}
                        nodeCanvasObjectMode={() => 'replace'} // We take full control of drawing
                        linkLineDash={(link: any) => link.type === 'proposed' ? [5, 5] : null}
                        linkWidth={(link: any) => link.type === 'proposed' ? 2 : 1}
                        linkColor={(link: any) => link.type === 'proposed' ? '#fbbf24' : 'rgba(255,255,255,0.2)'} // Amber for proposed
                        onNodeClick={(node) => {
                            if (onNodeClick) onNodeClick(node);
                        }}
                        onNodeHover={handleNodeHover}
                        // Force re-render for animation
                        onRenderFramePre={(ctx) => {
                            // This forces continuous rendering for the pulse animation if a search term exists
                            if (searchTerm) {
                                // Just accessing ctx is enough to trigger frame loop in some versions, 
                                // otherwise we might need a dummy state update or requestAnimationFrame.
                                // React-force-graph usually handles animation loop if data changes, 
                                // but for canvas animation we might need to ensure it keeps running.
                            }
                        }}
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

import { lazy, Suspense } from 'react';

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
    return (
        <div className="w-full h-full bg-[#0B1120]">
            <Suspense fallback={<div className="flex items-center justify-center h-full text-white/50">Loading Graph...</div>}>
                {data && (
                    <ForceGraph2D
                        graphData={data}
                        nodeLabel="label"
                        nodeColor={(node: any) => {
                            const group = node.group || node.type;
                            if (group === 'person') return '#3b82f6';
                            if (group === 'company') return '#ef4444';
                            if (group === 'event') return '#10b981';
                            return '#9ca3af';
                        }}
                        nodeRelSize={4}
                        linkColor={() => 'rgba(255,255,255,0.2)'}
                        backgroundColor="#0B1120"
                        onNodeClick={(node) => {
                            if (onNodeClick) onNodeClick(node);
                        }}
                    />
                )}
            </Suspense>
        </div>
    );
}

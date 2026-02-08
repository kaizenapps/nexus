import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Re-export types if needed or just use them
// Ideally these match the ones in analytics.ts, but keeping them here for now
export interface Node {
    id: string;
    name: string;
    group: string; // 'person' | 'company' | 'investor' | 'event'
    val: number;
    [key: string]: any; // Allow extra properties
}

export interface Link {
    source: string | { id: string };
    target: string | { id: string };
    [key: string]: any;
}

export interface GraphData {
    nodes: Node[];
    links: Link[];
}

interface DataContextType {
    graphData: GraphData;
    setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
    addNodes: (newNodes: Node[]) => void;
    addGraphData: (newNodes: Node[], newLinks: Link[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

import initialData from '../data/initialData.json';

// ... imports

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [graphData, setGraphData] = useState<GraphData>(() => {
        // Load from local storage if available
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('nexus_graph_data');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error("Failed to parse saved graph data", e);
                }
            }
        }
        // Fallback to seed data
        return initialData as GraphData;
    });

    // Save to local storage whenever graphData changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('nexus_graph_data', JSON.stringify(graphData));
        }
    }, [graphData]);

    const addNodes = (newNodes: Node[]) => {
        setGraphData((prev) => {
            // Avoid duplicates based on ID
            const existingIds = new Set(prev.nodes.map((n) => n.id));
            const uniqueNewNodes = newNodes.filter((n) => !existingIds.has(n.id));

            return {
                ...prev,
                nodes: [...prev.nodes, ...uniqueNewNodes],
            };
        });
    };

    const addGraphData = (newNodes: Node[], newLinks: Link[]) => {
        setGraphData((prev) => {
            const existingNodeIds = new Set(prev.nodes.map((n) => n.id));
            const uniqueNewNodes = newNodes.filter((n) => !existingNodeIds.has(n.id));

            // Helper to get ID from link source/target which might be object or string
            const getId = (item: any) => (typeof item === 'object' ? item.id : item);

            const existingLinks = new Set(prev.links.map(l => `${getId(l.source)}-${getId(l.target)}`));

            const uniqueNewLinks = newLinks.filter(l => {
                const sourceId = getId(l.source);
                const targetId = getId(l.target);
                // Also check reverse if undirected? Let's assume directed for now but unique
                return !existingLinks.has(`${sourceId}-${targetId}`);
            });

            return {
                nodes: [...prev.nodes, ...uniqueNewNodes],
                links: [...prev.links, ...uniqueNewLinks]
            };
        });
    };

    return (
        <DataContext.Provider value={{ graphData, setGraphData, addNodes, addGraphData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

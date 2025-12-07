import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Node {
    id: string;
    name: string;
    group: string; // 'person' | 'company' | 'investor' | 'event'
    val: number;
    [key: string]: any; // Allow extra properties
}

export interface Link {
    source: string;
    target: string;
}

export interface GraphData {
    nodes: Node[];
    links: Link[];
}

interface DataContextType {
    graphData: GraphData;
    setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
    addNodes: (newNodes: Node[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

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
        return { nodes: [], links: [] };
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

    return (
        <DataContext.Provider value={{ graphData, setGraphData, addNodes }}>
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

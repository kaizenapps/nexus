import React, { createContext, useContext, useState, ReactNode } from 'react';

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

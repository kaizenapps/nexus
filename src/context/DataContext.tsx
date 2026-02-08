import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Photo, Tag } from '../types/Gallery';
import { Node, Link, GraphData } from '../types/graph';

interface DataContextType {
    graphData: GraphData;
    setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
    addNodes: (newNodes: Node[]) => void;
    addGraphData: (newNodes: Node[], newLinks: Link[]) => void;

    // Gallery State
    photos: Photo[];
    addPhoto: (photo: Photo) => void;
    addTag: (tag: Tag) => void;
    generatePhotoConnections: () => void;
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

    const [photos, setPhotos] = useState<Photo[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('nexus_photos');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) { console.error(e); }
            }
        }
        return [];
    });

    // Save to local storage whenever graphData changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('nexus_graph_data', JSON.stringify(graphData));
        }
    }, [graphData]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('nexus_photos', JSON.stringify(photos));
        }
    }, [photos]);

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

    const addPhoto = (photo: Photo) => {
        setPhotos(prev => [photo, ...prev]);
    };

    const addTag = (tag: Tag) => {
        setPhotos(prev => prev.map(p => {
            if (p.id === tag.photoId) {
                return { ...p, tags: [...p.tags, tag] };
            }
            return p;
        }));
    };

    const generatePhotoConnections = () => {
        const newLinks: Link[] = [];

        photos.forEach(photo => {
            if (photo.tags.length < 2) return;

            // Create fully connected graph (clique) for tags in the same photo
            for (let i = 0; i < photo.tags.length; i++) {
                for (let j = i + 1; j < photo.tags.length; j++) {
                    newLinks.push({
                        source: photo.tags[i].nodeId,
                        target: photo.tags[j].nodeId,
                        type: 'photo_association',
                        photoId: photo.id
                    });
                }
            }
        });

        if (newLinks.length > 0) {
            addGraphData([], newLinks);
            alert(`Generated ${newLinks.length} new connections from photos.`);
        } else {
            alert("No new connections to generate. Tag more people in the same photos!");
        }
    };

    return (
        <DataContext.Provider value={{
            graphData, setGraphData, addNodes, addGraphData,
            photos, addPhoto, addTag, generatePhotoConnections
        }}>
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

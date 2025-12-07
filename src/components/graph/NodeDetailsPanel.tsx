import { X, MapPin, Building, Calendar, Mail, Linkedin, Link as LinkIcon } from "lucide-react";
import { useData } from "../../context/DataContext";
import { useState } from "react";

interface NodeDetailsProps {
    node: any;
    onClose: () => void;
}

export default function NodeDetailsPanel({ node, onClose }: NodeDetailsProps) {
    const { graphData, setGraphData } = useData();
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectSearch, setConnectSearch] = useState("");

    if (!node) return null;

    const handleConnect = (targetNode: any) => {
        setGraphData(prev => ({
            ...prev,
            links: [...prev.links, { source: node.id, target: targetNode.id }]
        }));
        setIsConnecting(false);
        setConnectSearch("");
    };

    const filteredConnectNodes = isConnecting
        ? graphData.nodes.filter(n =>
            n.id !== node.id &&
            n.name.toLowerCase().includes(connectSearch.toLowerCase())
        ).slice(0, 5)
        : [];

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-background/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out z-50">
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{node.name || node.label}</h2>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${node.group === 'person' ? 'bg-blue-500/20 text-blue-400' :
                            node.group === 'company' ? 'bg-red-500/20 text-red-400' :
                                'bg-green-500/20 text-green-400'
                            }`}>
                            {(node.group || 'unknown').toUpperCase()}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Location */}
                    {node.lat && (
                        <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-5 w-5 mr-3 text-primary" />
                            <span>{node.lat.toFixed(4)}, {node.lng.toFixed(4)}</span>
                        </div>
                    )}

                    {/* Mock Details based on type */}
                    {node.group === 'person' && (
                        <div className="space-y-4">
                            <div className="flex items-center text-muted-foreground">
                                <Building className="h-5 w-5 mr-3" />
                                <span>{node.role || 'Unknown Role'}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Linkedin className="h-5 w-5 mr-3" />
                                <a href={node.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    LinkedIn Profile
                                </a>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Mail className="h-5 w-5 mr-3" />
                                <span>{node.email || 'No email'}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${node.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                    node.status === 'Lead' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {node.status || 'Active'}
                                </span>
                            </div>
                        </div>
                    )}

                    {node.type === 'event' && (
                        <div className="space-y-4">
                            <div className="flex items-center text-muted-foreground">
                                <Calendar className="h-5 w-5 mr-3" />
                                <span>Oct 15, 2024</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                The premier conference for AI researchers and practitioners.
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-6 border-t border-white/10 space-y-3">
                        {!isConnecting ? (
                            <button
                                onClick={() => setIsConnecting(true)}
                                className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <LinkIcon className="h-4 w-4" />
                                Connect Entity
                            </button>
                        ) : (
                            <div className="space-y-2 bg-white/5 p-3 rounded-lg border border-white/10">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-400">Select entity to connect:</span>
                                    <button onClick={() => setIsConnecting(false)} className="text-gray-500 hover:text-white">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={connectSearch}
                                    onChange={(e) => setConnectSearch(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                                    autoFocus
                                />
                                <div className="space-y-1 mt-2">
                                    {filteredConnectNodes.map(n => (
                                        <button
                                            key={n.id}
                                            onClick={() => handleConnect(n)}
                                            className="w-full text-left px-2 py-1.5 hover:bg-white/10 rounded text-sm text-gray-300 truncate"
                                        >
                                            {n.name}
                                        </button>
                                    ))}
                                    {connectSearch && filteredConnectNodes.length === 0 && (
                                        <div className="text-xs text-gray-500 px-2">No matches found</div>
                                    )}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => alert("Enrichment started... (Mock)")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                        >
                            Enrich Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

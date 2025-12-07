import { X, MapPin, Building, Calendar, Mail, Linkedin } from "lucide-react";

interface NodeDetailsProps {
    node: any;
    onClose: () => void;
}

export default function NodeDetailsPanel({ node, onClose }: NodeDetailsProps) {
    if (!node) return null;

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
                                <span>Works at <strong>Kaizen Apps</strong></span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Linkedin className="h-5 w-5 mr-3" />
                                <a href="#" className="text-primary hover:underline">LinkedIn Profile</a>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Mail className="h-5 w-5 mr-3" />
                                <span>contact@example.com</span>
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
                    <div className="pt-6 border-t border-white/10">
                        <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium transition-colors">
                            Enrich Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

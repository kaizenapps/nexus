import { X, MapPin, Building, Calendar, Mail, Linkedin, Link as LinkIcon, Sparkles } from "lucide-react";
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
}

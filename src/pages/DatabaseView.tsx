import { useState } from "react";
import { useData } from "../context/DataContext";
import { Search, ArrowUpDown, Filter } from "lucide-react";

export default function DatabaseView() {
    const { graphData, addNodes } = useData();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedNodes = [...(graphData.nodes || [])].filter(node =>
        (node.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (node.group && node.group.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => {
        if (!sortConfig) return 0;
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Database</h1>
                    <p className="text-gray-400">View and manage all network nodes.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                        />
                    </div>
                    <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/10">
                        <Filter className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => {
                            const name = prompt("Enter node name:");
                            if (name) {
                                addNodes([{
                                    id: `manual-${Date.now()}`,
                                    name,
                                    group: "person",
                                    val: 20,
                                    description: "Manually added"
                                }]);
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        + Add Node
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 sticky top-0 backdrop-blur-md z-10">
                        <tr>
                            <th className="p-4 text-gray-400 font-medium border-b border-white/10 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                                <div className="flex items-center gap-2">Name <ArrowUpDown className="h-3 w-3" /></div>
                            </th>
                            <th className="p-4 text-gray-400 font-medium border-b border-white/10 cursor-pointer hover:text-white" onClick={() => handleSort('group')}>
                                <div className="flex items-center gap-2">Type <ArrowUpDown className="h-3 w-3" /></div>
                            </th>
                            <th className="p-4 text-gray-400 font-medium border-b border-white/10">Details</th>
                            <th className="p-4 text-gray-400 font-medium border-b border-white/10">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedNodes.length > 0 ? (
                            sortedNodes.map((node) => (
                                <tr key={node.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white font-medium">{node.name}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${node.group === 'person' ? 'bg-blue-500/20 text-blue-300' :
                                            node.group === 'company' ? 'bg-purple-500/20 text-purple-300' :
                                                node.group === 'event' ? 'bg-orange-500/20 text-orange-300' :
                                                    'bg-gray-500/20 text-gray-300'
                                            }`}>
                                            {(node.group || 'UNKNOWN').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm max-w-xs truncate">
                                        {node.description || node.title || node.industry || '-'}
                                    </td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-2 text-gray-400 text-sm">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    No data found. Upload a CSV in Data Sources.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

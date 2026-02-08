import { useState, useMemo } from "react";
import { useData } from "../context/DataContext";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function DatabaseView() {
    const { graphData, setGraphData, addNodes } = useData();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [filterGroup, setFilterGroup] = useState<string>('all');

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredNodes = useMemo(() => {
        return (graphData.nodes || []).filter(node => {
            const matchesSearch = (node.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (node.group && node.group.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesGroup = filterGroup === 'all' || node.group === filterGroup;

            return matchesSearch && matchesGroup;
        });
    }, [graphData.nodes, searchTerm, filterGroup]);

    const sortedNodes = useMemo(() => {
        return [...filteredNodes].sort((a, b) => {
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
    }, [filteredNodes, sortConfig]);

    const totalPages = Math.ceil(sortedNodes.length / itemsPerPage);
    const paginatedNodes = sortedNodes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                        />
                    </div>

                    {/* Filter Dropdown (Simple) */}
                    <select
                        value={filterGroup}
                        onChange={(e) => { setFilterGroup(e.target.value); setCurrentPage(1); }}
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                    >
                        <option value="all" className="bg-gray-900">All Types</option>
                        <option value="person" className="bg-gray-900">People</option>
                        <option value="company" className="bg-gray-900">Companies</option>
                        <option value="event" className="bg-gray-900">Events</option>
                    </select>

                    <button
                        onClick={() => {
                            const duplicates = graphData.nodes.filter((n, i, self) =>
                                self.findIndex(t => t.name.toLowerCase() === n.name.toLowerCase()) !== i
                            );

                            if (duplicates.length === 0) {
                                alert("No duplicates found (100% name match).");
                                return;
                            }

                            if (confirm(`Found ${duplicates.length} duplicate entities. Merge them?`)) {
                                // Simple deduplication: Keep first instance, remap links
                                const uniqueNodes: any[] = [];
                                const nameMap = new Map<string, string>();

                                graphData.nodes.forEach(node => {
                                    const key = node.name.toLowerCase();
                                    if (!nameMap.has(key)) {
                                        nameMap.set(key, node.id);
                                        uniqueNodes.push(node);
                                    }
                                });

                                const newLinks = graphData.links.map(link => {
                                    // Handle both D3 object references and raw ID strings
                                    const sourceAny = link.source as any;
                                    const targetAny = link.target as any;

                                    const sourceId = typeof sourceAny === 'object' ? sourceAny.id : sourceAny;
                                    const targetId = typeof targetAny === 'object' ? targetAny.id : targetAny;

                                    // Find the name for the source/target to look up in nameMap
                                    const sourceNode = graphData.nodes.find(n => n.id === sourceId);
                                    const targetNode = graphData.nodes.find(n => n.id === targetId);

                                    const sourceName = sourceNode?.name.toLowerCase();
                                    const targetName = targetNode?.name.toLowerCase();

                                    return {
                                        source: (sourceName && nameMap.get(sourceName)) || sourceId,
                                        target: (targetName && nameMap.get(targetName)) || targetId
                                    };
                                });

                                setGraphData({ nodes: uniqueNodes, links: newLinks });
                                alert("Deduplication complete.");
                            }
                        }}
                        className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
                        title="Deduplicate (100% Match)"
                    >
                        <span className="text-xs font-bold">Dedupe</span>
                    </button>
                    <button
                        onClick={() => {
                            const name = prompt("Enter entity name:");
                            if (name) {
                                const role = prompt("Enter role (e.g. CEO, Investor):") || "Unknown";
                                const email = prompt("Enter email:") || "";
                                const status = prompt("Enter status (Active, Lead, Closed):") || "Active";

                                addNodes([{
                                    id: `manual-${Date.now()}`,
                                    name,
                                    group: "person",
                                    val: 20,
                                    description: "Manually added",
                                    role,
                                    email,
                                    status
                                }]);
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        + Add Entity
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm flex flex-col">
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 sticky top-0 backdrop-blur-md z-10">
                            <tr>
                                <th className="p-4 text-gray-400 font-medium border-b border-white/10 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-2">Name <ArrowUpDown className="h-3 w-3" /></div>
                                </th>
                                <th className="p-4 text-gray-400 font-medium border-b border-white/10 cursor-pointer hover:text-white" onClick={() => handleSort('group')}>
                                    <div className="flex items-center gap-2">Type <ArrowUpDown className="h-3 w-3" /></div>
                                </th>
                                <th className="p-4 text-gray-400 font-medium border-b border-white/10">Role/Industry</th>
                                <th className="p-4 text-gray-400 font-medium border-b border-white/10">Email</th>
                                <th className="p-4 text-gray-400 font-medium border-b border-white/10">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedNodes.length > 0 ? (
                                paginatedNodes.map((node) => (
                                    <tr key={node.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white font-medium">{node.name}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${node.group === 'person' ? 'bg-blue-500/20 text-blue-300' :
                                                node.group === 'company' ? 'bg-purple-500/20 text-purple-300' :
                                                    node.group === 'event' ? 'bg-orange-500/20 text-orange-300' :
                                                        'bg-gray-500/20 text-gray-300'
                                                }`}>
                                                {(node.group || 'unknown').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-300">{node.role || node.industry || '-'}</td>
                                        <td className="p-4 text-gray-300">{node.email || '-'}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${node.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                                node.status === 'Lead' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {node.status || 'Active'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No nodes found. Try adding one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-white/10 flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedNodes.length)} to {Math.min(currentPage * itemsPerPage, sortedNodes.length)} of {sortedNodes.length} entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-sm text-white">Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

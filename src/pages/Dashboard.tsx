import { Brain, TrendingUp, Target, Shield, Zap, ChevronRight, Activity, Users, Globe } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";

export default function Dashboard() {
    const navigate = useNavigate();
    const { graphData } = useData();

    // Calculate Real Stats
    const totalEntities = graphData.nodes.length;
    const totalConnections = graphData.links.length;

    // Calculate unique countries (if available in data, else mock/count)
    // Assuming 'billingAddressCountry' or similar might be in node data if we mapped it.
    // For now, we'll just count nodes with a 'country' property if it exists, or keep it static if data is missing.
    const uniqueCountries = new Set(graphData.nodes.map(n => n.country).filter(Boolean)).size || 1;

    // Network Composition Data (Role-based) - Synced with Intelligence.tsx
    const roleCounts = {
        Investors: 0,
        Founders: 0,
        Engineers: 0,
        Sales: 0,
        Product: 0,
        Executives: 0
    };

    graphData.nodes.forEach(node => {
        if (node.group === 'person' && node.role) {
            const role = node.role.toLowerCase();
            if (role.includes('investor') || role.includes('vc') || role.includes('partner')) roleCounts.Investors++;
            else if (role.includes('founder') || role.includes('co-founder')) roleCounts.Founders++;
            else if (role.includes('engineer') || role.includes('developer')) roleCounts.Engineers++;
            else if (role.includes('sales') || role.includes('account')) roleCounts.Sales++;
            else if (role.includes('product') || role.includes('manager')) roleCounts.Product++;
            else if (role.includes('ceo') || role.includes('cto') || role.includes('vp') || role.includes('director')) roleCounts.Executives++;
        }
    });

    const radarData = [
        { subject: 'Investors', count: roleCounts.Investors, fullMark: 20 },
        { subject: 'Founders', count: roleCounts.Founders, fullMark: 20 },
        { subject: 'Engineers', count: roleCounts.Engineers, fullMark: 20 },
        { subject: 'Sales', count: roleCounts.Sales, fullMark: 20 },
        { subject: 'Product', count: roleCounts.Product, fullMark: 20 },
        { subject: 'Executives', count: roleCounts.Executives, fullMark: 20 },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* ... Header and Key Metrics ... */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Network overview and strategic intelligence.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-blue-400" />
                        <h4 className="font-medium text-white">Total Entities</h4>
                    </div>
                    <p className="text-3xl font-bold text-white">{totalEntities}</p>
                    <p className="text-sm text-gray-500">Across all categories</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="h-5 w-5 text-green-400" />
                        <h4 className="font-medium text-white">Active Connections</h4>
                    </div>
                    <p className="text-3xl font-bold text-white">{totalConnections}</p>
                    <p className="text-sm text-gray-500">Total relationships</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="h-5 w-5 text-purple-400" />
                        <h4 className="font-medium text-white">Global Reach</h4>
                    </div>
                    <p className="text-3xl font-bold text-white">{uniqueCountries}</p>
                    <p className="text-sm text-gray-500">Countries represented</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Network Composition Radar Chart */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-400" />
                            Network Composition
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/20 text-green-300">Live</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#374151" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar
                                    name="Count"
                                    dataKey="count"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    fill="#3B82F6"
                                    fillOpacity={0.3}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                    itemStyle={{ color: '#F3F4F6' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Next Recommended Move */}
                <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/10 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Brain className="h-32 w-32 text-white" />
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-400" />
                        Next Move
                    </h3>

                    <div className="space-y-4 relative z-10">
                        <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                            <p className="text-sm text-gray-400 mb-1">Strategic Opportunity</p>
                            <p className="text-white font-medium">Connect with <span className="text-blue-400">Sarah Chen</span> (AI Research Lead)</p>
                        </div>

                        <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                            <p className="text-sm text-gray-400 mb-1">Rationale</p>
                            <p className="text-gray-300 text-sm">High centrality in the "Generative Models" cluster. 85% match with your current objective.</p>
                        </div>

                        <button
                            onClick={() => navigate('/dashboard/database?search=Sarah%20Chen')}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            Execute Move <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

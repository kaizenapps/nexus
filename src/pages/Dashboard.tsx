import { Brain, TrendingUp, Target, Shield, Zap, ChevronRight, Activity, Users, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
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
                    <p className="text-3xl font-bold text-white">1,248</p>
                    <p className="text-sm text-gray-500">+24 this week</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="h-5 w-5 text-green-400" />
                        <h4 className="font-medium text-white">Active Connections</h4>
                    </div>
                    <p className="text-3xl font-bold text-white">8,502</p>
                    <p className="text-sm text-gray-500">High engagement</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="h-5 w-5 text-purple-400" />
                        <h4 className="font-medium text-white">Global Reach</h4>
                    </div>
                    <p className="text-3xl font-bold text-white">14</p>
                    <p className="text-sm text-gray-500">Countries represented</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Assessment Radar Chart (Reused from Intelligence) */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-400" />
                            Network Assessment
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/20 text-green-300">Live</span>
                    </div>
                    <div className="h-64 flex items-center justify-center relative">
                        {/* Mock Radar Chart Visual */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border border-white/10 rounded-full flex items-center justify-center">
                                <div className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center">
                                    <div className="w-16 h-16 border border-white/10 rounded-full bg-blue-500/10 animate-pulse"></div>
                                </div>
                            </div>
                            {/* Radar Lines */}
                            <div className="absolute w-full h-[1px] bg-white/5 rotate-0"></div>
                            <div className="absolute w-full h-[1px] bg-white/5 rotate-60"></div>
                            <div className="absolute w-full h-[1px] bg-white/5 rotate-120"></div>

                            {/* Data Points */}
                            <div className="absolute top-10 right-20 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                            <div className="absolute bottom-16 left-24 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                            <div className="absolute top-24 left-16 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                        </div>
                        <p className="text-gray-500 text-sm mt-40">Network Composition Analysis</p>
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

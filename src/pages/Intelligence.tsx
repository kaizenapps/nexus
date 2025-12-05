import { Brain, Cpu, Sparkles, TrendingUp } from "lucide-react";

export default function Intelligence() {
    return (
        <div className="p-8 h-full overflow-y-auto bg-[#0B1120]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                        <Brain className="h-8 w-8 text-purple-500" />
                        Nexus Intelligence
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        AI-driven analysis of your network health, coverage gaps, and strategic opportunities.
                    </p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <Sparkles className="h-4 w-4" />
                    Run New Analysis
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Radar Chart Placeholder */}
                <div className="glass-panel p-6 rounded-xl border border-white/10 min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-medium text-white mb-6">Network Composition (Radar)</h3>
                    <div className="flex-1 flex items-center justify-center relative">
                        {/* Simplified CSS Radar Visualization as placeholder */}
                        <div className="relative w-64 h-64 border-2 border-white/10 rounded-full flex items-center justify-center">
                            <div className="absolute w-48 h-48 border-2 border-white/10 rounded-full"></div>
                            <div className="absolute w-32 h-32 border-2 border-white/10 rounded-full"></div>
                            <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full"></div>
                            <div className="absolute w-full h-full" style={{ clipPath: 'polygon(50% 0%, 90% 25%, 90% 75%, 50% 100%, 10% 75%, 10% 25%)', background: 'rgba(168, 85, 247, 0.4)' }}></div>
                            <span className="text-xs text-white absolute top-2 left-1/2 -translate-x-1/2">Investors</span>
                            <span className="text-xs text-white absolute bottom-10 right-10">Sales</span>
                            <span className="text-xs text-white absolute bottom-10 left-10">Engineers</span>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-green-400">80%</div>
                            <div className="text-xs text-gray-500">Investor Reach</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-yellow-400">40%</div>
                            <div className="text-xs text-gray-500">Eng Coverage</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-400">92%</div>
                            <div className="text-xs text-gray-500">Sales Leads</div>
                        </div>
                    </div>
                </div>

                {/* Insights */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl border border-white/10">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500 mt-1">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium">Gap Identified: Fintech CTOs</h4>
                                <p className="text-gray-400 text-sm mt-1 mb-3">
                                    Your objective requires Series B Fintech connections, but your current network is heavy on Early Stage SaaS.
                                </p>
                                <button className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded text-white border border-white/10">
                                    View Recommended Leads
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-white/10">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500 mt-1">
                                <Cpu className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium">Automated Enrichment Complete</h4>
                                <p className="text-gray-400 text-sm mt-1 mb-3">
                                    Successfully enriched 50 new profiles from the last import. Found 42 verified emails via Hunter.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Database, Link, CheckCircle, Plus } from "lucide-react";

export default function DataSources() {
    return (
        <div className="p-8 h-full overflow-y-auto bg-[#0B1120]">
            <h1 className="text-3xl font-bold text-white mb-2">Data Sources</h1>
            <p className="text-gray-400 mb-8 max-w-2xl">
                Connect external APIs and databases to enrich the social graph.
                Nexus uses these sources to find emails, employment history, and company details.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Hunter.io */}
                <div className="glass-panel p-6 rounded-xl border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                        <div className="h-6 w-6 rounded-full border border-green-500/50 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                    </div>
                    <div className="h-12 w-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 text-orange-500">
                        <Database className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Hunter.io</h3>
                    <p className="text-gray-400 text-sm mt-2 mb-4">
                        Email verification and domain search. Used to find contact details for potential leads.
                    </p>
                    <div className="flex items-center text-xs text-green-400 font-mono bg-green-950/30 px-2 py-1 rounded w-fit">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        CONNECTED
                    </div>
                </div>

                {/* LinkedIn / Custom Scraper */}
                <div className="glass-panel p-6 rounded-xl border border-white/10 opacity-75 hover:opacity-100 transition-all">
                    <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-500">
                        <Link className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">LinkedIn (Apify)</h3>
                    <p className="text-gray-400 text-sm mt-2 mb-4">
                        Profile scraping and network connection analysis.
                    </p>
                    <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors border border-white/10">
                        Configure API Key
                    </button>
                </div>

                {/* Add New */}
                <div className="glass-panel p-6 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Add Source</h3>
                    <p className="text-gray-500 text-xs mt-1">
                        CSV Import, CRM, or Custom API
                    </p>
                </div>
            </div>
        </div>
    );
}

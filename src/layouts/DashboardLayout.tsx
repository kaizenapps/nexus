import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Database, Brain, User, Settings, Cable, ChevronDown, Share2 } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout() {
    const location = useLocation();
    const [project, setProject] = useState("Global Operations");

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
        { icon: Share2, label: "Graph View", path: "/dashboard/graph" },
        { icon: Database, label: "Database", path: "/dashboard/database" },
        { icon: Cable, label: "Data Sources", path: "/dashboard/data" },
        { icon: Brain, label: "Intelligence", path: "/dashboard/intelligence" },
        { icon: User, label: "Profile", path: "/dashboard/profile" },
        { icon: Settings, label: "Settings", path: "/dashboard/settings" },
    ];

    return (
        <div className="flex h-screen bg-[#0B1120] text-white overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0B1120]/50 border-r border-white/10 backdrop-blur-xl flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <img src="/Nexus_Logo.png" alt="Nexus Logo" className="h-10 w-10" />
                    <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">NEXUS</span>
                </div>

                {/* Project Selector (Hidden for now) */}
                {/* <div className="px-4 mb-6">
                    <div className="relative group">
                        <button className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                            <span className="truncate">{project}</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </button>
                        <div className="absolute top-full left-0 w-full mt-1 bg-[#1a202c] border border-white/10 rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-50">
                            <div className="p-1">
                                <button onClick={() => setProject("Global Operations")} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-md">Global Operations</button>
                                <button onClick={() => setProject("North America")} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-md">North America</button>
                                <button onClick={() => setProject("APAC Region")} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-md">APAC Region</button>
                                <div className="h-px bg-white/10 my-1"></div>
                                <button className="w-full text-left px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10 rounded-md flex items-center gap-2">
                                    + New Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div> */}

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-white/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 ${isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"}`} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                            PZ
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Preston Zen</p>
                            <p className="text-xs text-gray-500 truncate">preston@kaizen.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative">
                <Outlet />
            </main>
        </div>
    );
}

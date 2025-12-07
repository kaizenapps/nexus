import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Database, Brain, User, Settings, Cable, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout() {
    const location = useLocation();
    const [project, setProject] = useState("Global Operations");

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
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
        </aside >

        {/* Main Content */ }
        < main className = "flex-1 overflow-auto relative" >
            <Outlet />
    </main >
        </div >
    );
}

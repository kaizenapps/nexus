import { ReactNode } from "react";
import Link from "next/link";
import { Network, Search, Settings, User, Map, Database } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside className="w-16 md:w-64 flex-shrink-0 border-r border-white/10 bg-secondary/30 backdrop-blur-md flex flex-col">
                <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-white/10">
                    <Network className="h-8 w-8 text-primary" />
                    <span className="hidden md:block ml-3 font-bold text-xl tracking-wider">NEXUS</span>
                </div>

                <nav className="flex-1 py-6 space-y-2 px-2 md:px-4">
                    <NavItem href="/dashboard" icon={<Map />} label="Graph View" active />
                    <NavItem href="/dashboard/data" icon={<Database />} label="Data Sources" />
                    <NavItem href="/dashboard/search" icon={<Search />} label="Intelligence" />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <NavItem href="/profile" icon={<User />} label="Profile" />
                    <NavItem href="/settings" icon={<Settings />} label="Settings" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden">
                {children}
            </main>
        </div>
    );
}

function NavItem({ href, icon, label, active }: { href: string; icon: ReactNode; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${active
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
        >
            <span className="h-5 w-5">{icon}</span>
            <span className="hidden md:block ml-3 font-medium">{label}</span>
            {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            )}
        </Link>
    );
}

import { Save, User, Shield, Bell } from "lucide-react";

export default function Settings() {
    return (
        <div className="p-8 h-full overflow-y-auto bg-[#0B1120] flex justify-center">
            <div className="w-full max-w-2xl space-y-8">
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>

                {/* API Keys */}
                <div className="glass-panel p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <Shield className="h-4 w-4" /> API Configuration
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Hunter.io API Key</label>
                            <input type="password" value="************************" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white font-mono text-sm" readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">OpenAI API Key</label>
                            <input type="password" placeholder="sk-..." className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white font-mono text-sm" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                            <Save className="h-4 w-4" /> Save Changes
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="glass-panel p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <Bell className="h-4 w-4" /> Preferences
                    </h3>
                    <div className="space-y-3">
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-gray-300">Email Alerts for New Leads</span>
                            <input type="checkbox" className="accent-primary h-4 w-4" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-gray-300">Weekly Intelligence Report</span>
                            <input type="checkbox" className="accent-primary h-4 w-4" defaultChecked />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

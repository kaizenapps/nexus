import { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';

export default function Profile() {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedImage = localStorage.getItem('nexus_profile_photo');
        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfileImage(base64String);
                localStorage.setItem('nexus_profile_photo', base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-8 h-full overflow-y-auto bg-[#0B1120] flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <div className="relative h-48 rounded-xl bg-gradient-to-r from-blue-900 to-purple-900 mb-16 border border-white/10">
                    <div className="absolute -bottom-12 left-8 flex items-end group">
                        <div
                            className="h-32 w-32 rounded-full bg-black border-4 border-[#0B1120] flex items-center justify-center overflow-hidden cursor-pointer relative"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-3xl font-bold text-white">
                                    PZ
                                </div>
                            )}

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />

                        <div className="mb-4 ml-4">
                            <h1 className="text-3xl font-bold text-white">Preston Zen</h1>
                            <p className="text-gray-400">Founder @ Kaizen Apps</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-6">
                        <div className="glass-panel p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-medium mb-4">Contact Info</h3>
                            <div className="space-y-2 text-sm">
                                <div className="text-gray-400">Email</div>
                                <div className="text-white">prestonzen@kaizenapps.com</div>
                                <div className="text-gray-400 mt-2">Location</div>
                                <div className="text-white">San Francisco, CA</div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="glass-panel p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-medium mb-4">Current Objectives</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center">
                                    <div>
                                        <div className="text-white font-medium text-sm">Targeting Series A Investors</div>
                                        <div className="text-xs text-gray-500">Active • 12 Leads Found</div>
                                    </div>
                                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center">
                                    <div>
                                        <div className="text-white font-medium text-sm">Hiring Senior Rust Engineeer</div>
                                        <div className="text-xs text-gray-500">Active • 3 Candidates</div>
                                    </div>
                                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-medium mb-4">Activity Log</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4 items-start border-l-2 border-white/10 pl-4 py-1">
                                        <div className="text-xs text-gray-500 mt-1">2h ago</div>
                                        <div>
                                            <div className="text-sm text-gray-300">Enriched profile for <strong>Sarah Connor</strong></div>
                                            <div className="text-xs text-gray-500">Source: Hunter.io</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

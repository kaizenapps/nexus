import { useState } from "react";
import { Upload, FileText, Database, CheckCircle, AlertCircle } from "lucide-react";
import { useData } from "../context/DataContext";
import { parseCSVData } from "../lib/csvParser";

export default function DataSources() {
    const { addGraphData } = useData();
    const [dragActive, setDragActive] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await processFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            await processFile(e.target.files[0]);
        }
    };

    const processFile = async (file: File) => {
        if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
            setUploadStatus('error');
            setMessage("Please upload a valid CSV file.");
            return;
        }

        try {
            const text = await file.text();
            const { nodes, links } = parseCSVData(text);

            if (nodes.length === 0) {
                 setUploadStatus('error');
                 setMessage("No valid data found in CSV.");
                 return;
            }

            addGraphData(nodes, links);
            setUploadStatus('success');
            setMessage(`Successfully imported ${nodes.length} nodes and ${links.length} links from ${file.name}`);
        } catch (error) {
            console.error(error);
            setUploadStatus('error');
            setMessage("Failed to parse CSV file.");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Data Sources</h1>
                <p className="text-gray-400">Connect and manage your data streams.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CSV Upload Card */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <FileText className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">CSV Import</h3>
                            <p className="text-sm text-gray-400">Upload EspoCRM exports</p>
                        </div>
                    </div>

                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive ? "border-green-500 bg-green-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-300 font-medium mb-2">Drag & drop CSV file here</p>
                        <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                        <input
                            type="file"
                            id="csv-upload"
                            className="hidden"
                            accept=".csv"
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="csv-upload"
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer transition-colors"
                        >
                            Select File
                        </label>
                    </div>

                    {uploadStatus !== 'idle' && (
                        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${uploadStatus === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                            {uploadStatus === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                            <span className="text-sm">{message}</span>
                        </div>
                    )}
                </div>

                {/* Database Connector Placeholder */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Database className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">SQL Database</h3>
                            <p className="text-sm text-gray-400">Connect directly to your DB</p>
                        </div>
                    </div>
                    <div className="h-40 flex items-center justify-center border border-white/5 rounded-xl bg-black/20">
                        <span className="text-gray-500 text-sm">Coming Soon</span>
                    </div>
                </div>

                {/* Enrichment Services */}
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:border-orange-500/50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 rounded bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">H</div>
                            <h3 className="text-lg font-semibold text-white">Hunter.io</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Email verification and discovery.</p>
                        <div className="text-xs text-green-400 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Connected
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:border-blue-500/50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">A</div>
                            <h3 className="text-lg font-semibold text-white">Apify</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Web scraping and automation.</p>
                        <div className="text-xs text-green-400 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Connected
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-colors cursor-pointer group opacity-75">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 rounded bg-purple-500/20 flex items-center justify-center text-purple-500 font-bold">S</div>
                            <h3 className="text-lg font-semibold text-white">Snov.io</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Cold outreach automation.</p>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            Coming Soon
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

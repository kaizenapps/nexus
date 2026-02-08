import { useState, useRef } from "react";
import { Upload, X, Tag as TagIcon, Users, Plus } from "lucide-react";
import { useData } from "../context/DataContext";
import { Photo, Tag } from "../types/Gallery";

export default function Gallery() {
    const { photos, addPhoto, addTag, graphData, generatePhotoConnections } = useData();
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [tagMode, setTagMode] = useState(false);
    const [clickPos, setClickPos] = useState<{ x: number, y: number } | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPhoto: Photo = {
                    id: Date.now().toString(),
                    url: reader.result as string,
                    name: file.name,
                    timestamp: Date.now(),
                    tags: []
                };
                addPhoto(newPhoto);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (!selectedPhoto) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setClickPos({ x, y });
        setTagMode(true);
    };

    const handleAddTag = () => {
        if (!selectedPhoto || !clickPos || !selectedNodeId) return;

        const newTag: Tag = {
            id: Date.now().toString(),
            photoId: selectedPhoto.id,
            nodeId: selectedNodeId,
            x: clickPos.x,
            y: clickPos.y
        };

        addTag(newTag);

        // Update local selected state to show immediate feedback if needed,
        // but context update will trigger re-render
        if (selectedPhoto) {
             const updatedPhoto = { ...selectedPhoto, tags: [...selectedPhoto.tags, newTag] };
             setSelectedPhoto(updatedPhoto);
        }

        setTagMode(false);
        setClickPos(null);
        setSelectedNodeId("");
    };

    // Filter nodes for dropdown (people only)
    const peopleNodes = graphData.nodes.filter(n => n.group === 'person');

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Photo Gallery</h1>
                    <p className="text-gray-400">Upload photos, tag connections, and visualize social circles.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={generatePhotoConnections}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        <Users className="h-4 w-4" />
                        Sync Connections
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        <Upload className="h-4 w-4" />
                        Upload Photo
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto pb-20">
                {photos.map(photo => (
                    <div
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className="group relative aspect-square bg-white/5 rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all"
                    >
                        <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-medium flex items-center gap-2">
                                <TagIcon className="h-4 w-4" /> {photo.tags.length} Tags
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedPhoto && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8">
                    <div className="relative max-w-5xl w-full h-full max-h-[80vh] flex flex-col md:flex-row bg-[#0B1120] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <button
                            onClick={() => { setSelectedPhoto(null); setTagMode(false); }}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-white/20"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {/* Image Side */}
                        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                            <div className="relative inline-block">
                                <img
                                    src={selectedPhoto.url}
                                    alt="Selected"
                                    className="max-h-full max-w-full object-contain cursor-crosshair"
                                    onClick={handleImageClick}
                                />
                                {/* Render Tags */}
                                {selectedPhoto.tags.map(tag => {
                                    const person = peopleNodes.find(n => n.id === tag.nodeId);
                                    return (
                                        <div
                                            key={tag.id}
                                            className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 group"
                                            style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
                                        >
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap hidden group-hover:block">
                                                {person?.name || 'Unknown'}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Temporary Click Marker */}
                                {clickPos && (
                                    <div
                                        className="absolute w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                                        style={{ left: `${clickPos.x}%`, top: `${clickPos.y}%` }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Sidebar Side */}
                        <div className="w-full md:w-80 bg-[#0B1120] border-l border-white/10 p-6 flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-4">In this photo</h3>

                            <div className="flex-1 overflow-y-auto space-y-3 mb-6">
                                {selectedPhoto.tags.length === 0 ? (
                                    <p className="text-gray-500 text-sm italic">No people tagged yet. Click on the photo to tag someone.</p>
                                ) : (
                                    selectedPhoto.tags.map(tag => {
                                        const person = peopleNodes.find(n => n.id === tag.nodeId);
                                        return (
                                            <div key={tag.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                                                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                                                    {person?.name?.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-white text-sm">{person?.name}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {tagMode && (
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 animate-in fade-in slide-in-from-bottom-4">
                                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                                        <Plus className="h-4 w-4 text-yellow-400" /> Tag Person
                                    </h4>
                                    <select
                                        value={selectedNodeId}
                                        onChange={(e) => setSelectedNodeId(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm mb-3 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Select a person...</option>
                                        {peopleNodes.map(node => (
                                            <option key={node.id} value={node.id}>{node.name}</option>
                                        ))}
                                    </select>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setTagMode(false); setClickPos(null); }}
                                            className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddTag}
                                            disabled={!selectedNodeId}
                                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg disabled:opacity-50"
                                        >
                                            Add Tag
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

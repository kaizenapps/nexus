export interface Tag {
    id: string; // Unique tag ID
    photoId: string;
    nodeId: string; // ID of the person/node tagged
    x: number; // Relative X coordinate (0-100)
    y: number; // Relative Y coordinate (0-100)
}

export interface Photo {
    id: string;
    url: string; // Data URL or remote URL
    name: string;
    timestamp: number;
    tags: Tag[];
}

export interface GalleryState {
    photos: Photo[];
}

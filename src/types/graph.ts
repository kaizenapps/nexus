export interface Node {
    id: string;
    name: string;
    group: string; // 'person' | 'company' | 'investor' | 'event'
    val: number;
    [key: string]: any; // Allow extra properties
}

export interface Link {
    source: string | { id: string };
    target: string | { id: string };
    [key: string]: any;
}

export interface GraphData {
    nodes: Node[];
    links: Link[];
}

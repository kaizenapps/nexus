-- Migration number: 0001 	 2024-04-05T00:00:00.000Z
-- Nodes table
CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'person', 'company', 'event'
    label TEXT NOT NULL,
    data TEXT, -- JSON string for extra details (bio, url, etc.)
    lat REAL,
    lng REAL,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Edges table
CREATE TABLE IF NOT EXISTS edges (
    id TEXT PRIMARY KEY,
    source TEXT NOT NULL,
    target TEXT NOT NULL,
    type TEXT NOT NULL, -- 'works_at', 'attended', 'connected_to'
    weight REAL DEFAULT 1.0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (source) REFERENCES nodes(id),
    FOREIGN KEY (target) REFERENCES nodes(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_nodes_type ON nodes(type);
CREATE INDEX IF NOT EXISTS idx_edges_source ON edges(source);
CREATE INDEX IF NOT EXISTS idx_edges_target ON edges(target);

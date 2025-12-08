# Nexus: Intelligent Network Intelligence

**Target**: Social Networking Simplified via Clear Objectives.

Nexus is a next-generation network intelligence tool designed to transform how companies and individuals grow their social capital. Unlike traditional CRM or social platforms which are passive repositories of contacts, Nexus is **objective-driven**.

## Core Vision

Social networking is often aimless. We collect business cards and LinkedIn connections without a strategy. Nexus changes this by starting with the question: **"What is your objective?"**

- **For Growth**: "I need to find 5 Seed Investors in San Francisco."
- **For Hiring**: "I need a Senior Rust Engineer who has worked at a FAANG company."
- **For Sales**: "I need to connect with CTOs of Series B Fintech startups."

Nexus visualizes your network, identifies the gaps, and provides the intelligence to bridge them using data enrichment (Hunter.io, LinkedIn, etc.) and AI-driven analysis.

## Project Status

### ✅ Done (Implemented)

* **Infrastructure**: Vite + React Migration, Cloudflare Pages Deployment (CI/CD via GitHub).
- **Core Graph**: Force-directed graph visualization of entities (`react-force-graph-2d`).
- **Data Intelligence**:
  - **Nexus Mode**: AI-driven analysis generating insights and potential connections.
  - **Enrichment**: Integrated Hunter.io and OpenRouter (Grok) for profile enrichment.
  - **Data Import**: Direct CSV import from EspoCRM.
- **UI/UX**:
  - **Dashboard**: Dynamic "Network Composition" radar chart reflecting real role distribution (Investors, Founders, etc.).
  - **Search**: Deep search across Name, Role, Industry, and Description.
  - **Interaction**: "Connect Entity" workflow with **Solid** vs **Proposed** (dotted) connection types.
  - **Deduplication**: Automated merging of duplicate entities.

### 🚧 Current Focus

* **Data Sources**: Exploring Event API integrations (PredictHQ, Eventbrite vs 10times scraper).
- **Events Tab**: Creating a dedicated view for managing events and correlating attendees.
- **Graph Filters**: Adding UI controls to filter nodes by Role, Industry, and Status.

### 📅 Planned Features

* **Google Drive Integration**: Analyzing photos for face recognition and metadata.
- **View Modes**: Switching between "Direct Connections" and "Cluster/Association" views.
- **Backend Services**:
  - SMTP (AWS SES) for email outreach.
  - 10times.com Scraper (Microservice) for specific event data.

## The Social Networking Radar

To grow a company, you need a balanced network. Nexus visualizes your social capital across key domains:

```mermaid
radar-chart
    title Network Composition & Needs
    "Investors" : [80, 50, 70, 40, 90, 60]
    "Engineers" : [30, 90, 40, 80, 50, 70]
    "Sales" : [60, 40, 85, 30, 60, 50]
    "Marketing" : [40, 30, 50, 80, 40, 60]
    "Product" : [70, 80, 60, 50, 80, 40]
    "Recruiting" : [50, 60, 70, 40, 50, 80]
```

## Tech Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Visualization**: `react-force-graph-2d`
- **Recharts**: Data visualization (Radar Charts)
- **Backend**: Cloudflare Pages Functions
- **Deployment**: Cloudflare Pages (Direct Push)

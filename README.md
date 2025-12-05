# Nexus: Intelligent Network Intelligence

**Target**: Social Networking Simplified via Clear Objectives.

Nexus is a next-generation network intelligence tool designed to transform how companies and individuals grow their social capital. Unlike traditional CRM or social platforms that are passive repositories of contacts, Nexus is **objective-driven**.

## Core Vision
Social networking is often aimless. We collect business cards and LinkedIn connections without a strategy. Nexus changes this by starting with the question: **"What is your objective?"**

- **For Growth**: "I need to find 5 Seed Investors in San Francisco."
- **For Hiring**: "I need a Senior Rust Engineer who has worked at a FAANG company."
- **For Sales**: "I need to connect with CTOs of Series B Fintech startups."

Nexus visualizes your network, identifies the gaps, and provides the intelligence to bridge them using data enrichment (Hunter.io, LinkedIn, etc.) and AI-driven analysis.

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

## Features

### 🕸️ Interactive Graph Visualization
- **Force-Directed Graph**: Visualize connections dynamically.
- **Node Analysis**: Drill down into specific people or companies.
- **Filtering**: View only the nodes relevant to your current objective.

### 🧠 AI-Driven Intelligence
- **Objective Search**: Don't just search for names. Search for *goals*.
- **Gap Analysis**: "You have strong connection to Engineers, but weak connection to Investors."

### 🔌 Data Integration
- **Hunter.io**: Enriches profiles with verified email addresses.
- **Cloudflare Integration**: Serverless backend for fast, scalable data processing.

## Tech Stack
- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Visualization**: `react-force-graph-2d`
- **Backend**: Cloudflare Pages Functions
- **Deployment**: Cloudflare Pages

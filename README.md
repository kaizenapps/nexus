# Nexus - Network Intelligence Platform

![Nexus Banner](https://via.placeholder.com/1200x400.png?text=Nexus+Network+Intelligence)

**Nexus** is a next-generation **Network Intelligence Tool** designed to map, visualize, and analyze social connections, professional objectives, and strategic events. Think of it as a fusion of **Maltego**, **CRM**, and **Graph Analysis**, built for the modern web.

## 🚀 Mission

To empower users to visualize their network, identify strategic paths to their objectives, and leverage AI to uncover hidden connections. Whether you are a founder looking for investors, a researcher finding collaborators, or a sales professional mapping an organization, Nexus provides the intelligence you need.

## ✨ Key Features

### 🕸️ Interactive Graph Visualization
- **Force-Directed Graph**: Visualize your network as nodes (People, Companies, Events) and edges (Relationships).
- **Dynamic Filtering**: Filter by entity type, connection strength, or geographic distance.
- **Deep Zoom**: Explore clusters and drill down into individual node details.

### 🧠 AI-Powered Analysis
- **Objective-Driven**: Input your goal (e.g., *"Connect with AI researchers in San Francisco"*).
- **Smart Decomposition**: The AI breaks down your objective into actionable search queries and potential connection paths.
- **OpenRouter Integration**: Leverages top-tier LLMs to process and enrich data.

### 🌍 Data Acquisition & Enrichment
- **Multi-Source Scraping**: Designed to ingest data from Google, LinkedIn, CrunchBase, and more (via Apify).
- **Contact Enrichment**: Integrated with **Hunter.io** to find verified email addresses for mapped individuals.
- **Event Discovery**: Automatically finds relevant conferences and meetups in your target area.

### 💎 Premium User Experience
- **Glassmorphism Design**: A stunning, modern dark-mode interface built with Tailwind CSS.
- **Geo-Spatial Intelligence**: Filter people and events by proximity (e.g., "within 50km").
- **Seamless Performance**: Powered by Cloudflare's Edge Network for global low latency.

## 🛠️ Tech Stack

Nexus is built on the **Cloudflare Stack** for maximum performance, scalability, and simplicity.

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + `lucide-react` icons
- **Visualization**: `react-force-graph-2d`
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (Serverless SQLite)
- **Storage**: [Cloudflare R2](https://developers.cloudflare.com/r2/) (Object Storage)
- **Compute**: [Cloudflare Workers](https://workers.cloudflare.com/) / Pages Functions
- **AI**: [OpenRouter API](https://openrouter.ai/)

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Cloudflare Account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nexus.git
   cd nexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Copy `wrangler.toml.example` to `wrangler.toml` (if applicable)
   - Set up your Cloudflare D1 database:
     ```bash
     npx wrangler d1 create nexus-db
     ```
   - Update `wrangler.toml` with your new Database ID.

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

### Deployment

Nexus is optimized for **Cloudflare Pages**.

1. **Build the application**
   ```bash
   npm run pages:build
   ```

2. **Deploy to Cloudflare**
   ```bash
   npx wrangler pages deploy .vercel/output/static
   ```

## 🗺️ Roadmap

- [x] **Alpha**: Core Graph UI, D1 Schema, Hardcoded Auth.
- [ ] **Beta**: Real-time Apify integration, User Accounts, Save/Load Graphs.
- [ ] **V1.0**: Neo4j optional backend for massive datasets, Collaborative workspaces.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ by Kaizen Apps*

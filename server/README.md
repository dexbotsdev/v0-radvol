# Trading Bot Server

A robust Express.js server with SQLite3 storage using Sequelize ORM for the Trading Bot platform.

## Features

- RESTful API for wallet management, configuration, and settings
- SQLite3 database with Sequelize ORM
- Proper error handling and validation
- Modular folder structure

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Copy the example environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

### Wallets

- `GET /api/wallets` - Get all wallets
- `POST /api/wallets/generate` - Generate new wallets
- `POST /api/wallets/fund` - Fund wallets
- `POST /api/wallets/burn` - Burn wallets
- `PATCH /api/wallets/:id/selection` - Update wallet selection

### Configuration

- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Settings

- `GET /api/settings/rpc` - Get RPC settings
- `POST /api/settings/rpc` - Save RPC settings

## Project Structure

\`\`\`
server/
├── config/           # Configuration files
├── controllers/      # Route handlers
├── models/           # Sequelize models
├── routes/           # API routes
├── services/         # Business logic
├── utils/            # Utility functions
├── index.ts          # Entry point
├── package.json
└── tsconfig.json
\`\`\`

## License

MIT

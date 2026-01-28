# AI Study Planner

A Linux desktop application that combines AI-powered study planning with dynamically generated interactive tools.

## Overview

The AI Study Planner is an intelligent desktop application designed to help students organize their study schedules and access AI-generated learning tools. Built with a Rust backend and Electron+React frontend, it features:

- 🤖 **AI-Generated Study Plans**: Weekly plans automatically broken down into daily tasks
- 🛠️ **Dynamic Tool Generation**: AI creates custom calculators, timers, and flashcards
- ✏️ **Live AI Editing**: Real-time modification of tools through natural language
- 🎨 **Google-Style UI**: Clean, modern interface with Material Design
- 🔒 **Privacy-First**: Local-only data storage with optional AI integration

## Documentation

- **[Technical Specification](SPEC.md)** - Complete technical specification including architecture, API endpoints, data models, and implementation details
- **[API Documentation](API.md)** - REST API reference with endpoints, request/response formats, and examples
- **[Architecture Overview](ARCHITECTURE.md)** - System architecture diagrams and component communication flows

## Quick Start

### Prerequisites

- Linux operating system (Ubuntu 20.04+, Fedora 35+, or similar)
- Rust 1.70+ and Cargo
- Node.js 18+ and npm
- SQLite 3

### Installation

```bash
# Clone the repository
git clone https://github.com/RyAnPr1Me/studyplanner.git
cd studyplanner

# Setup backend
cd backend
cargo build
cp .env.example .env
# Edit .env and add your OpenAI API key (or configure local AI)

# Initialize database
sqlite3 data/database/studyplanner.db < migrations/init.sql

# Run backend
cargo run

# In a new terminal, setup frontend
cd ../frontend
npm install
npm run dev

# In another terminal, run as Electron app
npm run electron:dev
```

### Backend Only

```bash
cd backend
cargo run
```

### Configuration

Create a `.env` file in the `backend/` directory:

```bash
# AI Provider Configuration
AI_PROVIDER=openai  # or 'local'
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-4

# Server Configuration
SERVER_HOST=127.0.0.1
SERVER_PORT=8080

# Database
DATABASE_PATH=data/database/studyplanner.db
```

## Features

### AI-Powered Study Planning

- Generate comprehensive weekly study plans based on your subjects and goals
- Automatic breakdown into manageable daily tasks
- AI-driven topic recommendations and resource suggestions
- Progress tracking and adaptive scheduling

### Dynamic Tool System

The application can generate custom interactive tools on-demand:

- **Calculators**: Subject-specific calculators with step-by-step solutions
- **Timers**: Pomodoro timers, countdown timers, and study session trackers
- **Flashcards**: AI-generated flashcard decks for any topic
- **Custom Tools**: Any tool you can describe in natural language

### Live AI Editing

Edit any generated tool using natural language:
- "Add a graph visualization"
- "Make the timer play a sound when finished"
- "Show the calculation steps"

The AI understands context and modifies the tool code in real-time.

### Google-Style Interface

Clean, intuitive interface following Material Design principles:
- Responsive layout
- Smooth animations
- Consistent design language
- Keyboard shortcuts
- Dark/light theme support

## Technology Stack

### Backend
- **Rust** - Fast, safe systems programming language
- **Actix-Web** - High-performance web framework
- **SQLite** - Lightweight embedded database
- **Tokio** - Asynchronous runtime

### Frontend
- **Electron** - Desktop application framework
- **React** - UI component library
- **TypeScript** - Type-safe JavaScript
- **Material-UI** - Google-style components
- **Redux Toolkit** - State management

### AI Integration
- **OpenAI API** (GPT-4) - Primary AI provider
- **Local Models** (Optional) - Ollama, LM Studio support

## Project Structure

```
studyplanner/
├── backend/              # Rust backend server
│   ├── src/
│   │   ├── api/         # API route handlers
│   │   ├── services/    # Business logic
│   │   ├── models/      # Data models
│   │   └── db/          # Database layer
│   └── Cargo.toml
├── frontend/            # Electron + React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   └── utils/       # Utilities
│   ├── electron/        # Electron main process
│   └── package.json
├── SPEC.md             # Technical specification
├── API.md              # API documentation
└── ARCHITECTURE.md     # Architecture overview
```

## Development

### Backend Development

```bash
cd backend

# Run with auto-reload
cargo watch -x run

# Run tests
cargo test

# Lint
cargo clippy

# Format
cargo fmt
```

### Frontend Development

```bash
cd frontend

# Development mode
npm run dev

# Run tests
npm test

# Lint
npm run lint

# Format
npm run format
```

### Building for Production

```bash
# Build backend
cd backend
cargo build --release

# Build and package Electron app
cd ../frontend
npm run build
npm run electron:build
```

This creates distributable packages in `frontend/dist/`:
- `.AppImage` - Universal Linux package
- `.deb` - Debian/Ubuntu package
- `.rpm` - Fedora/RHEL package

## Contributing

Contributions are welcome! Please read the technical specification and architecture documentation before contributing.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

### Phase 1: Core Features (Current)
- [x] Specification and documentation
- [ ] Backend API implementation
- [ ] Frontend UI components
- [ ] AI integration
- [ ] Dynamic tool system

### Phase 2: Enhancement
- [ ] Advanced analytics
- [ ] Tool templates library
- [ ] Export/import functionality
- [ ] Offline AI support

### Phase 3: Expansion
- [ ] Cloud sync (optional)
- [ ] Mobile companion app
- [ ] Collaboration features
- [ ] Plugin system

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Acknowledgments

- OpenAI for GPT-4 API
- Material-UI team for the component library
- Rust and Actix-Web communities
- Electron and React teams

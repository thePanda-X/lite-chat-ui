# liteUI Chat

A modern, lightweight local AI chat interface built with React and TypeScript. Connect to your Ollama models for private, fast, and powerful conversations.

![Screenshot placeholder](https://via.placeholder.com/800x400?text=liteUI+Chat+Interface)

## Features

- 🤖 **Local AI**: Connect to your own Ollama instance - no external APIs
- 💬 **Streaming Responses**: Real-time message streaming for smooth conversations
- 📝 **Markdown Support**: Full markdown rendering with GitHub Flavored Markdown, math (KaTeX), and syntax highlighting
- 🧠 **Thinking Process**: Displays reasoning/thinking steps from compatible models (e.g., DeepSeek R1)
- 📊 **Usage Stats**: View token counts and response timing for each message
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations and gradients
- ⚙️ **Configurable**: Easily set your Ollama server URL through settings
- 🔄 **Model Switching**: Quickly switch between multiple installed Ollama models

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Markdown** - Markdown rendering
- **Lucide React** - Icon library
- **React Syntax Highlighter** - Code highlighting
- **KaTeX** - Math rendering

## Prerequisites

- Node.js (18+)
- Ollama installed and running locally or on a remote server

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lite-chat-ui.git
cd lite-chat-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start Ollama (if not already running):
```bash
ollama serve
```

4. Run the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

## Usage

### First Setup

1. Open the settings dialog (gear icon in the top-right)
2. Enter your Ollama server URL (default: `http://localhost:11434`)
3. Select a model from the dropdown menu
4. Start chatting!

### Keyboard Shortcuts

- `Ctrl + Enter` - Send message
- Click on settings to configure Ollama URL
- Click the trash icon to clear chat history

### Models

liteUI works with any Ollama-compatible model. Some popular choices:

- `llama3.2` - General purpose
- `deepseek-r1` - With thinking/reasoning support
- `codellama` - Code generation
- `mistral` - Balanced performance
- `gemma2` - Google's open model

## Project Structure

```
lite-chat-ui/
├── components/
│   ├── ChatInterface.tsx       # Main chat UI
│   ├── MarkdownRenderer.tsx    # Markdown + syntax highlighting
│   ├── ThinkingDisclosure.tsx  # Collapsible thinking process
│   ├── StatsDisplay.tsx        # Token usage & timing stats
│   ├── SettingsDialog.tsx      # Settings modal
│   └── ui/                     # Reusable UI components
│       ├── Button.tsx
│       └── Select.tsx
├── services/
│   └── ollamaService.ts        # Ollama API client
├── types.ts                    # TypeScript types
├── App.tsx                     # Root component
└── index.tsx                   # Entry point
```

## Building

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Configuration

The application stores your Ollama base URL in localStorage. To configure:

- Click the settings (⚙️) button in the header
- Enter your Ollama server URL (e.g., `http://localhost:11434` or a remote server)
- Save - models will be automatically loaded

## Development

Run the development server with hot module replacement:

```bash
npm run dev
```

## Features in Detail

### Streaming Responses

All messages are streamed in real-time from the Ollama API, providing immediate feedback as tokens arrive.

### Markdown & Code Highlighting

Full markdown support including:
- Headers, lists, blockquotes
- Code blocks with syntax highlighting
- Tables (GFM)
- Math equations (KaTeX)
- Links and images

### Thinking Process

Models that output reasoning (e.g., DeepSeek R1) display their thinking process in a collapsible section, letting you see the model's reasoning chain.

### Usage Statistics

Each AI response shows:
- Input tokens (prompt)
- Output tokens (completion)
- Total tokens
- Response time in seconds

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Ollama](https://ollama.com/)
- Icons by [Lucide](https://lucide.dev/)

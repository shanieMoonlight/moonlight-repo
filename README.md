# SpiderBaby Open Source Libraries

This monorepo contains a collection of open source Angular libraries and utilities developed by SpiderBaby, along with demo applications showcasing their usage.

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Overview

This repository is organized as a monorepo containing multiple packages:

- **Libraries**: Reusable packages published to npm under the `@spider-baby` scope
- **Demo Applications**: Showcase applications that demonstrate library features

## Core Libraries

### [@spider-baby/material-theming](libs/packages/@spider-baby/theming)

A powerful, flexible theming system for Angular Material with dynamic theme switching, section-based theming, and Material Design 3 support.

```bash
npm install @spider-baby/material-theming
```

#### Key Features:
- 🎨 **Dynamic theme switching** - Change themes without page reload
- 🌓 **Light/dark mode support** - Per-theme or system preference
- 📱 **Material Design 3 support** - CSS variables-based approach
- 🧩 **Section-based theming** - Different themes for different parts of your app
- 💾 **Theme persistence** - Remember user preferences

[→ View Material Theming Demo](https://spiderbabymaterialtheming.web.app/)

### [@spider-baby/mini-state](libs/packages/@spider-baby/mini-state)

A lightweight, reactive state management library for Angular that simplifies handling async operations.

```bash
npm install @spider-baby/mini-state
```

#### Key Features:
- 🔄 **Reactive state management** with both RxJS Observables and Angular Signals
- 🚦 **Built-in loading states** for async operations
- 🚨 **Error handling** with customizable error messages
- 🔄 **Automatic cleanup** with Angular's DestroyRef integration
- 📦 **CRUD operations support** for collection-based data

[→ View MiniState Demo](https://your-demo-url.com/) <!-- Replace with actual demo URL when available -->

## Project Structure

```
moonlight-repo/
├── apps/                       # Demo applications
│   ├── mini-state/             # MiniState library demos
│   └── sb-mat-thm-demo/        # Material Theming library demos
│
├── libs/                       # Library packages
│   ├── packages/               # Main packages for publishing
│   │   └── @spider-baby/       # Scoped packages
│   │       ├── mini-state/     # MiniState library
│   │       └── theming/        # Material Theming library  
│   ├── ui/                     # UI component libraries
│   └── utils/                  # Utility libraries
│
└── README.md                   # This file
```

## Development

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Angular CLI

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/moonlight-repo.git
cd moonlight-repo

# Install dependencies
npm install

# Start a demo application
npm run start:spider-baby-mini-state-demo
# or
npm run start:sb-mat-thm-demo
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

All projects in this repository are licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# SpiderBaby Open Source Libraries

This monorepo contains a collection of open source Angular libraries and utilities developed by SpiderBaby, along with demo applications showcasing their usage.

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Overview

This repository is organized as a monorepo containing multiple packages:

- **Libraries**: Reusable packages published to npm under the `@spider-baby` scope and other core packages
- **Demo Applications**: Showcase applications that demonstrate library features (see `apps/`)

## Core Libraries

### [@spider-baby/material-theming](libs/packages/@spider-baby/theming)

A powerful, flexible theming system for Angular Material with:
- Dynamic theme switching (no reload)
- Light/dark mode support
- Material Design 3 (M3) color system
- Customizable, persistent themes
- Hierarchical and section-based theming
- Performance-optimized with CSS variables

[Live Demo](https://spiderbabymaterialtheming.web.app/)

```bash
npm install @spider-baby/material-theming
```

#### Key Features:
- 🎨 **Dynamic theme switching** - Change themes without page reload
- 🌓 **Light/dark mode support** - Per-theme or system preference
- 📱 **Material Design 3 support** - CSS variables-based approach
- 🧩 **Section-based theming** - Different themes for different parts of your app
- 💾 **Theme persistence** - Remember user preferences

---

### [@spider-baby/mini-state](libs/packages/@spider-baby/mini-state)

A lightweight, reactive state management library for Angular:
- Handles async operation states (loading, error, success)
- Works with RxJS and Angular Signals
- Modular, with extensions for CRUD and combined state
- Minimal boilerplate, easy integration

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

---

## UI Component Libraries

### [spider-baby-ui-kit](libs/ui/ui-kit)
A comprehensive UI component library providing reusable, modular Angular components:
- **Component Categories:** Buttons, checkboxes, inputs, modals, progress bars, ripple effects, selects, tables, tooltips, and more
- **Utilities & Types:** Shared helpers and type definitions for UI components
- **Testing & Configuration:** Includes Jest, ESLint, and TypeScript configs for robust development

Run its unit tests with:
```
nx test spider-baby-ui-kit
```

---

## Authentication & Identity

### [@spider-baby/auth-signal](libs/auth/auth-signal)
A feature-rich Angular library for JWT-based authentication, designed for modern Angular apps using signals.
- **Reactive JWT Authentication:** Converts JWT tokens into Angular signals for real-time, reactive UI updates
- **Type-Safe Claims Access:** Strongly typed JWT payloads with extensible interfaces
- **Automatic Token Expiry:** Built-in detection and handling of token expiry
- **Cross-Platform Storage:** Supports both synchronous and asynchronous storage (browser, Ionic, etc.)
- **Auth Guards & Role-Based Access:** Easy role and permission checking for route guards and UI components
- **Universal Support:** Works in browser, Node.js, and mobile environments
- **Multiple Implementations:** Ready-to-use for Firebase, custom auth systems, and more

Install:
```bash
npm install @spider-baby/auth-signal
```

### [spider-baby-auth-jwt-utils](libs/auth/jwt-utils)
- Utility functions for working with JWTs in Angular
- Used internally by other auth libraries (like `auth-signal`)

Run its unit tests with:
```
nx test spider-baby-auth-jwt-utils
```

---

### MyID Core Packages (`libs/myid`)

The `libs/myid` folder contains the core packages for the MyID authentication and identity system, designed for modular, enterprise-grade authentication flows:

- **spider-baby-myid-auth**: Provides authentication logic, services, and guards for the MyID system. This is the main entry point for integrating MyID authentication into your Angular applications. Includes support for advanced flows such as two-factor authentication, user management, and session handling.
- **spider-baby-myid-io**: Contains IO and API models, DTOs, and interfaces for the MyID system. This package standardizes the data contracts and communication between frontend and backend services, ensuring type safety and consistency.
- **spider-baby-myid-ui**: Offers a suite of UI components and utilities for building user interfaces around MyID authentication. Includes ready-to-use components for login, registration, password reset, two-factor verification, and more, all designed to be easily integrated and customized.

Each package is independently testable with Nx. For example:
```
nx test spider-baby-myid-auth
nx test spider-baby-myid-io
nx test spider-baby-myid-ui
```

---

## Other Libraries

- The `libs/ui`, `libs/utils`, `libs/tools`, and other folders contain additional UI components, utilities, and developer tools, each organized as independent libraries or modules.
- The `libs/packages` folder is the main location for publishable npm packages under the `@spider-baby` scope.

---

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
│   ├── ui/                     # UI component libraries (see ui-kit)
│   ├── auth/                   # Authentication libraries (see above)
│   ├── myid/                   # MyID core packages
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

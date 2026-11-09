# Manager UI

The portfolio content editor dashboard for the platform.

[![React Version](https://img.shields.io/badge/React-19.3-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## Overview

The manager UI acts as the visual headless CMS interface for the platform. It interacts securely with the `manager` gRPC backend via the API gateway to let you visually edit portfolios, add showcase projects, tag technologies, map out work experiences, and review contact messages.

## Architecture

This section explains the technologies and physical layout of the manager UI.

- **Framework**: Built with React 19 and compiled using Vite for hot-module replacement
- **Package manager**: Managed and executed using `bun`
- **Styling**: Styled with Tailwind CSS v4, utilizing `shadcn` tooling and `@base-ui/react` primitives
- **State**: Uses `@tanstack/react-query` for asynchronous state management and `@tanstack/react-form` for complex form handling
- **Routing**: Client-side navigation handled by React Router v8

### Project structure

- `public/`: Static assets
- `src/`: React component source code
- `index.html`: Application entrypoint template
- `package.json`: Dependencies and scripts
- `vite.config.ts`: Vite configuration

## Features

This section outlines the capabilities of the manager UI.

- **Performance**: Bootstrapped with Vite and React 19 Compiler plugins for rendering performance.
- **Design**: Built using `@base-ui/react` and Tailwind CSS, with a dark-only theme.
- **Reactive data**: Uses TanStack Query to provide caching, background data synchronization, and invalidation after mutations.
- **Search**: Client-side search on the Technologies and Projects lists.
- **Type-safe validation**: Forms and API responses validate strictly on the client side using `zod`.

## Platform routing

The manager dashboard is structured around the core entities of a portfolio:

- `/about`: Update the core profile and cover images
- `/technologies`: Manage the taxonomy of the tech stack
- `/projects`: Add and edit showcase projects
- `/experiences`: Visually map the timeline of companies and nested job positions
- `/messages`: Review contact form submissions

## Getting started

This section explains how to run the manager UI locally.

### Prerequisites

- [Bun](https://bun.sh/) to manage dependencies and run scripts

### Configuration

Export these variables directly in your shell environment:

| Variable | Description | Required |
| :--- | :--- | :---: |
| `VITE_AUTH_API_URL` | Endpoint for the public auth API routes | **Yes** |
| `VITE_MANAGER_API_URL` | Endpoint for the public manager API routes | **Yes** |
| `VITE_CONSOLE_URL` | Base URL of the deployed console UI | **Yes** |

### Running locally

Install dependencies and start the development server:

```bash
bun install
bun run dev
```

### Build for production

Compile the application into static HTML, CSS, and JS assets for deployment:

```bash
bun run build
```

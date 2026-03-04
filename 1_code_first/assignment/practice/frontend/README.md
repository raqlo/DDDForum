# Frontend

A frontend application built with [React](https://react.dev/), [Vite](https://vite.dev/), and TypeScript.

## Prerequisites

- [Bun](https://bun.com) v1.3.9 or later

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure API Endpoint (Optional)

The application is configured to connect to the backend API at `http://localhost:3000` by default. If your backend is running on a different URL, you can update it in `src/services/apiHandler.ts:14`.

### 3. Run the Application

For development with hot reload:

```bash
bun run dev
```

The application will start on `http://localhost:5173` by default.

For production build:

```bash
bun run build
```

To preview the production build:

```bash
bun run preview
```

## Available Scripts

- `bun run dev` - Start the development server with hot reload
- `bun run build` - Build the application for production
- `bun run preview` - Preview the production build locally
- `bun run lint` - Run ESLint for code quality checks

## Tech Stack

- **Runtime**: Bun
- **Framework**: React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS with DaisyUI
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Form Validation**: Zod

## Project Structure

```
frontend/
├── src/
│   ├── services/        # API handlers and services
│   ├── components/      # React components
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
└── package.json         # Project dependencies and scripts
```
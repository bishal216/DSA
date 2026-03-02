# DSA Visualizer

A web-based Data Structures and Algorithms visualizer built with React and TypeScript, and Radix UI.

**Live Demo**: [https://dsanotes.com](https://dsanotes.com)

## Features

- Interactive Data Structure Visualizations
- Algorithm Demonstrations with step-by-step animations
- Common DSA Problem Solutions
- 8 built-in colour themes

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm package manager

### Installation

```bash
git clone https://github.com/bishal216/DSA.git
cd DSA
npm install
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |
| `npm run typecheck` | Run TypeScript type checking |

## Adding a New Theme

Themes are defined in two files. Adding a theme requires changes to both.

### 1. Register the theme name

In `src/context/theme-context.ts`, add your theme name to the `THEMES` array:

```ts
export const THEMES = [
  "green",
  "rainforest",
  "candy",
  "blue",
  "sunset",
  "mint",
  "purple",
  "dark",
  "your-theme", // ← add here
] as const;
```

The `Theme` type and all toggle logic update automatically.

### 2. Define the CSS variables

In `src/styles/index.css`, add a `[data-theme]` block inside `@layer base`:

```css
[data-theme="your-theme"] {
  --color-primary:          #hex;
  --color-primary-dark:     #hex;
  --color-primary-light:    #hex;
  --color-dark:             #hex;   /* text / foreground */
  --color-light:            #hex;   /* background */
  --color-background:       #hex;
  --color-foreground:       #hex;
  --color-card:             #hex;
  --color-card-foreground:  #hex;
  --color-border:           #hex;
  --color-muted:            #hex;
  --color-muted-foreground: #hex;
}
```

All 12 variables should be defined. Components use these via Tailwind utilities like `bg-primary`, `text-foreground`, `border-border` — they pick up the new values automatically.

### Variable reference

| Variable | Used for |
|----------|----------|
| `--color-primary` | Buttons, accents, highlights |
| `--color-primary-dark` | Hover states, darker accents |
| `--color-primary-light` | Subtle backgrounds, chips |
| `--color-dark` | Text, icons |
| `--color-light` | Page background |
| `--color-background` | Same as light — explicit semantic alias |
| `--color-foreground` | Same as dark — explicit semantic alias |
| `--color-card` | Card backgrounds |
| `--color-card-foreground` | Text inside cards |
| `--color-border` | Borders, dividers |
| `--color-muted` | Subtle surface backgrounds |
| `--color-muted-foreground` | Secondary text, placeholders |

## Contributing

All contributions are welcome. Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Wiki

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/bishal216/DSA)
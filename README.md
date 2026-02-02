# 🚀 UDUDNIME — Advanced Web-Based Anime Ecosystem

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4fc08d?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38b2ac?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Jikan API](https://img.shields.io/badge/Jikan_API-v4-blue?style=for-the-badge)](https://jikan.moe/)

**UDUDNIME** is a high-fidelity web-based anime catalog built with **Vue 3** + **Vite**. Beyond a simple directory, it serves as a personal anime dashboard prioritizing performance, localization, and robust user data persistence.

---
## ✨ Core Highlights & Features

### 📅 1. Smart Schedule Sync (JST → WIB)
- Fetches daily release schedules from the `/schedules` endpoint.
- Automatic real-time conversion from **JST (GMT+9)** to **WIB (GMT+7)**.
- Horizontal date selector for seamless 7-day release navigation.
- Optimized rendering to ensure a smooth UX across both mobile and desktop.

### 🌐 2. Quad-Language Localization (i18n)
Full multi-language support with an instant switching system:
- **English**: Global professional standard.
- **Indonesian**: Formal national language.
- **Japanese**: Authentic Otaku-centric Romaji experience.
- **Boso Jowo**: Authentic local Malangan dialect (East Java).

### 💾 3. Data Persistence & JSON Portability
- **Backup**: Export all user profiles, watchlists, and customizations to a `.json` file.
- **Restore**: Instantly recover data across different browsers or devices.
- **Sync**: Automated **LocalStorage** integration for session security.
- **Feedback**: Centralized Toast notifications for all critical data actions.

### 🎨 4. Dynamic Identity System
- **Theming**: Live theme switching powered by a **CSS Variables** architecture.
- **Visuals**: Full control over accent colors, glow effects, background blur, and brightness.
- **Seasonal Engine**: Automatic season detection for tailored content recommendations.

### 🎮 5. Gamification (XP & Leveling)
- **XP System**: Experience points accumulated through user interactions.
- **Auto Level-up**: Built-in leveling logic with real-time toast feedback.
- **Milestones**: Dynamic rank titles that evolve based on user level milestones.

---

## 🧠 Technical Architecture

### 🧩 Component Overview
| Component | Description |
|---------|------------|
| `HomeView.vue` | Main hub managing Lazy-Loading for all secondary components. |
| `ScheduleMiniView.vue` | Release schedule engine with integrated time conversion algorithms. |
| `DashboardModal.vue` | User control center handling profile, avatar, and backup/restore I/O. |
| `SearchBar.vue` | Implements **500ms Debouncing** to prevent Jikan API rate-limiting. |
| `Toast.vue` | Centralized notification system for global user feedback. |

### ⚙️ Tech Stack
- **Framework**: Vue 3 (Composition API, `script setup`)
- **Bundler**: Vite (Fast HMR & Optimized Builds)
- **Styling**: Tailwind CSS + PostCSS (Advanced Glassmorphism design)
- **State**: Reactive `ref`, `computed`, and LocalStorage synchronization.
- **Icons**: Font Awesome 6 (Solid & Brands)
- **API**: Jikan API v4 (Official REST API for MyAnimeList)
---

## 🚀 Installation & Setup
Follow these steps to get a local copy of the project up and running on your machine:

### 1. Prerequisites
- **Node.js**: Version 16.x or higher.
- **NPM/Yarn**: Your package manager of choice.

### 2. Step Installation
```bash
# Clone repository this
git clone [https://github.com/haku47/ududnime.git](https://github.com/haku47/ududnime.git)

# Enter into the project
cd ududnime

# Install all dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add the API base URL:
```bash
VITE_API_BASE_URL=[https://api.jikan.moe/v4](https://api.jikan.moe/v4)
```

### 4. Run application
```bash
# Developer Mode
npm run dev

# For Build Production
npm run build
```

## 📁 Project Structure

```txt
ududnime/
├─ .vscode/           # Visual Studio Code settings
├─ public/            # Public assets & static files
├─ src/               # Application source code
│  ├─ assets/         # Global styles, fonts, and base images
│  ├─ components/     # Reusable UI components
│  ├─ views/          # Main page views & layouts
│  ├─ router/         # Vue Router configuration
│  ├─ services/       # API abstraction & fetcher logic
│  ├─ utils/          # I18n translations & time utilities
│  ├─ App.vue         # Root component
│  └─ main.js         # Entry point
├─ .gitignore         # Git ignore rules
├─ index.html         # Application entry point
├─ package.json       # Project manifest
├─ postcss.config.js  # PostCSS config
├─ tailwind.config.js # Tailwind CSS customization
└─ vite.config.js     # Vite engine configuration
```
## 📜 License

This project is licensed under the **MIT License**.

Copyright (c) 2026 - Alviensyah Mohammad

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

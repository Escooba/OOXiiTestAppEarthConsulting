# OOXii Field App — In-Depth Instruction Manual & Setup Guide

Welcome to the **OOXii Field Vision Assessment App**, a guided, step-by-step tool designed for community vision testers and health professionals. This application provides automated clinical routing, offline-first SQLite data storage, gamified rewards, and comprehensive vision testing workflows.

---

## Table of Contents
1. [Required Software & Prerequisites](#1-required-software--prerequisites)
2. [Installation & Setup](#2-installation--setup)
3. [Running the Application](#3-running-the-application)
4. [User Guide & Core Workflows](#6-user-guide--core-workflows)
5. [Available Scripts & Commands](#4-available-scripts--commands)
6. [Application Architecture & Storage](#5-application-architecture--storage)
8. [Developer Console & Utilities](#7-developer-console--utilities)
9. [Troubleshooting](#8-troubleshooting)

---

## 1. Required Software & Prerequisites

Before running the application, ensure the following software is installed on your environment:

### Required Dependencies
* **Node.js**: `v18.0.0` or higher (Recommended: `v20.x LTS`).
  * Download: [https://nodejs.org](https://nodejs.org)
  * Verify version in terminal:
    ```bash
    node -v
    ```
* **npm** (Node Package Manager): `v9.0.0` or higher (automatically bundled with Node.js).
  * Verify version in terminal:
    ```bash
    npm -v
    ```
* **Modern Web Browser**: Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari with WebAssembly (WASM) and IndexedDB enabled.


## 2. Installation & Setup

After downloading and extracting the app zip file, follow these steps to set up the repository on your local machine:

1. **Open your Terminal / Command Prompt** and navigate to the project directory, e.g.:
   ```bash
   cd e:downloads\OOXii
   ```

2. **Install Project Dependencies**:
   Execute `npm install` to download all required packages (React, Tailwind CSS, Vite, Motion, Lucide icons, sql.js, and Capacitor plugins):
   ```bash
   npm install
   ```

---

## 3. Running the Application

### Development Server
To launch the local development server with hot-reload enabled:

```bash
npm run dev
```

* The terminal will output a local URL (typically `http://localhost:5173/` or `http://localhost:5174/`).
* Open your browser and navigate to `http://localhost:5173/`.

---

## 4. User Guide & Core Workflows

### A. Account Sign-Up & Login
1. **New Account**: Tap **Create an account** on the login screen.
   * Step 1: Email & password validation (min 8 chars, uppercase, special char).
   * Step 2: Tester profile info (First Name, Last Name, Gender, Country, State/Province, City).
   * Step 3: Role (Optometrist, Ophthalmic Nurse, Community Tester, etc.), Experience, Organisation.
2. **Login**: Enter registered email & password to sign in.

### B. Test Region Selection
* Upon logging in, testers are prompted with the **Region Reselection Modal** to confirm or update their testing region (e.g. Village/Town, City, State, Country) for the active session.

### C. Conducting Vision Tests
1. Tap **Start new test** on the Home screen.
2. Enter or select client OOXii ID, birth year, gender, and cataract surgery history.
3. Follow Bun the mascot's spotlight guidance through the clinical test sequence:
   * Distance vision line selection & letter verification (Right eye, Left eye, Both eyes).
   * Near vision reading card.
   * Wheel Pupil Distance (PD) scale.
   * Wheel refraction dials & two-colour comparison.
   * Distance glasses frame selection & color picker (Plastic/Metal, blue, red, yellow, green, black, white).
   * Sunglasses & payment checklist.
   * Final review & test completion.

### D. Profile & Gamification
* View total earned **Carrots** (🥕), **Clients Tested**, **Badges Earned**, and **Next Badge Progress** bar.
* Switch between **OOXii Dark Purple Theme** and **Light Mode** in Settings (⚙️).
* Switch language between **English** and **Spanish** in Settings (⚙️).

---

## 5. Available Scripts & Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches Vite local development server with hot module replacement (HMR). |
| `npm run build` | Compiles optimized HTML, CSS, JavaScript, and WebAssembly bundles to `dist/`. |
| `npm test` | Runs the full Vitest automated test suite once. |
| `npm run test:watch` | Runs Vitest unit tests in interactive watch mode. |
| `npm run typecheck` | Runs TypeScript compiler check (`tsc --noEmit`) to verify zero type errors. |

---

## 6. Application Architecture & Storage

* **Frontend Framework**: React 18 + TypeScript + Vite 6 + Tailwind CSS + Motion (AnimatePresence / motion).
* **Offline-First Database Layer**:
  * Runs a real WebAssembly-compiled SQLite database engine in-browser via `sql.js`.
  * Persists database binary snapshots into browser **IndexedDB** under database name `OOXii_SQLite_Store`.
  * Automatically executes migrations (`001` through `007`) on startup.
* **Account Isolation**:
  * Client records, test sessions, carrot rewards, and badges are isolated per tester account (`created_by_tester_id`).

---

## 7. Developer Console & Utilities

Open Browser DevTools (`F12` or `Ctrl+Shift+I` -> **Console** tab) for useful commands to test the app:

### Seed 300 Completed Tests (Dev Helper)
```javascript
await window.seedCompletedTests(300);
```
* Generates 300 completed test sessions with distinct client records, awards carrots, evaluates badges, and reloads the screen.
* Test the badge, garden and completed test tracker functionality with this command.

### Clear Local SQLite Database & Storage
```javascript
indexedDB.deleteDatabase('OOXii_SQLite_Store'); localStorage.clear(); sessionStorage.clear(); location.reload();
```
* Clears all local database state and resets the application to a fresh install state.

---

## 8. Troubleshooting

### Port Already in Use
If port `5173` is occupied, Vite will automatically switch to `5174` or `5175`. Look at the terminal output for the active URL.

### WebAssembly (WASM) / WebSqlite Loading Error
Ensure your browser has WebAssembly and IndexedDB enabled. If running in a strict iframe or restricted environment, allow third-party storage access.

### TypeScript / Module Resolution Issues
Run `npm run typecheck` to inspect any missing dependency imports or type definitions.

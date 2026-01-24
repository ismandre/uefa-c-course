# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + Vite application for UEFA C course content, using modern Vue 3 features with the Composition API, Pinia for state management, and Vue Router for navigation.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with hot-reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint and auto-fix issues
npm run lint

# Format code
npm run format
```

## Architecture

### Tech Stack

- **Frontend Framework**: Vue 3 (Composition API with `<script setup>`)
- **Build Tool**: Vite 7.x
- **State Management**: Pinia (using the setup store pattern)
- **Routing**: Vue Router 4 (using `createWebHistory`)
- **Code Quality**: ESLint 9.x (flat config) + Prettier

### Project Structure

- `src/main.js` - Application entry point, initializes Pinia and Vue Router
- `src/App.vue` - Root component
- `src/router/index.js` - Router configuration (currently empty routes array)
- `src/stores/` - Pinia stores using Composition API style (setup stores)
- `public/` - Static assets served at root

### Key Patterns

- **Stores**: Use Pinia setup stores pattern (function-based with `defineStore`), returning reactive refs and computed values
- **Components**: Use `<script setup>` syntax for Vue 3 Composition API
- **Path Aliases**: `@` is aliased to `./src` in vite.config.js

### Configuration Notes

- ESLint uses the new flat config format (`eslint.config.js`)
- Node version requirement: ^20.19.0 || >=22.12.0
- Vue DevTools plugin is enabled for development
- Prettier is configured to skip formatting conflicts with ESLint

### Question Management

Questions are stored in TSV (tab-separated values) files located in `src/data/questions/`:
- **File naming**: `{subject_code}_questions_pt{number}.tsv` (e.g., `pni_questions_pt1.tsv`)
- **Format**: Tab-delimited TSV with headers: `Predmet	Pitanje	Tip_pitanja	Odgovor_A	Odgovor_B	Odgovor_C	Odgovor_D	Tocan_odgovor	Napomena`
- **Question types**:
  - `visestruki_izbor` (multiple choice) - correct answer is A/B/C/D
  - `otvoreno` (open-ended) - correct answer is full text
- **Loading**: Questions are loaded dynamically using Vite's `import.meta.glob` when quiz view mounts
- **Subject mapping**: TSV files map to classes via abbreviations (PNI→1, ODS→2, OPS→3, UAFS→4, UMS→5, OMT→6, OMTK→7)
- See `src/data/questions/README.md` for detailed TSV format documentation

## Product Specification

### Core Purpose

A centralized learning hub for UEFA C coaching candidates to bridge the gap between fragmented Google Drive materials and exam preparation via a persistent quiz engine. The instructions and labels inside of the web app should be displayed in Croatian language, but the rest of the code and implementation should be done in English.

### Functional Requirements (MVP)

1. **Lightweight Identity:** - Onboarding: Single prompt for "Full Name".
   - Persistence: Store ID in `localStorage`; no password/registration required.
2. **Resource Dashboard:**
   - Grouping: Classes categorized by "Predmet" (Subject).
   - Details: Display name, date, and type (Live/Online).
   - Integration: Hardcoded buttons linking to external Google Drive (Notes, Slides, Videos).
3. **Quiz & Progress System:**
   - Question Types:
     - _Multiple Choice_: Selection with instant validation.
     - _Open-Ended_: User input + "Reveal Answer" + "Self-Grade" toggle.
   - Logic: Random sequence generation per session.
   - History: For every question, fetch and display a log of the user's past attempts (Correct/Incorrect + Timestamp).
4. **Data Management:**
   - Seed the database using the provided `questions.csv`.
   - Map `Predmet` column to the Class/Module structure.

### User Stories

- "I want to see all materials for 'PNI' in one place so I don't search through emails."
- "I want to practice open-ended exam questions and see my improvement over time."
- "I want the app to remember my progress even if I close my browser tab."

### Success Criteria

- User can successfully navigate from the Dashboard to a randomized Quiz.
- Every quiz attempt is recorded in the SQLite database and visible in the question history UI.
- Application is accessible via a public URL (Vercel/Render).

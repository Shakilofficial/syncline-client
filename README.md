# 🌌 Syncline Frontend Client

Welcome to the **Syncline Client** — a state-of-the-art, high-performance web dashboard built for collaborative project tracking and real-time task management. 

Syncline provides a visually stunning, glassmorphic workspace layout designed with fluid radial gradients, responsive Kanban boards, granular permission scopes, and smooth micro-interactions that operate in perfect sync with the backend services.

---

## 🛠️ Tech Stack & Client Architecture

The frontend client utilizes a modern, reactive stack to deliver instant optimistic UI updates and robust type safety:

- **Framework**: [Next.js 16.2](https://nextjs.org/) (App Router & Turbopack compiler)
- **Runtime Library**: [React 19](https://react.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Lightweight, decoupled store for authorization)
- **Server Cache & Async Queries**: [TanStack React Query v5](https://tanstack.com/query/latest) (Optimistic updates, retry logic, and global caching)
- **Styling & Theme Engine**: [Tailwind CSS v4](https://tailwindcss.com/) & [next-themes](https://github.com/pacocoursey/next-themes) (System-integrated Dark/Light mode)
- **Component Primitives**: [Shadcn UI](https://ui.shadcn.com/) & [Base UI](https://base-ui.com/)
- **Real-Time Synchronisation**: [Socket.IO Client](https://socket.io/) (Bi-directional WebSocket streams)
- **HTTP Client**: [Axios](https://axios-http.com/) (Token interceptors & fallback controllers)
- **Icon Set**: [Lucide React](https://lucide.dev/)

---

## ✨ Features & Interface Layouts

### 1. 🔐 Robust Auth layouts & Demo Credentials
- Beautiful glassmorphic card configurations with subtle border glows and responsive input scales.
- Quick-login options allowing instant evaluation of the 3 key role layers:
  - **Admin**: Full workspace configuration privileges.
  - **Project Manager**: Workspace board customization, member invites, and task allocations.
  - **Team Member**: Kanban status drag updates, file attachments, and discussion commenting.

### 2. 📋 Drag & Drop Kanban Boards
- Visually clean project boards categorizing tasks under **To Do**, **In Progress**, and **Completed** lanes.
- Instant drag-and-drop action with optimistic UI state changes and Socket.io broadcasts to immediately synchronize columns across connected teammates.
- Slide-out details drawer enabling users to manage sub-items, upload attachments, and chat inside comment threads.

### 3. 📊 Interactive Dashboard & Real-Time Analytics
- Dynamic statistics widgets aggregating active projects, overdue item warnings, and completion velocities.
- Highly polished charts using [Recharts](https://recharts.org/) (Pie layout status spreads, priority bar charts, and weekly completions area charts) wrapped in stable responsive containers.

### 4. 🗂️ Users List & Tactile Table Controls
- Filter and search users by role and activity status.
- Tactile, color-coded action buttons with subtle click transitions (`active:scale-95`) for managing profile records, changing workspace role parameters, and toggling activation states.

### 5. 📜 timeline-Track Legal Pages
- Modernized `/terms` and `/privacy` layouts.
- Left-hand sticky Table of Contents that tracks scroll-depth using a custom active vertical progress timeline, allowing users to scroll document panels smoothly on the right.

### 6. 🌐 Global Error, Loading & Compass 404 Pages
- Custom global loader (`loading.tsx`) featuring orbit spinner rings and breathing background orbs.
- Interactive Compass 404 page (`not-found.tsx`) with dynamic bouncing animations.
- Resilient recovery error boundaries (`error.tsx`) capturing logs and displaying error resets.

---

## 📁 Project Directory Layout

```text
syncline/client/
├── public/                 # Static public assets (brand icons, illustrations)
└── src/
    ├── app/                # Next.js Page Routes & Core Wrappers
    │   ├── (withAuthLayout)/       # Login, Signup layouts
    │   ├── (withDashboardLayout)/  # Main Dashboard, Projects, Users views
    │   ├── terms/                  # Terms of service page
    │   ├── privacy/                # Privacy policy page
    │   ├── layout.tsx              # Root HTML wrapper & Font config
    │   ├── loading.tsx             # Global loading fallback screen
    │   ├── not-found.tsx           # Global 404 fallback page
    │   └── error.tsx               # Global error boundary handler
    ├── components/         # Reusable Component Layer
    │   ├── core/                   # Shared shell layouts, header sidebar structures
    │   ├── modules/                # Core page content modules (auth, dashboard, legal)
    │   ├── providers/              # Theme, query, socket, auth gate providers
    │   └── ui/                     # Primitives (button, card, dialog, input, sheet)
    ├── lib/                # API Client Configurations & utilities
    │   ├── apiClient.ts            # Axios interceptor instance
    │   └── utils.ts                # Class merge utilities
    └── store/              # Zustand Store
        └── useAuthStore.ts         # User authentication global state
```

---

## 🚀 Setup & Development Installation

Follow these steps to run the Syncline client locally:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v20+ recommended) installed on your system.

### 2. Install Dependencies
Navigate into the client directory and install dependencies:
```bash
cd syncline/client
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root of the `client` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
*(This maps the frontend network queries to your NestJS server instance).*

### 4. Run Development Server
Launch Next.js with Turbopack compilation:
```bash
npm run dev
```
The client will start running on **[http://localhost:3000](http://localhost:3000)**.

### 5. Compile Production Bundle
Verify TypeScript type-checking and build optimizations before deployment:
```bash
npm run build
```

---

## 🤝 Verification & Dev Workflow

- **Turbopack Compiler**: Automatically compiles modified files on change, completing full Hot Module Replacement (HMR) in milliseconds.
- **Hydration Safety**: Pages are split into Server-wrapped entries and Client Content wrappers, avoiding typical SSR hydration mismatch errors.
- **Visual Theme Transitions**: All elements are styled utilizing curated Tailwind variables, enabling seamless switching between light and dark backgrounds.

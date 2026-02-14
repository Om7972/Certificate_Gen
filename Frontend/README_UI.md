# Premium UI/UX Overhaul - CertGen Platform

This document outlines the design system, architectural choices, and component library used in the modernized frontend.

## 🎨 Global Design System

### Typography
- **Primary Font:** `Inter` (Sans-serif) for robust, readable UI text.
- **Monospace:** `JetBrains Mono` for IDs, Hashes, and Code.
- **Headings:** Bold, Tracking-tight for modern "SaaS" feel.

### Color Palette (Tailwind)
- **Primary:** Blue (`#2563eb` / `blue-600`) - Trust, Professionalism.
- **Secondary:** Slate (`#0f172a` / `slate-900`) - Deep contrast for sidebars/text.
- **Accent:** Purple/Indigo gradients - For premium "Glass" effects.
- **Status:**
  - Success: Emerald (`#10b981`)
  - Error: Red (`#ef4444`)
  - Warning: Amber (`#f59e0b`)

### Glassmorphism
We utilize a standardized "Glass" effect for cards and panels:
- `bg-white/80` or `bg-white/20` (dark mode)
- `backdrop-blur-md` or `backdrop-blur-xl`
- `border-white/20`

## 🛠 Tech Stack Changes
- **CSS Framework:** Migrated from Bootstrap 5 to **Tailwind CSS (v3.4)** via CDN (Production grade should use build step).
- **Icons:** FontAwesome 6 (Free).
- **Charts:** Chart.js with custom styling.
- **Animation:** Native CSS transitions + Tailwind `animate-pulse`, `animate-bounce`, and custom keyframes (blob animation).

## 📂 Page Structure

| Page | Status | Key Features |
|------|--------|--------------|
| `login.html` | ✅ Polished | Glassmorphism card, Animated blobs, Loading states |
| `register.html` | ✅ Polished | Password strength meter, Form validation |
| `dashboard.html` | ✅ Polished | Responsive Sidebar, Stats Cards, Chart.js integration |
| `history.html` | ✅ Polished | Data Table, Filters, Pagination |
| `verify.html` | ✅ Polished | Trust Badges, QR Scanner Modal, API Mocking |
| `generator.html` | ✅ Polished | Split layout (Sidebar/Preview), Zoom controls |
| `timeline.html` | 🆕 Created | Vertical step-based lifecycle view |
| `profile.html` | ✅ Polished | Form layouts, Toggle switches |

## 🚀 Setup Instructions

1. **No Build Step Required:** The project currently uses Tailwind CDN script for rapid deployment without Node.js build complexity.
2. **Serving:**
   - Run `npm run dev` in `Backend/` folder.
   - Or serve `Frontend/` via Python: `python -m http.server 8000`.

## 📦 Component Library (Reusable Patterns)

### Buttons
```html
<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-blue-500/30">
    Action
</button>
```

### Cards
```html
<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
    <!-- Content -->
</div>
```

### Inputs
```html
<input type="text" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all">
```

## ⚠️ Notes for Developers
- `auth.js` manages session state (`localStorage`).
- Ensure `http://localhost:5000` API is running for dynamic data.
- The `index.html` (Landing Page) was **specifically excluded** from this overhaul as per requirements.

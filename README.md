<div align="center">
    <h2>Cat Gaze</h2>
</div>

<p align="center">
Move your mouse — Hana will always be watching you.
</p>
<img width="1164" height="624" alt="Sep-06-2026 15-55-49" src="https://github.com/user-attachments/assets/d7e79cd8-02ac-4a0b-98eb-5c84d4fa1f1c" />

<p align="center">
  <a href="https://meganxli.github.io/react-calculator/">
    <img src="https://img.shields.io/badge/Demo_website-Your?&style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE5IDNINUMzLjg5NTQzIDMgMyAzLjg5NTQzIDMgNVYxOUMzIDIwLjEwNDYgMy44OTU0MyAyMSA1IDIxSDE5QzIwLjEwNDYgMjEgMjEgMjAuMTA0NiAyMSAxOVY1QzIxIDMuODk1NDMgMjAuMTA0NiAzIDE5IDNaIiBzdHJva2U9IiNGMkYzRjQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0zIDlIMjEiIHN0cm9rZT0iI0YyRjNGNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTkgMjFWOSIgc3Ryb2tlPSIjRjJGM0Y0IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K&logoColor=ffffff&color=282828" />
  </a>
</p>

### About Hana

Hana is a tortoiseshell cat 🐱 with a distinctive black-and-orange coat and a pink collar.

---

## Introduction

**Cat Gaze** is an interactive React project built from real cat photos.  
The tortoiseshell cat **Hana** follows your cursor in real time, creating the illusion that the cat is watching you.

The page offers two switchable versions:

| Version           | How it works                                                                                          |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| **GLB** (default) | A 3D head model (rendered with Three.js) turns smoothly toward the cursor while the body stays fixed. |
| **Original**      | 8 photos are stacked; the one matching the cursor direction is shown.                                 |

### GLB version controls

Shown below the caption when the GLB version is active:

- **左右** slider: yaw, −55° ~ 55°
- **抬頭／低頭** slider: pitch, −30° (look up) ~ 35° (look down)
- **跟隨滑鼠**: toggle mouse following (dragging a slider or pressing a pose button pauses it)
- **抬頭 / 低頭 / 回正**: preset poses
- **看頭部**: show the head model only
- Keyboard: focus the model and use `←` `→` `↑` `↓`; `Home` resets the pose

> The 3D head is an approximation built from the photos, so depth and the back of the head are not real measurements. Large side angles may look stretched.

---

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Three.js (pre-bundled in `glbViewerBundle.js`, MIT license)
- Plain CSS

---

## Project Structure

```
cat-gaze/
├── public/
│   ├── 01_up_left.png ~ 08_down.png   ← 8 gaze-direction photos
│   │                                    (06_forward.png is the default / fallback)
│   └── hana-fixed-body.glb            ← 3D head + fixed body model
└── src/
    ├── App.tsx                          ← root component
    ├── components/
    │   ├── CatGaze/
    │   │   ├── CatGaze.tsx              ← original version: angle calc + layer switching
    │   │   ├── CatGaze.css
    │   │   ├── GlbCatGaze.tsx           ← GLB version: viewer, sliders and pose buttons
    │   │   ├── GlbCatGaze.css
    │   │   ├── glbViewerBundle.js       ← bundled Three.js viewer
    │   │   ├── glbViewerBundle.d.ts     ← viewer type declarations
    │   │   ├── index.ts                 ← re-exports CatGaze
    │   │   └── THREE-LICENSE.txt        ← Three.js MIT license
    │   └── CatGazeStage/
    │       ├── CatGazeStage.tsx         ← container: version switch + caption + controls slot
    │       └── CatGazeStage.css
    └── hooks/
        └── useMousePosition.ts          ← custom hook to track mouse position
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

## How It Works (Original version)

```
Mouse moves
   ↓
useMousePosition hook returns cursor position (clientX, clientY)
   ↓
CatGaze calculates the angle from the cat's center to the cursor (Math.atan2)
   ↓
Splits 360° into 8 segments, maps to the matching image
   ↓
Toggles the matching layer's opacity: 0 → 1
```

## Angle Calculation

### Step 1: Get the relative position

`useMousePosition` returns the cursor's position in the viewport `(clientX, clientY)`.

`CatGaze` uses `getBoundingClientRect()` to find its own position on screen,  
computes its center point, then subtracts to get a **direction vector**:

```ts
const dx = mouseX - centerX; // positive = mouse is to the right
const dy = mouseY - centerY; // positive = mouse is below (Y-axis points down in browsers)
```

---

### Step 2: Compute the angle

The direction vector is passed to `Math.atan2(dy, dx)` to get a radian value, then converted to degrees:

```ts
const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
// Returns: -180° ~ 180°
// Normalized to 0° ~ 360° (clockwise, 0° = mouse is to the right)
```

```
        270° (up)
           ↑
 180° (left) ←  ●  → 0° (right)
           ↓
        90° (down)
```

---

### Step 3: Map to one of 8 images

360° is divided into 8 equal segments (45° each), each mapped to one photo:

```
  Angle range          Image
─────────────────────────────────
  337.5° ~ 22.5°  → 04_right      (right)
   22.5° ~ 67.5°  → 07_down_right (lower-right)
   67.5° ~ 112.5° → 08_down       (down)
  112.5° ~ 202.5° → 05_left       (left)
  202.5° ~ 247.5° → 01_up_left    (upper-left)
  247.5° ~ 292.5° → 02_up         (up)
  292.5° ~ 337.5° → 03_up_right   (upper-right)
```

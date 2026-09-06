# 🐱 Cat Gaze

![Hana](/Users/meiyi/.gemini/antigravity/brain/956a03de-3ae3-414e-aa27-ab15f45dd1a1/hana_preview.png)

> Move your mouse — Hana will always be watching you.

---

## Introduction

**Cat Gaze** is an interactive React component built with real cat photos.  
The tortoiseshell cat **Hana** tracks your cursor in real time, switching to the matching gaze-direction image based on where your mouse is — creating the illusion that the cat is watching you.

### About Hana

Hana is a tortoiseshell cat 🐱 with a distinctive black-and-orange coat and a pink collar.

---

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Plain CSS

---

## Project Structure

```
cat-gaze/
├── public/
│   ├── 01_up_left.png      ← upper-left
│   ├── 02_up.png           ← up
│   ├── 03_up_right.png     ← upper-right
│   ├── 04_right.png        ← right
│   ├── 05_left.png         ← left
│   ├── 06_forward.png      ← forward (default)
│   ├── 07_down_right.png   ← lower-right
│   └── 08_down.png         ← down
└── src/
    ├── App.tsx                          ← root component
    ├── components/
    │   ├── CatGaze/
    │   │   ├── CatGaze.tsx              ← core: angle calc + layer switching
    │   │   └── CatGaze.css
    │   └── CatGazeStage/
    │       ├── CatGazeStage.tsx         ← container: owns mouse state
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

## How It Works

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

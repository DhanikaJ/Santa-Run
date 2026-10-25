# 🎄 Santa Run

> A festive endless runner game built with vanilla HTML5, CSS3, and JavaScript. Help Santa dodge flames and deliver presents!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-000000?logo=javascript)](https://vanilla-js.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen)](https://github.com/DhanikaJ/Santa-Run/pulls)
[![Status](https://img.shields.io/badge/Status-Complete-brightgreen)]()

---

## 🎮 Demo

### Play Online
👉 **[Play Santa Run on GitHub Pages](https://dhanikaj.github.io/Santa-Run/)**

### Screenshots
| Gameplay | Game Over |
|:--------:|:---------:|
| ![Gameplay](docs/screenshots/gameplay.png) | ![Game Over](docs/screenshots/gameover.png) |

> 📸 *Screenshots coming soon — add yours to `docs/screenshots/`*

---

## ✨ Features

- 🎅 **Animated Santa Character** — Smooth sprite-based animations for idle, running, jumping, and death states
- 🔥 **Dynamic Obstacles** — Flame blocks spawn at random intervals with varying gaps
- 🌌 **Parallax Background** — Infinite scrolling background for immersive gameplay
- 📊 **Real-time Score** — Live score counter that increases as you survive
- 🔊 **Sound Effects** — Audio feedback for running, jumping, and game over
- 🔄 **Restart Functionality** — One-click restart after game over
- ⌨️ **Simple Controls** — Enter to start, Space to jump
- 📱 **Responsive Design** — Works on desktop and mobile browsers
- 🚀 **Zero Dependencies** — Pure vanilla JavaScript, no build step required

---

## 🎯 How to Play

| Key | Action |
|-----|--------|
| `Enter` | Start / Restart Game |
| `Space` | Jump (while running) |

1. Press **Enter** to start the game
2. Santa will begin running automatically
3. Press **Space** to jump over flame obstacles
4. Survive as long as possible to increase your score
5. Hit a flame → Game Over
6. Press **Enter** or click **"Try Again"** to restart

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Markup** | HTML5 |
| **Styling** | CSS3 (Flexbox, CSS Variables) |
| **Logic** | Vanilla JavaScript (ES5+) |
| **Audio** | HTML5 Audio API |
| **Graphics** | Sprite Sheets (PNG) + GIF |
| **Deployment** | Static Hosting (GitHub Pages) |
| **Paradigm** | Single-file DOM manipulation |

---

## 📁 Project Structure

```text
Santa Run/
├── index.html           # Main HTML entry point
├── script.js            # Game logic (~170 lines, single file)
├── style.css            # Styling and layout
├── .gitattributes       # Git line-ending normalization
├── run.mp3              # Running sound effect (looped, 35.5 KB)
├── jump.mp3             # Jump sound effect (5.0 KB)
├── dead.mp3             # Game over sound effect (25.9 KB)
└── images/
    ├── background.png    # Scrolling background (166 KB)
    ├── flame.gif         # Animated flame obstacle (1.3 MB)
    ├── Idle (1-16).png   # Santa idle animation — 16 frames
    ├── Run (1-11).png    # Santa running animation — 11 frames
    ├── Jump (1-16).png   # Santa jumping animation — 16 frames
    └── Dead (1-17).png   # Santa death animation — 17 frames
```

---

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome 60+, Firefox 55+, Safari 11+, Edge 79+)
- No Node.js, npm, or build tools required

### Local Development

```bash
# Clone the repository
git clone https://github.com/DhanikaJ/Santa-Run.git
cd Santa-Run

# Option 1: Open directly in browser
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux

# Option 2: Serve with a local server (recommended for audio)
npx serve .            # Requires Node.js
# OR
python -m http.server 8000
# Then open http://localhost:8000
```

> ⚠️ **Note:** Audio may not play when opening `index.html` directly via `file://` protocol due to browser security policies. Use a local server for full audio support.

---

## 🏗️ Game Architecture

### Core Game Loop
The game uses `setInterval` timers (100ms tick rate) for each subsystem:

| Timer | Interval | Purpose |
|-------|----------|---------|
| `runWorkerId` | 100ms | Santa running animation |
| `jumpWorkerId` | 100ms | Jump physics & animation |
| `backgroundWorkerId` | 100ms | Background parallax scrolling |
| `scoreWorkerId` | 100ms | Score increment |
| `createBlockId` | 100ms | Spawn new flame obstacles |
| `moveBlockId` | 100ms | Move obstacles + collision detection |
| `deadWorkerId` | 100ms | Death animation sequence |

### Game States

```text
┌──────┐    Enter    ┌────────┐   Space    ┌───────┐
│ Idle │ ───────────→ │ Running │ ─────────→ │ Jumping │
└──────┘             └─────────┘            └───────┘
                          │  Collision
                          ▼
                     ┌────────┐
                     │ Dead   │ ───→ Game Over Screen
                     └────────┘
```

- **Idle** — Waiting for Enter key (initial state)
- **Running** — Santa runs, obstacles spawn, score increases
- **Jumping** — Physics-based arc: 9 frames up (−20px/f), 8 frames down (+20px/f)
- **Dead** — Death animation plays, game over screen shows with final score

### Collision Detection
Simple AABB (Axis-Aligned Bounding Box) collision between Santa and flame blocks:

```javascript
// Block moves left at 20px per tick
// Collision zone: block marginLeft between 18px–118px (Santa's X range)
//                AND Santa's marginTop between 520px–580px (ground level)
if (newMarginLeft <= 118 && newMarginLeft >= 18) {
    if (santaMarginTop <= 580 && santaMarginTop > 520) {
        // Collision! → Trigger game over
    }
}
```

---

## 🔧 Customization

### Adjust Difficulty
Edit `script.js` to modify game parameters:

```javascript
// ── Obstacle spawn rate & gap size ──
// (script.js line 41)
var gap = Math.random() * (1000 - 400) + 400;
// ↑ Increase 400 to make gaps larger (easier)
// ↑ Decrease 1000 to make gaps smaller (harder)

// ── Game speed ──
// (script.js lines 55, 138)
var newMarginLeft = parseInt(currentMarginLeft) - 20;  // Block speed
backgroundX = backgroundX - 20;                         // Background speed
// ↑ Increase 20 for faster game, decrease for slower

// ── Jump physics ──
// (script.js lines 115, 119)
santaMarginTop = santaMarginTop - 20;  // Jump height per frame (up)
santaMarginTop = santaMarginTop + 20;  // Fall speed per frame (down)
```

### Feature Ideas
- High score persistence (`localStorage`)
- Multiple obstacle types
- Power-ups (invincibility, double score)
- Particle effects on jump/landing
- Mobile touch controls
- Pause/Resume functionality

---

## 🌐 Deployment

### GitHub Pages (Free & Recommended)

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "docs: add production README"
   git push origin main
   ```
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch** → `main` → `/ (root)`
4. Save — your game lives at `https://dhanikaj.github.io/Santa-Run/`

### Netlify
Drag & drop the `Santa Run` folder to [netlify.com/drop](https://netlify.com/drop), or connect your Git repo for auto-deploys.

### Vercel
```bash
npx vercel --prod
```

### Any Static Host
Upload all files (`.html`, `.js`, `.css`, `images/`, `.mp3` files) to any static hosting: Firebase Hosting, Surge.sh, AWS S3 + CloudFront, etc.

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Game starts on **Enter** key
- [ ] Santa runs with smooth animation
- [ ] **Space** triggers jump animation
- [ ] Jump follows proper arc (9 frames up, 8 frames down)
- [ ] Flame obstacles spawn at random intervals
- [ ] Obstacles move leftward continuously
- [ ] Collision detection triggers game over
- [ ] Score increments during gameplay
- [ ] Sound plays for run (loop), jump, and death
- [ ] Game over screen shows final score
- [ ] "Try Again" button restarts the game
- [ ] Works on mobile browsers
- [ ] No errors in browser console

### Browser Compatibility

| Browser | Version | Supported |
|---------|---------|-----------|
| Chrome | 60+ | ✅ |
| Firefox | 55+ | ✅ |
| Safari | 11+ | ✅ |
| Edge (Chromium) | 79+ | ✅ |
| Mobile Chrome | Latest | ✅ |
| Mobile Safari | Latest | ✅ |

---

## 🧾 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Whether it's bug fixes, new features, or documentation improvements.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- Use **4-space indentation** (consistent with existing code)
- Keep functions small and single-purpose
- Add comments for complex game logic
- Test in multiple browsers before submitting PR

### Commit Message Convention
| Type | Usage |
|------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code formatting, whitespace |
| `refactor:` | Code refactoring |
| `test:` | Test additions |

---

## 🐛 Known Issues

- Audio may not play on `file://` protocol (use local server)
- No high score persistence (resets on page refresh)
- No mobile touch controls (keyboard only)
- Collision detection is basic AABB (no per-pixel accuracy)
- No pause/resume functionality
- Single-file architecture (no modularity)

---

## 🗺️ Roadmap

- **v1.1** — High score persistence with `localStorage`
- **v1.2** — Mobile touch controls (tap to jump)
- **v1.3** — Pause/Resume functionality
- **v1.4** — Particle effects & visual polish
- **v2.0** — Multiple levels + difficulty modes
- **v2.0** — Power-up system (cookies, milk, gifts)

---

## 📞 Support

- 🐛 **Bug Reports**: [Open an Issue](https://github.com/DhanikaJ/Santa-Run/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Open an Issue](https://github.com/DhanikaJ/Santa-Run/issues/new?template=feature_request.md)
- ❓ **Questions**: [Start a Discussion](https://github.com/DhanikaJ/Santa-Run/discussions)

---

## ⭐ Show Your Support

If you enjoy Santa Run, please give it a ⭐ on GitHub!

---

<div align="center">

**Made with ❤️ and 🎄 holiday spirit**

[Report Bug](https://github.com/DhanikaJ/Santa-Run/issues) · [Request Feature](https://github.com/DhanikaJ/Santa-Run/issues) · [Play Now](https://dhanikaj.github.io/Santa-Run/) · [Contribute](https://github.com/DhanikaJ/Santa-Run/pulls)

</div>
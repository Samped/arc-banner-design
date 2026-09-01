# ARC Banner

A small web tool for personalizing the ARC community banner. Upload a photo, fit it to the avatar frame, export PNG or SVG.

<p align="center">
  <img src="preview.png" alt="ARC community banner preview" width="720" />
</p>

<p align="center">
  <a href="https://samped.github.io/arc-banner-design/"><strong>Open Banner Studio →</strong></a>
</p>

---

## How it works

1. Upload a profile photo  
2. Drag and zoom until the crop looks right  
3. Download **PNG** or **SVG**

Works in the browser. No account, no install.

## Development

```bash
git clone https://github.com/Samped/arc-banner-design.git
cd arc-banner-design
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy (GitHub Pages)

**Settings → Pages → Build from branch `main` → `/ (root)`**

The site will be available at:

`https://<username>.github.io/arc-banner-design/`

## Project layout

```
arc-banner-template.svg   # Template loaded by the app
arc.svg                   # Original Inkscape artwork
index.html                # UI
customizer.js             # Crop + export
styles.css
preview.png               # README preview
```

## Template

The customizer targets the circular avatar in `arc-banner-template.svg`. If you edit the artwork in Inkscape, keep the avatar clip and export paths intact — see `INKSCAPE.md` for notes.

---

ARC community banner · personal use welcome

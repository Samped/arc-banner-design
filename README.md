# ARC Community Banner

Editable SVG banner template for the ARC community. Members can add their profile photo, name, chapter/location, and optional tagline — then download as **SVG** or **PNG**.

**Live customizer:** enable [GitHub Pages](#host-on-github) and share the Pages URL.

## Quick start (community)

1. Open the customizer (`index.html` on GitHub Pages, or run locally — see below).
2. Upload your profile photo.
3. Enter your name, chapter, and optional tagline.
4. Click **Download SVG** or **Download PNG**.

## Use your Inkscape design

The placeholder `arc-banner-template.svg` is a stand-in. Replace it with **your finished Inkscape file**, but keep these element IDs so the web customizer works:

| ID | Purpose |
|---|---|
| `avatar-image` | Profile photo (`<image>` element, usually inside a clip path) |
| `user-name` | Name / username (`<text>`) |
| `user-chapter` | Chapter or location (`<text>`) |
| `custom-text` | Optional tagline (`<text>`) |

### Inkscape: assign IDs

1. Open your `.svg` in Inkscape.
2. Select the profile image placeholder → **Object → Object Properties** → set **ID** to `avatar-image`.
3. Select each text field and set IDs: `user-name`, `user-chapter`, `custom-text`.
4. For the avatar, use an `<image>` node (not a raster embedded without an image tag). A common pattern:
   - Draw a circle for the avatar frame.
   - **Object → Clip → Set**.
   - Place an `<image>` inside the clipped group with `id="avatar-image"`.
5. **File → Save As → Plain SVG** and overwrite `arc-banner-template.svg`.

See [INKSCAPE.md](./INKSCAPE.md) for step-by-step Inkscape guidance.

## Host on GitHub

1. Create a new public repo (e.g. `arc-community-banner`).
2. Push this folder:

```bash
cd "/home/samuel/Desktop/arc banner"
git init -b main
git add .
git commit -m "Add ARC community banner template and customizer"
git remote add origin https://github.com/YOUR_USERNAME/arc-community-banner.git
git push -u origin main
```

3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from branch → `main` / `/ (root)`**.
4. After a minute, your customizer is live at:

   `https://YOUR_USERNAME.github.io/arc-community-banner/`

5. Update the repo link in `index.html` (`id="repo-link"`) to your actual repo URL.

## Run locally

```bash
cd "/home/samuel/Desktop/arc banner"
python3 -m http.server 8080
```

Open `http://localhost:8080` (a local server is required so the SVG template can load).

## Contest submission

> **Editable Inkscape SVG template:** Replace the avatar, name, location/chapter, and optional tagline while keeping the original design and visual style.  
> **Template:** [link to `arc-banner-template.svg` or repo]  
> **Customizer:** [link to GitHub Pages URL]

Include a `preview.png` screenshot of a filled-in example banner for judges.

## Files

| File | Description |
|---|---|
| `arc-banner-template.svg` | Master template (swap in your Inkscape design) |
| `index.html` | Web customizer UI |
| `customizer.js` | Loads SVG, applies edits, triggers download |
| `styles.css` | Customizer styling |
| `INKSCAPE.md` | Detailed Inkscape preparation guide |

## License

Community members may personalize the template for their own profiles. Credit the original design where appropriate per contest rules.

# Preparing your Inkscape banner for the customizer

Your design stays exactly as you made it. You only need to tag four elements with specific IDs so the web app (and other Inkscape users) know what to edit.

## Recommended banner size

- **1500 × 500 px** — works well for X/Twitter and general community use.
- In Inkscape: **File → Document Properties** → set width/height and units to **px**.

## 1. Profile photo (`avatar-image`)

### Option A — Image inside a circular clip (recommended)

1. Import or draw a square placeholder where the avatar should go.
2. Draw a circle on top, sized to your avatar frame.
3. Select **both** the image and the circle → **Object → Clip → Set**.
4. Select the clipped image → **Object → Object Properties** → **ID:** `avatar-image`.

The customizer replaces the image `href` with the user's uploaded photo. The clip path keeps it circular (or whatever shape you chose).

### Option B — Plain image with no clip

1. Place an `<image>` where the avatar goes.
2. Set its ID to `avatar-image`.
3. Size it to your frame; users' photos will be scaled with `preserveAspectRatio="xMidYMid slice"` if you add that attribute in the XML.

## 2. Editable text fields

For each text object:

1. Select the text.
2. **Object → Object Properties** → set **ID**:
   - Name line → `user-name`
   - Chapter / location → `user-chapter`
   - Optional tagline → `custom-text`
3. Use placeholder text like `Your Name` so the customizer preview looks right before anyone edits.

**Tip:** Convert text to paths only for *decorative* lettering you don't want changed. Keep live text for the three fields above.

## 3. Keep artwork locked

- USDC graphics, gradients, background, and logos should **not** use the IDs above.
- Group decorative layers and name them clearly (e.g. `bg`, `usdc-art`) for your own organization.

## 4. Export for the repo

1. **File → Save As**
2. Choose **Plain SVG** (not Inkscape SVG) for smaller files and best browser compatibility.
3. Save as `arc-banner-template.svg` in this project folder.

## 5. Verify

1. Open `index.html` via a local server (`python3 -m http.server 8080`).
2. Change name/chapter/tagline — preview should update.
3. Upload a test photo — avatar should update.
4. Download SVG and open in Inkscape to confirm structure.

## Troubleshooting

| Issue | Fix |
|---|---|
| Avatar doesn't update | Ensure ID is exactly `avatar-image` on an `<image>` element |
| Text doesn't update | IDs must be on `<text>` nodes, not on a parent `<g>` |
| PNG download is blank | Embedded images must be data URLs or same-origin; re-save after uploading avatar in the customizer |
| Fonts look different in browser | Convert decorative text to paths; use web-safe fonts for editable fields (e.g. system-ui, Arial) |

## Manual Inkscape workflow (no website)

Community members can also:

1. Download `arc-banner-template.svg` from the repo.
2. Open in Inkscape.
3. Replace the avatar image (**File → Import** or edit the existing image).
4. Edit text objects directly.
5. **File → Export PNG** or save SVG.

This satisfies contest requirements for an editable template even without the web customizer.

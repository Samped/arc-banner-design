# Editing the template

`arc-banner-template.svg` is the file the app loads. `arc.svg` is the master artwork.

## Avatar frame

The profile photo sits in the circular frame (top-right card). The app injects the image at export time — you do not need to tag elements manually for the web tool to work.

If you replace the template from Inkscape:

1. Save as **Plain SVG**
2. Keep the overall layout and avatar circle geometry
3. Re-test locally with `python3 -m http.server 8080`

## Export sizes

The app exports PNG at 1500px width (height scales from the SVG viewBox).

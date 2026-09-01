const TEMPLATE_URL = "arc-banner-template.svg";

const els = {
  preview: document.getElementById("preview"),
  loading: document.getElementById("preview-loading"),
  avatarInput: document.getElementById("avatar-input"),
  nameInput: document.getElementById("name-input"),
  chapterInput: document.getElementById("chapter-input"),
  taglineInput: document.getElementById("tagline-input"),
  downloadSvg: document.getElementById("download-svg"),
  downloadPng: document.getElementById("download-png"),
};

let svgRoot = null;

async function loadTemplate() {
  const res = await fetch(TEMPLATE_URL);
  if (!res.ok) throw new Error(`Failed to load ${TEMPLATE_URL}`);
  const text = await res.text();
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  svgRoot = doc.documentElement;

  const err = doc.querySelector("parsererror");
  if (err) throw new Error("Invalid SVG template");

  els.preview.innerHTML = "";
  els.preview.appendChild(svgRoot.cloneNode(true));
  svgRoot = els.preview.querySelector("svg");

  els.loading.hidden = true;
  els.preview.hidden = false;
  bindInputs();
}

function $(id) {
  return svgRoot.querySelector(`#${id}`);
}

function setText(id, value) {
  const node = $(id);
  if (!node) return;
  const text = value.trim() || " ";
  if (node.tagName === "text" || node.tagName === "tspan") {
    node.textContent = text;
  }
}

function setAvatar(dataUrl) {
  const img = $("avatar-image");
  if (!img) return;
  img.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataUrl);
  img.setAttribute("href", dataUrl);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function bindInputs() {
  els.nameInput.addEventListener("input", () => setText("user-name", els.nameInput.value));
  els.chapterInput.addEventListener("input", () => setText("user-chapter", els.chapterInput.value));
  els.taglineInput.addEventListener("input", () => setText("custom-text", els.taglineInput.value));

  els.avatarInput.addEventListener("change", async () => {
    const file = els.avatarInput.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setAvatar(dataUrl);
  });
}

function serializeSvg() {
  const clone = svgRoot.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  return new XMLSerializer().serializeToString(clone);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "arc-banner";
}

els.downloadSvg.addEventListener("click", () => {
  const name = slugify(els.nameInput.value);
  const blob = new Blob([serializeSvg()], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, `${name}-arc-banner.svg`);
});

els.downloadPng.addEventListener("click", async () => {
  const name = slugify(els.nameInput.value);
  const svgText = serializeSvg();
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  const viewBoxParts = (svgRoot.getAttribute("viewBox") || "0 0 1500 500")
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  const vbWidth = viewBoxParts[2] || 1500;
  const vbHeight = viewBoxParts[3] || 500;
  const targetWidth = 1500;
  const width = targetWidth;
  const height = Math.round((vbHeight / vbWidth) * targetWidth);

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(url);

  canvas.toBlob((pngBlob) => {
    if (pngBlob) downloadBlob(pngBlob, `${name}-arc-banner.png`);
  }, "image/png");
});

loadTemplate().catch((err) => {
  els.loading.textContent = `Could not load template: ${err.message}`;
  console.error(err);
});

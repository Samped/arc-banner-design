const TEMPLATE_URL = "arc-banner-template.svg";

const AVATAR = {
  cx: 363.551,
  cy: 19.414,
  r: 9.894,
  localCx: 188.66827363369885,
  localCy: 36.60798135093262,
  localR: 165.19497586499438,
  get d() {
    return this.r * 2;
  },
  get localD() {
    return this.localR * 2;
  },
  get unitScale() {
    return this.r / this.localR;
  },
};

const els = {
  preview: document.getElementById("preview"),
  loading: document.getElementById("preview-loading"),
  avatarInput: document.getElementById("avatar-input"),
  uploadZone: document.querySelector(".upload-zone"),
  avatarAdjust: document.getElementById("avatar-adjust"),
  cropper: document.getElementById("avatar-cropper"),
  cropperImage: document.getElementById("cropper-image"),
  zoomInput: document.getElementById("zoom-input"),
  resetAvatar: document.getElementById("reset-avatar"),
  downloadSvg: document.getElementById("download-svg"),
  downloadPng: document.getElementById("download-png"),
};

let svgRoot = null;
let avatarState = {
  src: null,
  baseW: AVATAR.d,
  baseH: AVATAR.d,
  scale: 1,
  panX: 0,
  panY: 0,
};

let drag = null;

async function loadTemplate() {
  const res = await fetch(TEMPLATE_URL);
  if (!res.ok) throw new Error(`Failed to load ${TEMPLATE_URL}`);
  const text = await res.text();
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  svgRoot = doc.documentElement;

  if (doc.querySelector("parsererror")) throw new Error("Invalid SVG template");

  els.preview.innerHTML = "";
  els.preview.appendChild(svgRoot.cloneNode(true));
  svgRoot = els.preview.querySelector("svg");

  els.loading.hidden = true;
  els.preview.hidden = false;
  bindInputs();
  applyAvatar();
}

function $(id) {
  return svgRoot.querySelector(`#${id}`);
}

function coverSize(naturalW, naturalH, diameter) {
  const aspect = naturalW / naturalH;
  if (aspect >= 1) {
    return { baseW: diameter * aspect, baseH: diameter };
  }
  return { baseW: diameter, baseH: diameter / aspect };
}

function applyAvatar() {
  const transform = $("avatar-transform");
  const image = $("avatar-image");
  if (!transform || !image) return;

  const { src, baseW, baseH, scale, panX, panY } = avatarState;
  if (src) {
    image.setAttributeNS("http://www.w3.org/1999/xlink", "href", src);
    image.setAttribute("href", src);
    image.removeAttribute("display");
  }

  image.setAttribute("x", String(-baseW / 2));
  image.setAttribute("y", String(-baseH / 2));
  image.setAttribute("width", String(baseW));
  image.setAttribute("height", String(baseH));
  image.setAttribute("preserveAspectRatio", "none");

  transform.setAttribute(
    "transform",
    `translate(${AVATAR.localCx + avatarState.panX / AVATAR.unitScale}, ${AVATAR.localCy + avatarState.panY / AVATAR.unitScale}) scale(${avatarState.scale})`
  );

  updateCropperPreview();
}

function updateCropperPreview() {
  if (!avatarState.src) return;

  const cropperSize = els.cropper.clientWidth;
  const vbUnit = cropperSize / AVATAR.d;
  const drawW = avatarState.baseW * avatarState.scale * AVATAR.unitScale * vbUnit;
  const drawH = avatarState.baseH * avatarState.scale * AVATAR.unitScale * vbUnit;
  const left = cropperSize / 2 + avatarState.panX * vbUnit - drawW / 2;
  const top = cropperSize / 2 + avatarState.panY * vbUnit - drawH / 2;

  els.cropperImage.src = avatarState.src;
  els.cropperImage.style.width = `${drawW}px`;
  els.cropperImage.style.height = `${drawH}px`;
  els.cropperImage.style.left = `${left}px`;
  els.cropperImage.style.top = `${top}px`;
}

function resetAvatarPosition() {
  avatarState.scale = 1;
  avatarState.panX = 0;
  avatarState.panY = 0;
  els.zoomInput.value = "1";
  applyAvatar();
}

function loadAvatarFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const img = new Image();
      img.onload = () => {
        const { baseW, baseH } = coverSize(img.naturalWidth, img.naturalHeight, AVATAR.localD);
        avatarState = {
          src: dataUrl,
          baseW,
          baseH,
          scale: 1,
          panX: 0,
          panY: 0,
        };
        els.zoomInput.value = "1";
        els.avatarAdjust.hidden = false;
        if (els.uploadZone) {
          const title = els.uploadZone.querySelector(".upload-zone-title");
          const hint = els.uploadZone.querySelector(".upload-zone-hint");
          if (title) title.textContent = "Photo added";
          if (hint) hint.textContent = "Tap to replace";
        }
        applyAvatar();
        resolve();
      };
      img.onerror = reject;
      img.src = dataUrl;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function startDrag(clientX, clientY) {
  drag = {
    startX: clientX,
    startY: clientY,
    panX: avatarState.panX,
    panY: avatarState.panY,
  };
}

function moveDrag(clientX, clientY, unitScale) {
  if (!drag) return;
  const dx = (clientX - drag.startX) / unitScale;
  const dy = (clientY - drag.startY) / unitScale;
  avatarState.panX = drag.panX + dx;
  avatarState.panY = drag.panY + dy;
  applyAvatar();
}

function endDrag() {
  drag = null;
}

function bindInputs() {
  els.avatarInput.addEventListener("change", async () => {
    const file = els.avatarInput.files?.[0];
    if (!file) return;
    await loadAvatarFile(file);
  });

  els.zoomInput.addEventListener("input", () => {
    avatarState.scale = Number(els.zoomInput.value);
    applyAvatar();
  });

  els.resetAvatar.addEventListener("click", resetAvatarPosition);

  els.cropper.addEventListener("pointerdown", (event) => {
    if (!avatarState.src) return;
    els.cropper.setPointerCapture(event.pointerId);
    startDrag(event.clientX, event.clientY);
  });

  els.cropper.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const unit = els.cropper.clientWidth / AVATAR.d;
    moveDrag(event.clientX, event.clientY, unit);
  });

  els.cropper.addEventListener("pointerup", endDrag);
  els.cropper.addEventListener("pointercancel", endDrag);

  els.cropper.addEventListener(
    "wheel",
    (event) => {
      if (!avatarState.src) return;
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.05 : 0.05;
      avatarState.scale = Math.min(3, Math.max(1, avatarState.scale + delta));
      els.zoomInput.value = String(avatarState.scale);
      applyAvatar();
    },
    { passive: false }
  );

  // Drag avatar directly on the banner preview
  els.preview.addEventListener("pointerdown", (event) => {
    if (!avatarState.src) return;
    const point = clientToSvg(event.clientX, event.clientY);
    if (!point) return;
    const dx = point.x - AVATAR.cx;
    const dy = point.y - AVATAR.cy;
    if (dx * dx + dy * dy > AVATAR.r * AVATAR.r * 1.35) return;

    event.preventDefault();
    els.preview.setPointerCapture(event.pointerId);
    startDrag(event.clientX, event.clientY);
  });

  els.preview.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const svg = svgRoot;
    const rect = svg.getBoundingClientRect();
    const vb = (svg.getAttribute("viewBox") || "0 0 1 1").split(/[\s,]+/).map(Number);
    const unit = vb[2] / rect.width;
    moveDrag(event.clientX, event.clientY, 1 / unit);
  });

  els.preview.addEventListener("pointerup", endDrag);
  els.preview.addEventListener("pointercancel", endDrag);
}

function clientToSvg(clientX, clientY) {
  const svg = svgRoot;
  if (!svg) return null;
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const local = pt.matrixTransform(ctm.inverse());
  return { x: local.x, y: local.y };
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

els.downloadSvg.addEventListener("click", () => {
  const blob = new Blob([serializeSvg()], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, "arc-banner.svg");
});

els.downloadPng.addEventListener("click", async () => {
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
    if (pngBlob) downloadBlob(pngBlob, "arc-banner.png");
  }, "image/png");
});

window.addEventListener("resize", () => {
  if (avatarState.src) updateCropperPreview();
});

loadTemplate().catch((err) => {
  els.loading.textContent = `Could not load template: ${err.message}`;
  console.error(err);
});

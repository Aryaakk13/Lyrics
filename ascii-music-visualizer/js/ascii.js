/**
 * ============================================================
 *  ASCII.JS
 *  Mengubah frame video menjadi grid karakter ASCII berdasarkan
 *  tingkat kecerahan tiap sel piksel, lalu merender + memberi
 *  efek "hidup" berdasarkan energi audio.
 *
 *  Ada 2 mode:
 *  - "none": canvas kosong (dipakai saat lirik/pre-chorus - cuma
 *    teks lirik yang tampil, tidak ada visual ASCII)
 *  - "video": grid dihitung ULANG setiap frame dari video yang
 *    sedang diputar (dipakai saat momen chorus) - video-nya
 *    "berubah jadi teks" secara live.
 * ============================================================
 */
const AsciiArt = (() => {
  let cols = 0;
  let rows = 0;
  let brightnessGrid = [];
  const canvasEl = document.getElementById("ascii-canvas");
  const sampler = document.createElement("canvas");
  const samplerCtx = sampler.getContext("2d", { willReadFrequently: true });

  // Batas grid supaya HP low-end tetap lancar (grid kegedean = lag di mobile)
  const MAX_COLS = 160;
  const MAX_ROWS = 90;

  let mode = "none"; // "none" | "video"
  let videoEl = null; // <video> tersembunyi, sumber frame saat mode "video"

  function loadImage(imageSrc) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        sampleFromSource(img, img.width, img.height);
        resolve();
      };
      img.onerror = reject;
      img.src = imageSrc;
    });
  }

  /** Menyiapkan (tapi belum memutar) video sebagai sumber frame ASCII */
  function loadVideo(videoSrc) {
    return new Promise((resolve, reject) => {
      stopVideo(); // bersihkan video moment sebelumnya kalau masih ada

      const v = document.createElement("video");
      v.src = videoSrc;
      v.muted = true; // wajib supaya autoplay diizinkan browser mobile
      v.playsInline = true;
      v.setAttribute("playsinline", ""); // iOS Safari lama
      v.setAttribute("webkit-playsinline", ""); // iOS Safari sangat lama
      v.preload = "auto";

      // Ditempel ke DOM (bukan cuma dibuat di memori) - beberapa browser
      // mobile (khususnya iOS Safari) tidak mau men-decode frame video
      // untuk dibaca lewat canvas kalau elemennya tidak pernah ada di DOM.
      // Ditaruh sangat kecil & di luar pandangan supaya tidak kelihatan.
      v.style.position = "fixed";
      v.style.width = "2px";
      v.style.height = "2px";
      v.style.top = "0";
      v.style.left = "0";
      v.style.opacity = "0.01";
      v.style.pointerEvents = "none";
      document.body.appendChild(v);

      v.onloadeddata = () => {
        videoEl = v;
        resolve(v);
      };
      v.onerror = reject;
    });
  }

  /** Pindah sumber ASCII: "video" (live tiap frame) atau "none" (kosong) */
  function setMode(nextMode) {
    mode = nextMode;
  }

  function getMode() {
    return mode;
  }

  /** Hentikan & buang elemen <video> tersembunyi (bebasin memori di mobile) */
  function stopVideo() {
    if (videoEl) {
      videoEl.pause();
      videoEl.removeAttribute("src");
      videoEl.load();
      if (videoEl.parentNode) videoEl.parentNode.removeChild(videoEl);
      videoEl = null;
    }
  }

  /** Mengosongkan canvas - dipakai saat tidak ada foto/video aktif */
  function clear() {
    mode = "none";
    cols = 0;
    rows = 0;
    brightnessGrid = [];
    canvasEl.textContent = "";
  }

  /**
   * Fade-in halus untuk canvas ASCII (dipakai saat momen video baru mulai).
   * Trik double-rAF supaya opacity:0 sempat "dilukis" browser dulu sebelum
   * transisi ke opacity:1 berjalan (perlu untuk transisi mulus di mobile juga).
   */
  function fadeIn(durationMs = 700) {
    canvasEl.style.transition = `opacity ${durationMs}ms ease`;
    canvasEl.style.opacity = "0";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        canvasEl.style.opacity = "1";
      });
    });
  }

  function sampleFromSource(source, srcWidth, srcHeight) {
    cols = Math.min(MAX_COLS, Math.floor(srcWidth / CONFIG.cellWidth) || 60);
    rows = Math.min(MAX_ROWS, Math.floor(srcHeight / CONFIG.cellHeight) || 30);

    sampler.width = cols;
    sampler.height = rows;
    samplerCtx.drawImage(source, 0, 0, cols, rows);

    const data = samplerCtx.getImageData(0, 0, cols, rows).data;
    brightnessGrid = new Array(cols * rows);

    for (let i = 0; i < cols * rows; i++) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      const a = data[i * 4 + 3];
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      brightnessGrid[i] = a === 0 ? 0 : luminance;
    }
  }

  /**
   * Render satu frame ASCII.
   * @param {number} energy - level energi audio 0..1 (dari audio.js)
   */
  function render(energy = 0) {
    if (mode === "none") {
      if (canvasEl.textContent !== "") canvasEl.textContent = "";
      return;
    }

    if (mode === "video" && videoEl && videoEl.readyState >= 2) {
      sampleFromSource(videoEl, videoEl.videoWidth, videoEl.videoHeight);
    }

    if (!cols || !rows) return;

    const ramp = CONFIG.asciiRamp;
    const boost = energy * CONFIG.audioReactivity;
    let out = "";

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = y * cols + x;
        let level = brightnessGrid[idx];

        if (level > 0) {
          level = Math.min(1, level + (Math.random() - 0.3) * boost * 0.35);
        }

        const charIdx = Math.round(level * (ramp.length - 1));
        out += ramp[charIdx];
      }
      out += "\n";
    }

    canvasEl.textContent = out;

    const glow = 4 + energy * 18;
    canvasEl.style.textShadow = `0 0 ${glow}px rgba(255,90,54,${0.25 + energy * 0.5})`;
    canvasEl.style.color = energy > 0.75 ? "#fff" : "#e8e8e8";

    // Ukuran font menyesuaikan lebar layar (dan aman untuk layar sempit di mobile)
    const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
    const fontSize = Math.max(3, Math.min(10, viewportWidth / cols));
    canvasEl.style.fontSize = fontSize + "px";
  }

  return { loadImage, loadVideo, setMode, getMode, clear, render, fadeIn, stopVideo };
})();
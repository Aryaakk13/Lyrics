/**
 * ============================================================
 *  LYRIC-OVERLAY.JS
 *  Menampilkan satu baris lirik (dari CONFIG.lyricMoments) sebagai
 *  ASCII ART (bukan teks biasa), aktif selama currentTime ada
 *  di rentang start-end momen tersebut. Otomatis disembunyikan
 *  saat momen video (chorus) sedang berlangsung.
 * ============================================================
 */
const LyricOverlay = (() => {
  const textLayer = document.getElementById("lyric-text-layer");
  const textEl = document.getElementById("lyric-text");

  let currentLine = null;

  function findActive(t) {
    return CONFIG.lyricMoments.find((m) => t >= m.start && t < m.end) || null;
  }

  /** Render ulang art & sesuaikan ukuran font supaya selalu pas di layar */
  function renderArt(text) {
    const maxChars = CONFIG.lyricMaxCharsPerLine || 16;
    const onChar = CONFIG.lyricAsciiChar || "#";
    const art = AsciiFont.render(text, maxChars, onChar);
    textEl.textContent = art;

    const rows = art.split("\n");
    const cols = Math.max(...rows.map((r) => r.length));
    const fontSize = Math.max(4, Math.min(16, (window.innerWidth * 0.85) / cols));
    textEl.style.fontSize = fontSize + "px";
  }

  /**
   * @param {number} t - waktu lagu saat ini (detik)
   * @param {boolean} videoIsActive - true kalau momen video (mis. chorus) sedang tampil
   */
  function update(t, videoIsActive) {
    if (videoIsActive) {
      textLayer.classList.remove("active");
      currentLine = null;
      return;
    }

    const line = findActive(t);

    if (!line) {
      textLayer.classList.remove("active");
      currentLine = null;
      return;
    }

    if (line !== currentLine) {
      currentLine = line;
      renderArt(line.text || "");
    }
    textLayer.classList.add("active");
  }

  return { update };
})();
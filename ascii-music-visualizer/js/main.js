/**
 * ============================================================
 *  MAIN.JS
 *  Entry point: memuat ASCII art, menyiapkan audio, lalu
 *  menjalankan animation loop yang menyatukan semuanya.
 * ============================================================
 */
(async function bootstrap() {
  const startOverlay = document.getElementById("start-overlay");
  const startBtn = document.getElementById("start-btn");
  const timeDisplay = document.getElementById("time-display");

  // Tidak ada foto lagi - canvas ASCII mulai kosong, cuma teks lirik yang tampil dulu
  AudioEngine.element.src = CONFIG.audioSrc;

  startBtn.addEventListener("click", async () => {
    try {
      await AudioEngine.play();
      startOverlay.classList.add("hidden");
      requestAnimationFrame(loop);
    } catch (err) {
      console.error("Gagal memutar audio:", err);
      alert(`Tidak bisa memutar audio. Cek apakah file ini benar ada:\n${CONFIG.audioSrc}`);
    }
  });

  AudioEngine.onEnded(() => {
    startOverlay.classList.remove("hidden");
    VideoMoments.reset();
    AsciiArt.clear();
  });

  function loop() {
    const energy = AudioEngine.getEnergy();
    const t = AudioEngine.currentTime();
    const d = AudioEngine.duration();

    AsciiArt.render(energy);
    VideoMoments.update(t);
    LyricOverlay.update(t, VideoMoments.isActive());
    timeDisplay.textContent = `${formatTime(t)} / ${formatTime(d)}`;

    requestAnimationFrame(loop);
  }

  function formatTime(sec) {
    if (!isFinite(sec)) return "00:00";
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }
})();
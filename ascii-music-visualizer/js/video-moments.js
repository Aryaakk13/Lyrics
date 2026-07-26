/**
 * ============================================================
 *  VIDEO-MOMENTS.JS
 *  Mengecek posisi playhead lagu tiap frame. Saat waktunya tiba
 *  (CONFIG.moments), video dimuat & diputar tersembunyi, lalu
 *  AsciiArt dipindah ke mode "video" supaya framenya dirender
 *  jadi ASCII (sama seperti foto), bukan diputar sebagai video biasa.
 *  Setelah selesai, otomatis kembali ke mode "image".
 * ============================================================
 */
const VideoMoments = (() => {
  let active = null; // moment yang sedang aktif, atau null
  let hideTimer = null;
  const triggered = new Set(); // supaya satu momen tidak terpicu berkali-kali

  async function show(moment) {
    active = moment;
    try {
      const v = await AsciiArt.loadVideo(moment.video);
      v.currentTime = 0;
      await v.play();
      AsciiArt.setMode("video");
      AsciiArt.fadeIn(700); // <-- BARU: fade-in ASCII video

      v.onended = () => hide(moment);

      if (moment.duration) {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => hide(moment), moment.duration * 1000);
      }
    } catch (err) {
      console.error("Gagal memuat video momen:", err);
      active = null;
    }
  }

  function hide(moment) {
    if (active !== moment) return;
    AsciiArt.setMode("image");
    AsciiArt.stopVideo(); // <-- BARU: bersihkan video dari DOM/memori
    active = null;
  }

  /** Dipanggil tiap frame dari main.js dengan waktu lagu saat ini (detik) */
  function update(currentTime) {
    if (active) return; // sedang ada momen jalan, jangan tumpang tindih

    for (const moment of CONFIG.moments) {
      const key = moment.start;
      const alreadyTriggered = triggered.has(key);
      const withinWindow = currentTime >= moment.start && currentTime < moment.start + 0.4;

      if (withinWindow && !alreadyTriggered) {
        triggered.add(key);
        show(moment);
        break;
      }
    }
  }

  /** Reset penanda "sudah terpicu" - berguna kalau user mengulang lagu dari awal */
  function reset() {
    triggered.clear();
  }

  /** @returns {boolean} true selama momen video sedang berlangsung */
  function isActive() {
    return active !== null;
  }

  return { update, reset, isActive };
})();
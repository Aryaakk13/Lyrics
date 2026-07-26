/**
 * ============================================================
 *  AUDIO.JS
 *  Memutar file lagu + menganalisa energinya secara real-time
 *  lewat Web Audio API, supaya ASCII art & momen video bisa
 *  bereaksi terhadap lagu.
 * ============================================================
 */
const AudioEngine = (() => {
  const el = document.getElementById("song");
  let audioCtx, analyser, source, dataArray;
  let ready = false;

  function init() {
    if (ready) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    source = audioCtx.createMediaElementSource(el);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    ready = true;
  }

  async function play() {
    init();
    if (audioCtx.state === "suspended") await audioCtx.resume();
    await el.play();
  }

  /** @returns {number} 0..1 rata-rata energi frekuensi saat ini */
  function getEnergy() {
    if (!ready) return 0;
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    return sum / dataArray.length / 255;
  }

  function currentTime() {
    return el.currentTime;
  }

  function duration() {
    return el.duration || 0;
  }

  function onEnded(cb) {
    el.addEventListener("ended", cb);
  }

  return { play, getEnergy, currentTime, duration, onEnded, element: el };
})();

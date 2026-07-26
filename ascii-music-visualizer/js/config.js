/**
 * ============================================================
 *  KONFIGURASI UTAMA
 *  Edit file ini saja untuk mengganti lagu, gambar ASCII,
 *  dan momen-momen video tanpa menyentuh logic di file lain.
 * ============================================================
 */
const CONFIG = {

  // Path ke file audio lagu kamu (taruh file mp3 di assets/audio/)
  audioSrc: "assets/audio/anjay.mp3",

  // Karakter ASCII dari yang paling "gelap/kosong" ke paling "padat/terang"
  // Bisa diganti sesuai selera, urutan menentukan gradasi visual
  asciiRamp: " .:-=+*bcsi#%@",

  // Ukuran grid sampling gambar -> semakin kecil = semakin detail (tapi lebih berat)
  cellWidth: 8,
  cellHeight: 14,

  // Seberapa kuat audio mempengaruhi kepadatan karakter & glow
  audioReactivity: 1.4,

  // ----------------------------------------------------------
  // ASCII ART untuk lirik (dipakai oleh js/ascii-font.js)
  // ----------------------------------------------------------
  lyricMaxCharsPerLine: 16, // makin kecil = font ASCII makin besar per baris
  lyricAsciiChar: "#",      // karakter yang dipakai buat "isi" huruf

  // ----------------------------------------------------------
  // MOMEN LIRIK (mis. Pre-Chorus): menampilkan foto + baris lirik
  // di atas ASCII, aktif selama currentTime ada di antara start & end.
  //
  // PENTING: aku (Claude) tidak menuliskan lirik lagunya di sini karena
  // itu berhak cipta - silakan ketik sendiri baris liriknya di bawah,
  // baris demi baris, sesuai waktu munculnya di lagu kamu.
  // ----------------------------------------------------------
  lyricPhoto: "assets/image/bby.jpg", // foto yang tampil berbarengan dengan lirik

  lyricMoments: [
  { start: 0,    end: 2, text: "Cause you know how to give me that" }, // baris 1
  { start: 2, end: 5,   text: "You know how to pull me back when I go runnin', runnin'" }, // baris 2
  { start: 5,   end: 7.5, text: "Tryna get away from loving ya" }, // baris 3
  { start: 7.5, end: 9,   text: "You know how to love me hard" }, // baris 4
  { start: 9,   end: 11.5, text: "I won't lie, I'm falling hard" }, // baris 5
  { start: 11.5, end: 14,   text: "Yep, I'm falling for ya, but there's nothin' wrong with that" }, // baris 6
],

  // ----------------------------------------------------------
  // MOMEN VIDEO (mis. Chorus): video kamu akan muncul otomatis
  // menimpa ASCII + layer lirik saat lagu mencapai waktu "start"
  // (dalam detik), lalu hilang lagi setelah videonya selesai atau
  // setelah "duration" detik.
  // ----------------------------------------------------------
  moments: [
    { start: 14.5, video: "assets/video/VID-20260714-WA0010.mp4" },
    // { start: 92, video: "assets/video/momen2.mp4", duration: 8 },
  ],
};
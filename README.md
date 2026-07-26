# ASCII Music Visualizer

Visualizer ASCII art yang bereaksi terhadap lagu, dan bisa memunculkan video kamu
sendiri di momen-momen tertentu di lagu.

## Struktur folder

```
ascii-music-visualizer/
├── index.html              <- buka file ini di browser (lewat Live Server / http-server)
├── css/style.css            <- tampilan
├── js/
│   ├── config.js             <- ⚙️ EDIT DI SINI: path lagu, gambar, & daftar momen video
│   ├── ascii.js               <- konversi gambar -> ASCII + render
│   ├── audio.js                <- pemutaran & analisa audio (Web Audio API)
│   ├── video-moments.js         <- logic munculnya video di timestamp tertentu
│   └── main.js                   <- penyambung semuanya
└── assets/
    ├── audio/   <- taruh lagu.mp3 di sini
    ├── image/   <- taruh source.png (gambar yang diubah jadi ASCII) di sini
    └── video/   <- taruh video-video momen kamu di sini
```

## Cara pakai

1. **Lagu**: Karena lagu di YouTube yang kamu kirim (Rihanna - "You Da One") berhak
   cipta, aku tidak bisa mengunduh atau menyertakan audionya di sini. Kamu perlu
   menyediakan sendiri file audionya (misal lagu yang sudah kamu beli/punya izin),
   simpan sebagai `assets/audio/lagu.mp3`.
2. **Gambar ASCII**: taruh gambar apa pun yang mau dijadikan bentuk ASCII (foto,
   siluet, dsb) sebagai `assets/image/source.png`. Gambar dengan kontras
   jelas antara subjek & background akan menghasilkan ASCII paling bagus.
3. **Video momen** (mis. chorus): taruh video-video pendek yang mau muncul ke dalam
   `assets/video/`, lalu daftarkan di `js/config.js`:

   ```js
   moments: [
     { start: 24, video: "assets/video/VID-20260714-WA0010.mp4" },
     { start: 92, video: "assets/video/momen2.mp4", duration: 8 },
   ]
   ```

   `start` = detik ke berapa di lagu video itu harus muncul.
   `duration` (opsional) = berapa lama ditampilkan; kalau dikosongkan, video akan
   diputar sampai selesai sendiri.

4. **Momen lirik** (mis. pre-chorus): menampilkan foto + satu baris teks di atas
   ASCII, aktif selama waktu lagu ada di antara `start` dan `end`. **Ketik sendiri**
   baris liriknya di `text` (Claude tidak menuliskan lirik lagu berhak cipta ke
   dalam kode ini):

   ```js
   lyricPhoto: "assets/image/bby.jpg",
   lyricMoments: [
     { start: 8,  end: 11, text: "..." },
     { start: 11, end: 14, text: "..." },
   ]
   ```

   Video momen (langkah 3) otomatis menimpa layer lirik ini kalau waktunya beririsan,
   jadi urutan pre-chorus (lirik) → chorus (video) berjalan otomatis selama timestamp-nya benar.

4. Jalankan lewat local server (contoh dengan ekstensi Live Server di VS Code,
   atau `python3 -m http.server`), lalu buka `index.html` di browser dan klik ▶.

## Menentukan timestamp momen dengan tepat

Putar lagu kamu sendiri sambil melihat jam di player, catat detik-detik penting
(misal drop, chorus, transisi), lalu isi angka itu ke `start` di `config.js`.

## Kustomisasi lanjutan

- `asciiRamp` di config.js: urutan karakter dari paling "kosong" ke paling "padat" —
  ganti sesuai gaya visual yang kamu mau.
- `cellWidth` / `cellHeight`: makin kecil angkanya, makin detail ASCII-nya (tapi makin berat).
- `audioReactivity`: makin besar, makin "liar" kedipan ASCII mengikuti volume lagu.

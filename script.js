lucide.createIcons();

// Mobile Menu Toggle
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

/* ======================================================
     REAL HTML5 AUDIO ENGINE CONFIGURATION
   ====================================================== */
const tracks = [
  {
    id: 0,
    title: "Canon in D Major",
    genre: "Classical Elegance",
    artist: "J. Pachelbel — Solo Violin",
    cover: "image/img1.jpeg",
    src: "audio/canon-in-d-clavier.mp3",
  },
  {
    id: 1,
    title: "A Thousand Years",
    genre: "Modern Pop Covers",
    artist: "Christina Perri Cover",
    cover:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600",
    src: "audio/a-thousand-years.mp3",
  },
  {
    id: 2,
    title: "Viva La Vida",
    genre: "Modern Pop Covers",
    artist: "Coldplay Acoustic Cover",
    cover:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=600",
    src: "audio/viva-la-vida.mp3",
  },
  {
    id: 3,
    title: "Smooth Operator",
    genre: "Jazz & Lounge",
    artist: "Sade — Lounge Violin Arrangement",
    cover:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
    src: "audio/smooth-operator.mp3",
  },
];

let currentTrackIndex = 0;
let isPlaying = false;
const audioElement = new Audio();

// Waveform Visualizer Setup
const waveform = document.getElementById("waveform");
const barCount = 32;
for (let i = 0; i < barCount; i++) {
  const bar = document.createElement("div");
  bar.className =
    "w-1 bg-pastel-peach rounded-full transition-all duration-150";
  const height = Math.floor(Math.random() * 50) + 20;
  bar.style.height = `${height}%`;
  waveform.appendChild(bar);
}

// Render Track Selection Cards
const trackSelectorList = document.getElementById("track-selector-list");
tracks.forEach((track, index) => {
  const btn = document.createElement("button");
  btn.className = `p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${index === 0 ? "bg-pastel-peach/40 border-pastel-coral text-pastel-dark shadow-sm" : "bg-pastel-bg border-pastel-peach/30 text-pastel-muted hover:border-pastel-coral"}`;
  btn.innerHTML = `
          <i data-lucide="music" class="w-4 h-4 text-pastel-rose flex-shrink-0"></i>
          <div class="truncate">
              <p class="text-xs font-bold text-pastel-dark truncate">${track.title}</p>
              <p class="text-[10px] text-pastel-muted">${track.genre}</p>
          </div>
      `;
  btn.addEventListener("click", () => loadTrack(index, true));
  trackSelectorList.appendChild(btn);
});

const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const playerTitle = document.getElementById("player-title");
const playerArtist = document.getElementById("player-artist");
const playerGenre = document.getElementById("player-genre");
const playerCover = document.getElementById("player-cover");
const progressBar = document.getElementById("progress-bar");
const progressBarContainer = document.getElementById(
  "progress-bar-container",
);
const currentTimeEl = document.getElementById("current-time");
const durationTimeEl = document.getElementById("duration-time");

function loadTrack(index, autoPlay = false) {
  currentTrackIndex = index;
  const track = tracks[index];
  playerTitle.textContent = track.title;
  playerArtist.textContent = track.artist;
  playerGenre.textContent = track.genre;
  playerCover.src = track.cover;

  audioElement.src = track.src;
  audioElement.load();

  Array.from(trackSelectorList.children).forEach((child, i) => {
    if (i === index) {
      child.className =
        "p-3 rounded-xl border text-left transition-all flex items-center gap-3 bg-pastel-peach/40 border-pastel-coral text-pastel-dark shadow-sm";
    } else {
      child.className =
        "p-3 rounded-xl border text-left transition-all flex items-center gap-3 bg-pastel-bg border-pastel-peach/30 text-pastel-muted hover:border-pastel-coral";
    }
  });

  if (autoPlay) {
    playAudio();
  } else {
    pauseAudio();
  }
}

function playAudio() {
  audioElement
    .play()
    .then(() => {
      isPlaying = true;
      playIcon.setAttribute("data-lucide", "pause");
      lucide.createIcons();
      animateWaveform(true);
    })
    .catch((err) => {
      console.warn(
        "Audio file could not be played. Check that your MP3 file exists at " +
          tracks[currentTrackIndex].src,
      );
    });
}

function pauseAudio() {
  audioElement.pause();
  isPlaying = false;
  playIcon.setAttribute("data-lucide", "play");
  lucide.createIcons();
  animateWaveform(false);
}

function togglePlay() {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

audioElement.addEventListener("loadedmetadata", () => {
  durationTimeEl.textContent = formatTime(audioElement.duration);
});

audioElement.addEventListener("timeupdate", () => {
  if (audioElement.duration) {
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(audioElement.currentTime);
    if (isPlaying) animateWaveform(true);
  }
});

audioElement.addEventListener("ended", () => {
  let nextIndex = currentTrackIndex + 1;
  if (nextIndex >= tracks.length) nextIndex = 0;
  loadTrack(nextIndex, true);
});

progressBarContainer.addEventListener("click", (e) => {
  const rect = progressBarContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  if (audioElement.duration) {
    audioElement.currentTime = (clickX / width) * audioElement.duration;
  }
});

playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", () => {
  let nextIndex = currentTrackIndex - 1;
  if (nextIndex < 0) nextIndex = tracks.length - 1;
  loadTrack(nextIndex, true);
});
nextBtn.addEventListener("click", () => {
  let nextIndex = currentTrackIndex + 1;
  if (nextIndex >= tracks.length) nextIndex = 0;
  loadTrack(nextIndex, true);
});

function animateWaveform(active) {
  const bars = waveform.children;
  for (let bar of bars) {
    if (active) {
      const height = Math.floor(Math.random() * 80) + 20;
      bar.style.height = `${height}%`;
      bar.classList.add("bg-pastel-coral");
      bar.classList.remove("bg-pastel-peach");
    } else {
      bar.classList.remove("bg-pastel-coral");
      bar.classList.add("bg-pastel-peach");
    }
  }
}

// Repertoire List Data
const songs = [
  {
    title: "Canon in D",
    artist: "J. Pachelbel",
    category: "Classical Elegance",
  },
  {
    title: "Air on the G String",
    artist: "J. S. Bach",
    category: "Classical Elegance",
  },
  {
    title: "Bridal March",
    artist: "R. Wagner",
    category: "Classical Elegance",
  },
  {
    title: "Czardas",
    artist: "V. Monti",
    category: "Classical Elegance",
  },
  {
    title: "Viva La Vida",
    artist: "Coldplay",
    category: "Modern Pop Covers",
  },
  {
    title: "A Thousand Years",
    artist: "Christina Perri",
    category: "Modern Pop Covers",
  },
  {
    title: "Wildest Dreams",
    artist: "Taylor Swift",
    category: "Modern Pop Covers",
  },
  {
    title: "Perfect",
    artist: "Ed Sheeran",
    category: "Modern Pop Covers",
  },
  {
    title: "Game of Thrones Theme",
    artist: "Ramin Djawadi",
    category: "Cinematic & Film",
  },
  {
    title: "Gabriel's Oboe",
    artist: "Ennio Morricone",
    category: "Cinematic & Film",
  },
  { title: "Smooth Operator", artist: "Sade", category: "Jazz & Lounge" },
  {
    title: "The Girl from Ipanema",
    artist: "A. C. Jobim",
    category: "Jazz & Lounge",
  },
];

const repertoireGrid = document.getElementById("repertoire-grid");
const searchInput = document.getElementById("repertoire-search");
const categoryBtns = document.querySelectorAll(".filter-btn");

function renderSongs(filterCategory = "all", searchQuery = "") {
  repertoireGrid.innerHTML = "";
  const filtered = songs.filter((song) => {
    const matchesCategory =
      filterCategory === "all" || song.category === filterCategory;
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    repertoireGrid.innerHTML = `
              <div class="col-span-full text-center py-8 text-pastel-muted">
                  No matching song found. Virginia regularly transcribes custom song requests upon request!
              </div>
          `;
    return;
  }

  filtered.forEach((song) => {
    const card = document.createElement("div");
    card.className =
      "bg-pastel-card p-4 rounded-2xl flex items-center justify-between border border-pastel-peach/40 shadow-sm hover:border-pastel-coral transition-all";
    card.innerHTML = `
              <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-pastel-peach/40 flex items-center justify-center text-pastel-rose text-xs">
                      <i data-lucide="music-2" class="w-4 h-4"></i>
                  </div>
                  <div>
                      <p class="text-sm font-bold text-pastel-dark">${song.title}</p>
                      <p class="text-xs text-pastel-muted">${song.artist}</p>
                  </div>
              </div>
              <span class="text-[10px] uppercase font-bold text-pastel-rose bg-pastel-lavender px-2.5 py-1 rounded-full">${song.category}</span>
          `;
    repertoireGrid.appendChild(card);
  });
  lucide.createIcons();
}

categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach((b) => {
      b.classList.remove("bg-pastel-coral", "text-white", "shadow-md");
      b.classList.add("bg-pastel-card", "text-pastel-dark");
    });
    btn.classList.add("bg-pastel-coral", "text-white", "shadow-md");
    btn.classList.remove("bg-pastel-card", "text-pastel-dark");

    const cat = btn.getAttribute("data-category");
    renderSongs(cat, searchInput.value);
  });
});

searchInput.addEventListener("input", (e) => {
  const activeBtn = document.querySelector(".filter-btn.bg-pastel-coral");
  const cat = activeBtn ? activeBtn.getAttribute("data-category") : "all";
  renderSongs(cat, e.target.value);
});

// Instant Quote Calculator Logic
const calcTypeBtns = document.querySelectorAll(".calc-type-btn");
const calcLocBtns = document.querySelectorAll(".calc-loc-btn");
const durationSlider = document.getElementById("duration-slider");
const durationVal = document.getElementById("duration-val");
const addonCheckboxes = document.querySelectorAll(".addon-checkbox");
const totalPriceEl = document.getElementById("total-price");

let basePrice = 380;
let travelFee = 0;

calcTypeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    calcTypeBtns.forEach((b) => {
      b.classList.remove(
        "border-2",
        "border-pastel-coral",
        "bg-pastel-peach/30",
        "font-bold",
      );
      b.classList.add(
        "border",
        "border-pastel-peach/60",
        "bg-pastel-bg",
        "font-semibold",
      );
    });
    btn.classList.add(
      "border-2",
      "border-pastel-coral",
      "bg-pastel-peach/30",
      "font-bold",
    );
    btn.classList.remove(
      "border",
      "border-pastel-peach/60",
      "bg-pastel-bg",
      "font-semibold",
    );
    basePrice = parseInt(btn.getAttribute("data-base"));
    updateTotal();
  });
});

calcLocBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    calcLocBtns.forEach((b) => {
      b.classList.remove(
        "border-2",
        "border-pastel-coral",
        "bg-pastel-peach/30",
        "font-bold",
      );
      b.classList.add(
        "border",
        "border-pastel-peach/60",
        "bg-pastel-bg",
        "font-medium",
      );
    });
    btn.classList.add(
      "border-2",
      "border-pastel-coral",
      "bg-pastel-peach/30",
      "font-bold",
    );
    btn.classList.remove(
      "border",
      "border-pastel-peach/60",
      "bg-pastel-bg",
      "font-medium",
    );
    travelFee = parseInt(btn.getAttribute("data-travel"));
    updateTotal();
  });
});

durationSlider.addEventListener("input", (e) => {
  const hrs = e.target.value;
  durationVal.textContent = `${hrs} ${hrs == 1 ? "Hour" : "Hours"}`;
  updateTotal();
});

addonCheckboxes.forEach((cb) => {
  cb.addEventListener("change", updateTotal);
});

function updateTotal() {
  const hours = parseInt(durationSlider.value);
  let total = basePrice + (hours - 1) * 120 + travelFee;

  addonCheckboxes.forEach((cb) => {
    if (cb.checked) {
      total += parseInt(cb.getAttribute("data-price"));
    }
  });

  totalPriceEl.textContent = `€${total}`;
}

const bookingForm = document.getElementById("booking-form");
const formMessage = document.getElementById("form-message");

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const googleFormUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSe--7NzNDXcb19_aVmOkFaGX0iOn-DlLuX-eQfY4ow0cHxmlw/formResponse";

  const formData = new FormData();
  formData.append(
    "entry.840267400",
    bookingForm.querySelector('input[name="name"]').value,
  );
  formData.append(
    "entry.595414486",
    bookingForm.querySelector('input[name="email"]').value,
  );
  formData.append(
    "entry.282432372",
    bookingForm.querySelector('input[name="phone_number"]').value,
  );
  formData.append(
    "entry.627042442",
    bookingForm.querySelector('input[name="event_date"]').value,
  );
  formData.append(
    "entry.1817636194",
    bookingForm.querySelector('select[name="event_type"]').value,
  );
  formData.append(
    "entry.869817619",
    bookingForm.querySelector('input[name="venue_location"]').value,
  );
  formData.append(
    "entry.1906027905",
    bookingForm.querySelector('textarea[name="event_details"]').value,
  );

  fetch(googleFormUrl, {
    method: "POST",
    mode: "no-cors",
    body: formData,
  })
    .then(() => {
      formMessage.className =
        "p-4 rounded-2xl text-sm font-semibold bg-pastel-mint text-pastel-dark border border-pastel-coral block mb-4 shadow-sm";
      formMessage.textContent =
        "Thank you! Your event inquiry has been received. Virginia will get back to you within 24 hours.";
      bookingForm.reset();
    })
    .catch((error) => {
      console.error("Error submitting form:", error);
    });
});

// Initialize Render
renderSongs();
loadTrack(0, false);
updateTotal();
/* =====================================================
   ELEMENTS
===================================================== */

const loadingScreen = document.getElementById("loading-screen");

const loadingProgress = document.querySelector(".loading-progress");

const loadingPercent = document.querySelector(".loading-percent");

const pages = document.querySelectorAll(".page");

const prevBtn = document.getElementById("prevBtn");

const nextBtn = document.getElementById("nextBtn");

const pageIndicator = document.getElementById("pageIndicator");

const startBtn = document.getElementById("startJourney");

const restartBtn = document.getElementById("restartJourney");

const openingMusic = document.getElementById("openingMusic");

const twilightMusic = document.getElementById("twilightMusic");

const endingMusic = document.getElementById("endingMusic");

const windSound = document.getElementById("windSound");

const birdSound = document.getElementById("birdSound");

const riverSound = document.getElementById("riverSound");

const windChime = document.getElementById("windChime");

const nightSound = document.getElementById("nightSound");

const musicToggle = document.getElementById("musicToggle");

const navigation = document.getElementById("navigation");

const pageCounter = document.getElementById("pageIndicator");

/* =====================================================
   PAGE STATE
===================================================== */

let currentPage = 0;

const totalPages = pages.length;

/* =====================================================
   AUDIO MANAGER
===================================================== */

let currentMusic = null;

const ambientList = [
    windSound,
    birdSound,
    riverSound,
    windChime,
    nightSound
];

function fadeOut(audio, callback) {

    if (!audio) {

        if (callback) callback();

        return;

    }

    const fade = setInterval(() => {

        if (audio.volume > 0.05) {

            audio.volume -= 0.05;

        } else {

            clearInterval(fade);

            audio.pause();

            if (callback) callback();

        }

    }, 50);

}

function stopAmbient() {

    ambientList.forEach(sound => {

        if (!sound) return;

        sound.pause();

        sound.currentTime = 0;

    });

}

function playMusic(music, volume = 0.5) {

    if (!music) return;

    if (currentMusic === music) return;

    fadeOut(currentMusic, () => {

        music.volume = 0;

        music.loop = true;

        music.play().catch(() => {});

        const fade = setInterval(() => {

            if (music.volume < volume) {

                music.volume += 0.05;

            } else {

                music.volume = volume;

                clearInterval(fade);

            }

        }, 50);

        currentMusic = music;

    });

}

function playAmbient(sound, volume = 0.25) {

    if (!sound) return;

    if (!sound.paused) return;

    sound.volume = volume;

    sound.loop = true;

    sound.play().catch(() => {});

}

/* =====================================================
   UPDATE AUDIO
===================================================== */

function updateAudio(pageIndex) {

    let targetMusic = null;

    /*
       0 = Opening
       1 = Hero
       2 = Chapter 1
       3 = Chapter 2
       4 = Chapter 3
       5 = Chapter 4
       6 = Timeline
       7 = Letter
       8 = Japanese Quote
       9 = Journey Complete
       10 = Memory Garden
       11 = Birthday
       12 = Starlight
       13 = Ending
       14 = Credit Scene
    */

    // Hero - Chapter 4
    if (pageIndex >= 1 && pageIndex <= 5) {

        targetMusic = openingMusic;

    }

    // Timeline - Japanese Quote
    else if (pageIndex >= 6 && pageIndex <= 8) {

        targetMusic = twilightMusic;

    }

    // Journey Complete - Ending
    else if (pageIndex >= 9 && pageIndex <= 13) {

        targetMusic = endingMusic;

    }

    // Credit Scene
    else if (pageIndex === 14) {

        targetMusic = null;

    }

    if (targetMusic) {

        playMusic(targetMusic);

    }

}

/* =====================================================
   CREDIT MANAGER
===================================================== */

function playCreditAnimation(){

    const items=document.querySelectorAll(".credit-content>*");

    items.forEach(item=>{

        item.classList.remove("show");

    });

    items.forEach((item,index)=>{

        setTimeout(()=>{

            item.classList.add("show");

        },index*900);

    });

    const restart=document.getElementById("restartJourney");

    if(restart){

        restart.classList.remove("show");

        setTimeout(()=>{

            restart.classList.add("show");

        },items.length*900+1200);

    }

}

/* =====================================================
   FINISH MANAGER
===================================================== */

function finishJourney() {

    const creditPage =
        document.getElementById("credit");

    if (!creditPage) return;

    const creditIndex =
        Array.from(pages).indexOf(creditPage);

    if (creditIndex === -1) return;

    if (currentPage !== creditIndex) {

        showPage(creditIndex);

        return;

    }

    playCreditAnimation();

}

/* =====================================================
   EFFECT MANAGER
===================================================== */

function updateEffects(pageIndex) {

    document.body.classList.remove(
        "effect-morning",
        "effect-evening",
        "effect-night"
    );

    if (pageIndex <= 4) {

        document.body.classList.add("effect-morning");

    }

    else if (pageIndex <= 8) {

        document.body.classList.add("effect-evening");

    }

    else {

        document.body.classList.add("effect-night");

    }

}

/* =====================================================
   LOADING SYSTEM
===================================================== */

function startLoading() {

    if (!loadingScreen) {

        showPage(0);

        return;

    }

    let progress = 0;

    const timer = setInterval(() => {

        progress++;

        if (loadingProgress) {

            loadingProgress.style.width = progress + "%";

        }

        if (loadingPercent) {

            loadingPercent.textContent = progress + "%";

        }

        if (progress >= 100) {

            clearInterval(timer);

            loadingScreen.classList.add("hide");

            setTimeout(() => {

                loadingScreen.remove();

                showPage(0);

            }, 800);

        }

    }, 25);

}

/* =====================================================
   UPDATE INDICATOR
===================================================== */

function updateIndicator() {

    if (!pageCounter) return;

    if (currentPage === 0) {

        pageCounter.style.display = "none";

        return;

    }

    pageCounter.style.display = "block";

    pageCounter.textContent =
        `${currentPage} / ${totalPages - 1}`;

}

/* =====================================================
   NAVIGATION MANAGER
===================================================== */

function updateNavigation() {

    const creditPage =
        document.getElementById("credit");

    const isCreditPage =
        pages[currentPage] === creditPage;


    /* ================================================
       CREDIT SCENE
    ================================================ */

    if (isCreditPage) {

        if (prevBtn) {

            prevBtn.style.display = "none";

        }

        if (nextBtn) {

            nextBtn.style.display = "none";

        }

        if (pageIndicator) {

            pageIndicator.style.display = "none";

        }

        return;

    }


    /* ================================================
       NORMAL PAGES
    ================================================ */

    if (prevBtn) {

        prevBtn.style.display = "";

        prevBtn.disabled =
            currentPage <= 1;

    }

    if (nextBtn) {

        nextBtn.style.display = "";

        nextBtn.disabled =
            currentPage >= totalPages - 1;

    }

    if (pageIndicator) {

        pageIndicator.style.display = "";

    }

}

/* =====================================================
   SCENE MANAGER
===================================================== */

function updateScene(pageIndex) {

    if (!pages || !pages.length) return;

    pages.forEach((page, index) => {

        if (index === pageIndex) {

            page.classList.add("active");

        } else {

            page.classList.remove("active");

        }

    });

}

/* =====================================================
   PAGE MANAGER
===================================================== */

function updatePage() {

    updateIndicator();

    updateNavigation();

    updateScene(currentPage);

    updateEffects(currentPage);

    updateAudio(currentPage);

}

/* =====================================================
   SHOW PAGE
===================================================== */

function showPage(index) {

    if (index < 0 || index >= totalPages) return;

    pages.forEach(page => {

        page.classList.remove("active");

    });

    currentPage = index;

    pages[currentPage].classList.add("active");

    updatePage();

    const creditPage = document.getElementById("credit");

    if (pages[currentPage] === creditPage) {

        finishJourney();

    }

}

/* =====================================================
   PAGE NAVIGATION
===================================================== */

if (nextBtn) {

    nextBtn.addEventListener("click", () => {

        if (currentPage < totalPages - 1) {

            showPage(currentPage + 1);

        }

    });

}

if (prevBtn) {

    prevBtn.addEventListener("click", () => {

        if (currentPage > 1) {

            showPage(currentPage - 1);

        }

    });

}

/* =====================================================
   INITIAL PAGE
===================================================== */

startLoading();

/* =====================================================
   START JOURNEY
===================================================== */

if (startBtn) {

    startBtn.addEventListener("click", () => {

        playMusic(openingMusic);

        playAmbient(windSound, 0.25);

        playAmbient(birdSound, 0.20);

        showPage(1);

    });

}

/* =====================================================
   RESTART JOURNEY
===================================================== */

if (restartBtn) {

    restartBtn.addEventListener("click", () => {

        // Hentikan ambient
        stopAmbient();

        // Hentikan musik yang sedang diputar
        if (currentMusic) {

            currentMusic.pause();
            currentMusic.currentTime = 0;

        }

        // Reset semua elemen Credit Scene
        document.querySelectorAll(".credit-content > *").forEach(item => {

            item.classList.remove("show");

        });

        // Kembali ke halaman awal
        showPage(0);

    });

}
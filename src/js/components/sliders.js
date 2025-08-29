// Подключение свайпера
import Swiper from "swiper";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";

Swiper.use([Navigation, Pagination, EffectFade, Autoplay]);

let heroSlider = document.querySelector(".hero__slider");

if (heroSlider) {
  const slides = heroSlider.querySelectorAll(".swiper-slide");
  const paginationContainer = heroSlider.querySelector(".hero__pagination");

  const ensureProgressStyles = () => {
    const STYLE_ID = "hero-pagination-progress-styles";
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .hero__pagination-card {  }
      .hero__pagination-progress {  }
      @keyframes heroFillProgress { from { width: 0%; } to { width: 100%; } }
    `;
    document.head.appendChild(style);
  };
  ensureProgressStyles();

  const getCards = () =>
    Array.from(
      (paginationContainer &&
        paginationContainer.querySelectorAll(".hero__pagination-card")) ||
        []
    );

  const swiper = new Swiper(heroSlider, {
    slidesPerView: 1,
    speed: 700,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    on: {
      init: function () {
        initCards(this);
        updateProgress(this);
      },
      slideChangeTransitionStart: function () {
        updateProgress(this);
      },
      autoplayStop: function () {
        resetAllProgressBars();
      },
      autoplayStart: function () {
        startActiveProgressBar(this);
      },
    },
  });
}

function getCards() {
  return Array.from(document.querySelectorAll(".hero__pagination-card"));
}

function getAutoplayDelay(swiperInstance) {
  return (
    ((swiperInstance &&
      swiperInstance.params &&
      swiperInstance.params.autoplay &&
      swiperInstance.params.autoplay.delay) ||
      5000) + 500
  );
}

function resetProgressBar(bar) {
  if (bar) {
    bar.style.animation = "none";
    bar.style.width = "0%";
  }
}

function startProgressBar(bar, duration) {
  if (bar) {
    void bar.offsetWidth;
    bar.style.animation = `heroFillProgress ${duration}ms linear forwards`;
  }
}

function initCards(swiperInstance) {
  const cards = getCards();
  if (cards.length === 0) return;

  cards.forEach((card, index) => {
    if (!card.querySelector(".hero__pagination-progress")) {
      const bar = document.createElement("div");
      bar.className = "hero__pagination-progress";
      card.appendChild(bar);
    }
    card.addEventListener("click", () => {
      if (typeof swiperInstance.slideToLoop === "function") {
        swiperInstance.slideToLoop(index);
      } else {
        swiperInstance.slideTo(index);
      }
    });
  });
}

function updateProgress(swiperInstance) {
  const cards = getCards();
  if (cards.length === 0) return;

  const totalCards = cards.length;
  const rawIndex =
    typeof swiperInstance.realIndex === "number"
      ? swiperInstance.realIndex
      : typeof swiperInstance.activeIndex === "number"
      ? swiperInstance.activeIndex
      : 0;
  const currentIndex = ((rawIndex % totalCards) + totalCards) % totalCards;

  cards.forEach((card) => card.classList.remove("active"));
  const currentCard = cards[currentIndex];
  if (!currentCard) return;
  currentCard.classList.add("active");

  const duration = getAutoplayDelay(swiperInstance);

  cards.forEach((card) => {
    resetProgressBar(card.querySelector(".hero__pagination-progress"));
  });

  startProgressBar(
    currentCard.querySelector(".hero__pagination-progress"),
    duration
  );
}

function resetAllProgressBars() {
  const cards = getCards();
  cards.forEach((card) => {
    resetProgressBar(card.querySelector(".hero__pagination-progress"));
  });
}

function startActiveProgressBar(swiperInstance) {
  const cards = getCards();
  if (cards.length === 0) return;

  const activeCard = cards.find((c) => c.classList.contains("active"));
  if (activeCard) {
    const duration = getAutoplayDelay(swiperInstance);
    resetProgressBar(activeCard.querySelector(".hero__pagination-progress")); // Сброс перед стартом
    startProgressBar(
      activeCard.querySelector(".hero__pagination-progress"),
      duration
    );
  }
}

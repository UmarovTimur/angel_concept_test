// Подключение свайпера
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
Swiper.use([Navigation, Pagination]);

let heroSlider = document.querySelector(".hero__slider");

if (heroSlider) {
  const swiper = new Swiper(heroSlider, {
    slidesPerView: "auto",
  });
}

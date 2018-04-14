import { relatedProd } from './related.json';
import Swiper from 'swiper/dist/js/swiper.js';
//
// const sliderOpts = {
//   autoplay: {
//     delay: 4000,
//     disableOnInteraction: true
//   },
//   effect: 'slide',
//   freeModeMomentum: true,
//   loop: true,
//   slidesPerView: 'auto',
//   spaceBetween: 5,
//   speed: 500,
//   navigation: {
//     nextEl: '.js-slider-next',
//     prevEl: '.js-slider-prev'
//   },
//   keyboard: {
//     enabled: true
//   },
//   a11y: {
//     prevSlideMessage: 'Previous slide',
//     nextSlideMessage: 'Next slide',
//     firstSlideMessage: 'This is the first slide',
//     lastSlideMessage: 'This is the last slide',
//     paginationBulletMessage: 'Go to slide {{index}}'
//   },
// };

Template.relatedProducts.rendered = function () {
    // const gallery = new Swiper('.js-slider', sliderOpts);
};

Template.relatedProducts.helpers({
    products: function () {
        return relatedProd;
    }
});

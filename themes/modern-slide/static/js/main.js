// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Main Vertical Slider
    const mainSwiper = new Swiper('.swiper-container-vertical', {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 0,
        mousewheel: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + ' hover:scale-150 transition-transform duration-300"></span>';
            },
        },
        keyboard: {
            enabled: true,
        },
        speed: 800,
        effect: 'fade', // Use fade effect for vertical transitions or 'slide'
        fadeEffect: {
            crossFade: true
        },
        hashNavigation: {
            watchState: true,
        },
    });

    // Initialize Horizontal Project Slider (if exists)
    const projectSwiper = new Swiper('.swiper-container-projects', {
        direction: 'horizontal',
        slidesPerView: 1,
        spaceBetween: 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination-projects',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let index = 0;
    let slides = document.querySelectorAll(".slide");
    let totalSlides = slides.length;
    let sliderContainer = document.querySelector(".slider-container");

    function moveSlide(step) {
        index += step;
        if (index >= totalSlides) index = 0;
        if (index < 0) index = totalSlides - 1;
        sliderContainer.style.transform = `translateX(-${index * 100}%)`;
    }

    document.querySelector(".prev").addEventListener("click", () => moveSlide(-1));
    document.querySelector(".next").addEventListener("click", () => moveSlide(1));
});

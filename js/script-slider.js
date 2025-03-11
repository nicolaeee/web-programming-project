let currentIndex = 0;

function moveSlide(direction) {
    const slider = document.querySelector(".slider-container");
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;

    currentIndex += direction;

    if (currentIndex < 0) currentIndex = totalSlides - 1;
    if (currentIndex >= totalSlides) currentIndex = 0;

    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

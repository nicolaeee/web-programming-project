let currentIndex = 0;

function moveSlide(direction) {
    const slider = document.querySelector(".slider-container");
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;

    // Calculează noul index
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;

    // Mută sliderul
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

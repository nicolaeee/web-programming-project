let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function moveSlide(direction) {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');

    // Update current slide index
    currentSlide += direction;

    // Handle wrapping around the slides
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    // Add active class to new current slide
    slides[currentSlide].classList.add('active');
}

// Initialize first slide as active
slides[currentSlide].classList.add('active');
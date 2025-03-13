document.addEventListener("scroll", function () {
    let sections = [
        { id: "books", bg: ".books-bg" },
        { id: "authors", bg: ".authors-bg" },
        { id: "contact", bg: ".contact-bg" }
    ];

    sections.forEach(section => {
        let element = document.getElementById(section.id);
        let bg = document.querySelector(section.bg);

        let position = element.getBoundingClientRect().top;
        let screenHeight = window.innerHeight;

        // Fade-in text
        if (position < screenHeight * 0.75) {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        } else {
            element.style.opacity = "0";
            element.style.transform = "translateY(50px)";
        }

        // Parallax efect (invers la scroll în sus)
        let scrollPos = window.scrollY;
        let direction = scrollPos > this.lastScroll ? -1 : 1;
        bg.style.transform = `translateY(${scrollPos * 0.3 * direction}px)`;

        this.lastScroll = scrollPos;
    });
});

// Slider
let index = 0;
function moveSlide(step) {
    let slides = document.querySelectorAll(".slide");
    index += step;
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    document.querySelector(".slider-container").style.transform = `translateX(-${index * 100}%)`;
}

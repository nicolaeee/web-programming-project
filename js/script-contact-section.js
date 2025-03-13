document.addEventListener("scroll", function () {
    let contactSection = document.getElementById("contact");
    let contactContent = document.querySelector(".contact-content");
    let contactBg = document.querySelector(".contact-bg");

    let position = contactSection.getBoundingClientRect().top;
    let screenHeight = window.innerHeight;

    // Efect de fade-in când secțiunea devine vizibilă
    if (position < screenHeight * 0.75) {
        contactContent.style.opacity = "1";
        contactContent.style.transform = "translateY(0)";
    } else {
        contactContent.style.opacity = "0";
        contactContent.style.transform = "translateY(50px)";
    }

    // Efect de parallax (normal la scroll în jos, invers la scroll în sus)
    let scrollPos = window.scrollY;
    let direction = scrollPos > this.lastScroll ? -1 : 1; // -1 = jos, 1 = sus
    contactBg.style.transform = `translateY(${scrollPos * 0.3 * direction}px)`;

    this.lastScroll = scrollPos;
});

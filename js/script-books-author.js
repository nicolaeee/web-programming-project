document.addEventListener("scroll", function () {
    let scrollTop = window.scrollY;

    // Efect de parallax pentru books (se mișcă mai lent)
    let booksBg = document.querySelector(".books-bg");
    if (booksBg) {
        booksBg.style.transform = `translateY(${scrollTop * 0.5}px) scale(1.1)`;
    }

    // Efect de parallax invers pentru authors (se mișcă în sus)
    let authorsBg = document.querySelector(".authors-bg");
    if (authorsBg) {
        authorsBg.style.transform = `translateY(-${scrollTop * 0.5}px) scale(1.1)`;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let modal = document.getElementById("loginModal");
    let openBtn = document.getElementById("openModalBtn");
    let closeBtn = document.querySelector(".close");

    // Deschide modalul
    openBtn.addEventListener("click", function () {
        modal.style.display = "flex";
    });

    // Închide modalul
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Închidere când se apasă în afara ferestrei
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

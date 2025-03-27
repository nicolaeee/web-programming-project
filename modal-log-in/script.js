document.addEventListener("DOMContentLoaded", function () {
    let modal = document.getElementById("loginModal");
    let openBtn = document.getElementById("openModalBtn");
    let closeBtn = document.querySelector(".close");
    let adminBtn = document.querySelector(".admin-btn");
    let userBtn = document.querySelector(".user-btn");

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

    // Exemplu de autentificare (va trebui înlocuit cu logica reală de autentificare)
    adminBtn.addEventListener("click", function () {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        if (username && password) {
            alert("Autentificare administrator: " + username);
            // Adăugați logica de autentificare pentru administrator
        } else {
            alert("Vă rugăm să introduceți username și parolă");
        }
    });

    userBtn.addEventListener("click", function () {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        if (username && password) {
            alert("Autentificare utilizator: " + username);
            // Adăugați logica de autentificare pentru utilizator
        } else {
            alert("Vă rugăm să introduceți username și parolă");
        }
    });
});
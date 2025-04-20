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

    // Logica pentru autentificare administrator
    adminBtn.addEventListener("click", function () {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        if (username === "admin123" && password === "admin321") {
            window.location.href = "admin.html";
        } else {
            alert("Nume de utilizator sau parolă incorecte pentru administrator.");
        }
    });

    // Logica pentru autentificare utilizator
    userBtn.addEventListener("click", function () {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        if (username === "user123" && password === "user321") {
            window.location.href = "user.html";
        } else {
            alert("Nume de utilizator sau parolă incorecte pentru utilizator.");
        }
    });
});

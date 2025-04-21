document.getElementById("searchInput").addEventListener("input", function () {
    const keyword = this.value;

    fetch(`php/search_books.php?keyword=${encodeURIComponent(keyword)}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("booksContainer");
            container.innerHTML = "";

            data.forEach(book => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <h3>${book.titlu}</h3>
                    <p>Autor: ${book.autor}</p>
                    <p>Gen: ${book.gen}</p>
                    <p>Preț: ${book.pret} RON</p>
                `;
                container.appendChild(div);
            });
        });
});

// Coșul de cumpărături
let cart = [];

// Adaugă cartea în coș
function addToCart(book) {
cart.push(book);
}

// Actualizează lista cărților din coș
function updateCartModal() {
const cartContent = document.getElementById("cartContent");
cartContent.innerHTML = ""; // Curăță conținutul actual

if (cart.length === 0) {
  cartContent.innerHTML = "<p>Coșul este gol.</p>";
} else {
  cart.forEach(book => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${book.titlu}</strong> - ${book.pret} RON</p>
    `;
    cartContent.appendChild(div);
  });
}
}

// Deschide modalul coșului
document.getElementById("cartButton").addEventListener("click", function () {
updateCartModal();
document.getElementById("cartModal").style.display = "block";
});

// Închide modalul coșului
document.querySelector(".close-modal-cart").addEventListener("click", function () {
document.getElementById("cartModal").style.display = "none";
});

// Închide modalul coșului dacă se face click în afara lui
window.addEventListener("click", function (event) {
if (event.target === document.getElementById("cartModal")) {
  document.getElementById("cartModal").style.display = "none";
}
});

function addToCartListeners() {
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.onclick = (e) => {
    const bookDiv = e.target.closest(".book");
    const titlu = bookDiv.querySelector("h3").textContent;
    const autor = bookDiv.querySelector("p:nth-of-type(1)").textContent.replace("Autor: ", "");
    const pretText = bookDiv.querySelector("p:nth-of-type(2)").textContent;
    const pret = parseFloat(pretText.replace("Preț: ", "").replace(" RON", ""));

    cart.push({ titlu, autor, pret });
    console.log("Carte adăugată în coș:", titlu);
  };
});
}


// Apel inițial pt. cărțile deja afișate
addToCartListeners();


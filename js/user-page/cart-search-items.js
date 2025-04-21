
document.getElementById("searchInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const keyword = this.value.trim();

        if (keyword.length < 2) return;

        fetch(`php/search_books.php?keyword=${encodeURIComponent(keyword)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const book = data[0]; // Prima carte găsită

                    const content = `
                        <h2>${book.titlu}</h2>
                        <p><strong>Autor:</strong> ${book.autor}</p>
                        <p><strong>Gen:</strong> ${book.gen}</p>
                        <p><strong>Preț:</strong> ${book.pret} RON</p>
                        <button class="add-to-cart-btn" data-id="${book.id}" data-title="${book.titlu}" data-pret="${book.pret}">Adaugă în coș</button>
                    `;

                    document.getElementById("modalContent").innerHTML = content;
                    document.getElementById("bookModal").style.display = "block";

                    document.querySelector(".add-to-cart-btn").addEventListener("click", function () {
  const id = this.dataset.id;
  const titlu = this.dataset.title;
  const pret = this.dataset.pret;

  // Adaugă cartea în coș
  addToCart({ id, titlu, pret });

  // Afișează un mesaj și închide modalul
  alert(`"${titlu}" a fost adăugată în coș.`);
  document.getElementById("bookModal").style.display = "none";
});

                } else {
                    alert("Nu am găsit nicio carte cu acel cuvânt cheie.");
                }
            });
    }
});

// Închide modalul când se apasă pe "X"
document.querySelector(".close-modal").addEventListener("click", function () {
  document.getElementById("bookModal").style.display = "none";
});
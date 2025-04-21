  // Deschidere/închidere modal
  document.getElementById("openGenreModal").onclick = () => {
    document.getElementById("genreModal").style.display = "block";
  };
  document.getElementById("closeGenreModal").onclick = () => {
    document.getElementById("genreModal").style.display = "none";
  };

  // Afișează cărțile filtrate după gen
  document.getElementById("filterByGenre").onclick = async () => {
    const gen = document.getElementById("genreSelect").value;

    try {
      const response = await fetch(`php/getBooksByGenre.php?gen=${encodeURIComponent(gen)}`);
      const data = await response.json();

      const container = document.querySelector(".filtered-books");
      container.innerHTML = ""; // curățăm afișajul anterior

      data.forEach(book => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");
        bookDiv.innerHTML = `
          <h3>${book.titlu}</h3>
          <p>Autor: ${book.autor}</p>
          <p>Preț: ${book.pret} RON</p>
          <button class="add-to-cart">Adaugă în coș</button>
        `;
        container.appendChild(bookDiv);
      });

      // Atașăm logica de coș la butoanele noi
      addToCartListeners();

      document.getElementById("genreModal").style.display = "none";
    } catch (err) {
      console.error("Eroare la preluarea cărților:", err);
    }
  };

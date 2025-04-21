document.getElementById("openPriceModal").addEventListener("click", function() {
    document.getElementById("priceModal").style.display = "block";
 });

 document.getElementById("closePriceModal").addEventListener("click", function() {
    document.getElementById("priceModal").style.display = "none";
 });

 document.getElementById("filterByPrice").addEventListener("click", function() {
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;

    if (minPrice && maxPrice) {
       filterBooksByPrice(minPrice, maxPrice);
       document.getElementById("priceModal").style.display = "none";
    } else {
       alert("Te rugăm să completezi ambele câmpuri!");
    }
 });

 function filterBooksByPrice(min, max) {
    // Exemplu de cărți (înlocuiește cu datele din baza ta de date sau un API)
    const books = [
       { titlu: "Cartea 1", autor: "Popescu", pret: 50 },
       { titlu: "Cartea 2", autor: "Ionescu", pret: 45 },
       { titlu: "Cartea 3", autor: "Enescu", pret: 60 },
       { titlu: "Cartea 4", autor: "Preda", pret: 38 },
       { titlu: "Cartea 5", autor: "Eliade", pret: 42 },
    ];

    const filteredBooks = books.filter(book => book.pret >= min && book.pret <= max);
    showFilteredBooks(filteredBooks);
 }

 function showFilteredBooks(books) {
    const container = document.getElementById("filteredBooksContent");
    container.innerHTML = "";

    if (books.length === 0) {
       container.innerHTML = "<p>Nu există cărți în acest interval de preț.</p>";
    } else {
       books.forEach((book) => {
          const div = document.createElement("div");
          div.className = "book";
          div.innerHTML = `
             <strong>${book.titlu}</strong><br>
             Autor: ${book.autor}<br>
             Preț: ${book.pret} RON<br>
             <button onclick='adaugaInCos(${JSON.stringify(book)})'>Adaugă în coș</button>
          `;
          container.appendChild(div);
       });
    }

    document.getElementById("filteredBooksContainer").style.display = "block";
 }

 function closeFilteredBooks() {
    document.getElementById("filteredBooksContainer").style.display = "none";
 }

  // Coșul de cumpărături

// Adaugă cartea în coș
function addToCart(book) {
    cart.push(book);  // Adaugă cartea în array-ul cart
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

  function closeFilteredBooks() {
    document.getElementById("filteredBooksContainer").style.display = "none";
 }

 document.getElementById("checkoutButton").addEventListener("click", () => {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  fetch("php/save-order.php", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItems)
  })
  .then(res => res.json())
  .then(data => {
      console.log("Comandă salvată:", data);
      alert("Comanda a fost trimisă către admin!");
      localStorage.removeItem("cartItems");
      location.href = "admin.html"; // dacă vrei redirect
  })
  .catch(err => console.error("Eroare salvare comandă:", err));
});

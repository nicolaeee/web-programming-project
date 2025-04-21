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
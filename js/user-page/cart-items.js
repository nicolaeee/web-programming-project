// Actualizare script pentru coș - cart-items
document.addEventListener('DOMContentLoaded', function() {
  // Variabile pentru elemente DOM
  const cartButton = document.getElementById('cartButton');
  const cartModal = document.getElementById('cartModal');
  const cartContent = document.getElementById('cartContent');
  const closeCartModal = document.querySelector('.close-modal-cart');
  const cartTotal = document.getElementById('cartTotal');

  // Deschiderea modalului coșului
  cartButton.addEventListener('click', function() {
      displayCart();
      cartModal.style.display = 'block';

      // Adăugare în istoric
      addToHistory('A deschis coșul de cumpărături');
  });

  // Închiderea modalului coșului
  closeCartModal.addEventListener('click', function() {
      cartModal.style.display = 'none';
  });

  // Funcție pentru afișarea coșului
  function displayCart() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      let total = 0;

      if (cart.length === 0) {
          cartContent.innerHTML = '<p>Coșul tău este gol.</p>';
          cartTotal.textContent = '0';
          return;
      }

      let cartHTML = '<div class="cart-items">';

      cart.forEach((item, index) => {
          const subtotal = item.price * item.quantity;
          total += subtotal;

          cartHTML += `
              <div class="cart-item">
                  <div class="cart-item-details">
                      <h4>${item.title}</h4>
                      <p>Autor: ${item.author}</p>
                      <p>Preț: ${item.price} RON</p>
                      <div class="quantity-controls">
                          <button class="decrease-quantity" data-index="${index}">-</button>
                          <span class="item-quantity">${item.quantity}</span>
                          <button class="increase-quantity" data-index="${index}">+</button>
                      </div>
                  </div>
                  <div class="cart-item-subtotal">
                      <p>${subtotal} RON</p>
                      <button class="remove-from-cart" data-index="${index}">Elimină</button>
                  </div>
              </div>
          `;
      });

      cartHTML += '</div>';
      cartContent.innerHTML = cartHTML;
      cartTotal.textContent = total;

      // Adăugare event listeners pentru butoanele de cantitate și eliminare
      setupCartControls();
  }

  // Funcție pentru setarea controalelor din coș
  function setupCartControls() {
      // Butoane pentru creșterea cantității
      const increaseButtons = document.querySelectorAll('.increase-quantity');
      increaseButtons.forEach(button => {
          button.addEventListener('click', function() {
              const index = this.getAttribute('data-index');
              updateCartItemQuantity(index, 1);
          });
      });

      // Butoane pentru scăderea cantității
      const decreaseButtons = document.querySelectorAll('.decrease-quantity');
      decreaseButtons.forEach(button => {
          button.addEventListener('click', function() {
              const index = this.getAttribute('data-index');
              updateCartItemQuantity(index, -1);
          });
      });

      // Butoane pentru eliminarea din coș
      const removeButtons = document.querySelectorAll('.remove-from-cart');
      removeButtons.forEach(button => {
          button.addEventListener('click', function() {
              const index = this.getAttribute('data-index');
              removeCartItem(index);
          });
      });
  }

  // Funcție pentru actualizarea cantității unui produs
  function updateCartItemQuantity(index, change) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      if (cart[index]) {
          cart[index].quantity += change;

          // Asigurare că nu scade sub 1
          if (cart[index].quantity < 1) {
              cart[index].quantity = 1;
          }

          localStorage.setItem('cart', JSON.stringify(cart));
          displayCart();
          updateCartCount();

          // Adăugare în istoric
          addToHistory(`A modificat cantitatea pentru ${cart[index].title}`);
      }
  }

  // Funcție pentru eliminarea unui produs din coș
  function removeCartItem(index) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      if (cart[index]) {
          const removedItem = cart[index].title;
          cart.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(cart));
          displayCart();
          updateCartCount();

          // Adăugare în istoric
          addToHistory(`A eliminat ${removedItem} din coș`);
      }
  }

  // Actualizarea numărului de produse din coș (dacă există)
  function updateCartCount() {
      const cartCountElement = document.getElementById('cartCount');
      if (cartCountElement) {
          const cart = JSON.parse(localStorage.getItem('cart')) || [];
          let totalItems = 0;
          cart.forEach(item => {
              totalItems += item.quantity;
          });
          cartCountElement.textContent = totalItems;
      }
  }
});
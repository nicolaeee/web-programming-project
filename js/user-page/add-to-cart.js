// Coșul de cumpărături - add-to-cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Funcție pentru a adăuga cartea în coș
function addToCart(book) {
    cart.push(book);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    logUserAction(`A adăugat în coș: ${book.titlu}`);
}

// Funcție pentru a șterge cartea din coș
function removeFromCart(index) {
    const removedBook = cart[index];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    updateCartModal();
    updateCartTotal();
    logUserAction(`A eliminat din coș: ${removedBook.titlu}`);
}

// Funcție pentru a actualiza numărul de articole din coș
function updateCartCounter() {
    const cartButton = document.getElementById("cartButton");
    cartButton.textContent = `Coșul meu (${cart.length})`;
}

// Funcție pentru a obține coșul
function getCart() {
    return cart;
}

// Funcție pentru a goli coșul
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    updateCartModal();
    updateCartTotal();
    logUserAction("A golit coșul de cumpărături");
}

// Funcție pentru a calcula totalul coșului
function calculateCartTotal() {
    return cart.reduce((total, item) => total + item.pret, 0);
}

// Funcție pentru a actualiza totalul afișat în coș
function updateCartTotal() {
    const totalElement = document.getElementById("cartTotal");
    if (totalElement) {
        totalElement.textContent = calculateCartTotal().toFixed(2);
    }
}

// Funcție pentru a actualiza modalul coșului
function updateCartModal() {
    const cartContent = document.getElementById("cartContent");
    if (!cartContent) return;

    cartContent.innerHTML = "";

    if (cart.length === 0) {
        cartContent.innerHTML = "<p>Coșul este gol.</p>";
    } else {
        cart.forEach((book, index) => {
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <div class="cart-item-details">
                    <h4>${book.titlu}</h4>
                    <p>Autor: ${book.autor}</p>
                    <p>Preț: ${book.pret.toFixed(2)} RON</p>
                </div>
                <button class="remove-from-cart" data-index="${index}">Elimină</button>
            `;
            cartContent.appendChild(cartItem);
        });

        // Adaugă event listeners pentru butoanele de eliminare
        document.querySelectorAll(".remove-from-cart").forEach(button => {
            button.addEventListener("click", function() {
                const index = parseInt(this.getAttribute("data-index"));
                removeFromCart(index);
            });
        });
    }

    updateCartTotal();
}

// Inițializează cart counter la încărcare
document.addEventListener("DOMContentLoaded", function() {
    updateCartCounter();

    // Adaugă listeners pentru toate cărțile existente
    addToCartListeners();

    // Deschide modalul coșului
    document.getElementById("cartButton").addEventListener("click", function() {
        updateCartModal();
        document.getElementById("cartModal").style.display = "block";
    });

    // Închide modalul coșului
    const closeCartModal = document.querySelector(".close-modal-cart");
    if (closeCartModal) {
        closeCartModal.addEventListener("click", function() {
            document.getElementById("cartModal").style.display = "none";
        });
    }

    // Event listener pentru butonul de finalizare comandă
    const checkoutButton = document.getElementById("checkoutButton");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", function() {
            if (cart.length === 0) {
                alert("Coșul este gol. Adăugați cărți pentru a finaliza comanda.");
                return;
            }

            // Afișează modalul de checkout
            document.getElementById("cartModal").style.display = "none";

            // Pregătește sumarul comenzii
            const orderSummary = document.getElementById("orderSummary");
            orderSummary.innerHTML = "";

            cart.forEach(book => {
                const orderItem = document.createElement("div");
                orderItem.className = "order-item";
                orderItem.innerHTML = `
                    <div class="order-item-details">
                        <h4>${book.titlu}</h4>
                        <p>Autor: ${book.autor}</p>
                        <p>Preț: ${book.pret.toFixed(2)} RON</p>
                    </div>
                `;
                orderSummary.appendChild(orderItem);
            });

            document.getElementById("orderTotal").textContent = calculateCartTotal().toFixed(2);
            document.getElementById("checkoutModal").style.display = "block";

            logUserAction("A început procesul de finalizare a comenzii");
        });
    }

    // Închide modalul de checkout dacă se face click în afara lui
    window.addEventListener("click", function(event) {
        if (event.target === document.getElementById("cartModal")) {
            document.getElementById("cartModal").style.display = "none";
        }
        if (event.target === document.getElementById("checkoutModal")) {
            document.getElementById("checkoutModal").style.display = "none";
        }
    });
});

// Adaugă event listeners pentru toate cărțile
function addToCartListeners() {
    // Pentru cărțile existente în pagină
    document.querySelectorAll(".book").forEach(bookDiv => {
        // Verifică dacă există deja un buton de adăugare în coș
        if (!bookDiv.querySelector(".add-to-cart")) {
            const addButton = document.createElement("button");
            addButton.className = "add-to-cart";
            addButton.textContent = "Adaugă în coș";
            bookDiv.appendChild(addButton);
        }
    });

    // Adaugă event listeners pentru toate butoanele de adăugare în coș
    document.querySelectorAll(".add-to-cart").forEach(button => {
        // Îndepărtăm event listener-ul vechi pentru a evita duplicarea
        button.removeEventListener("click", handleAddToCart);
        // Adăugăm noul event listener
        button.addEventListener("click", handleAddToCart);
    });
}

// Funcție handler pentru click pe butonul "Adaugă în coș"
function handleAddToCart(e) {
    const bookDiv = e.target.closest(".book");
    const titlu = bookDiv.querySelector("h3").textContent;
    const autorElement = bookDiv.querySelector("p:nth-of-type(1)");
    const pretElement = bookDiv.querySelector("p:nth-of-type(2)");

    if (!autorElement || !pretElement) {
        console.error("Nu s-au găsit elementele necesare pentru autor sau preț");
        return;
    }

    const autor = autorElement.textContent.replace("Autor: ", "");
    const pretText = pretElement.textContent;
    const pret = parseFloat(pretText.replace("Preț: ", "").replace(" RON", ""));

    if (isNaN(pret)) {
        console.error("Prețul nu este valid:", pretText);
        return;
    }

    const book = { titlu, autor, pret };
    addToCart(book);

    // Feedback vizual
    const originalText = e.target.textContent;
    e.target.textContent = "Adăugat ✓";
    e.target.disabled = true;

    setTimeout(() => {
        e.target.textContent = originalText;
        e.target.disabled = false;
    }, 1500);
}
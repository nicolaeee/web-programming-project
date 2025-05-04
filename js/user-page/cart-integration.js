// Script pentru a repara problema deschiderii modalului coșului
// și pentru a rezolva problema cu addToCart nedefinit

// Definirea funcției addToCart în context global pentru a putea fi accesată din alte scripturi
window.addToCart = function(book) {
    // Verifică dacă cartea are toate proprietățile necesare
    if (!book.titlu || !book.autor || book.pret === undefined) {
        console.error("Cartea nu conține toate informațiile necesare", book);
        return;
    }

    // Asigură-te că prețul este număr
    book.pret = parseFloat(book.pret);

    // Obține coșul curent
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Verifică dacă cartea este deja în coș
    const existingBookIndex = cart.findIndex(item =>
        item.titlu === book.titlu && item.autor === book.autor
    );

    if (existingBookIndex !== -1) {
        // Dacă cartea există deja, incrementează cantitatea
        cart[existingBookIndex].quantity = (cart[existingBookIndex].quantity || 1) + 1;
    } else {
        // Altfel, adaugă cartea cu cantitatea 1
        book.quantity = 1;
        cart.push(book);
    }

    // Salvează coșul în localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Actualizează contorul
    if (typeof updateCartCounter === 'function') {
        updateCartCounter();
    }

    // Logare acțiune
    if (typeof logUserAction === 'function') {
        logUserAction(`A adăugat în coș: ${book.titlu}`);
    } else {
        console.log("Acțiune utilizator:", `A adăugat în coș: ${book.titlu}`);
    }

    // Feedback vizual
    alert(`"${book.titlu}" a fost adăugat în coș!`);
};

// Definirea funcției logUserAction în context global
window.logUserAction = function(action) {
    console.log("Acțiune utilizator:", action);
    // Verifică dacă funcția există în alt script
    if (typeof addToHistory === 'function') {
        addToHistory(action);
    }
};

document.addEventListener("DOMContentLoaded", function() {
    console.log("Script de reparare coș încărcat");

    // Definește updateCartCounter în context global pentru a fi accesată din alte scripturi
    window.updateCartCounter = function() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let totalItems = 0;

        cart.forEach(item => {
            totalItems += item.quantity || 1;
        });

        const cartButton = document.getElementById("cartButton");
        if (cartButton) {
            cartButton.textContent = `Coșul meu (${totalItems})`;
        }

        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    };

    // 1. Verifică dacă există butonul coșului
    const cartButton = document.getElementById("cartButton");
    if (!cartButton) {
        console.error("Butonul coșului nu a fost găsit!");
        return;
    }

    // 2. Verifică dacă există modalul coșului
    const cartModal = document.getElementById("cartModal");
    if (!cartModal) {
        console.error("Modalul coșului nu a fost găsit!");
        return;
    }

    // 3. Adaugă un event listener direct pe butonul coșului
    cartButton.addEventListener("click", function(e) {
        e.preventDefault();
        console.log("Click pe butonul coșului - handler nou");

        // Actualizează conținutul coșului
        updateCartModalContent();

        // Afișează modalul
        cartModal.style.display = "block";
        logUserAction('A deschis coșul de cumpărături');
    });

    // 4. Adaugă un event listener pentru închiderea modalului
    const closeCartModal = document.querySelector(".close-modal-cart");
    if (closeCartModal) {
        closeCartModal.addEventListener("click", function() {
            cartModal.style.display = "none";
        });
    } else {
        console.error("Butonul de închidere a modalului coșului nu a fost găsit!");

        // Adaugă un buton de închidere dacă nu există
        const modalContent = cartModal.querySelector(".modal-content");
        if (modalContent) {
            const closeButton = document.createElement("span");
            closeButton.className = "close-modal-cart";
            closeButton.textContent = "×";
            closeButton.style.position = "absolute";
            closeButton.style.top = "10px";
            closeButton.style.right = "10px";
            closeButton.style.fontSize = "24px";
            closeButton.style.cursor = "pointer";

            closeButton.addEventListener("click", function() {
                cartModal.style.display = "none";
            });

            modalContent.style.position = "relative";
            modalContent.insertBefore(closeButton, modalContent.firstChild);
        }
    }

    // 5. Funcție optimizată pentru actualizarea modalului coșului
    // Cu conversie de preț pentru a rezolva problema toFixed
    function updateCartModalContent() {
        console.log("Actualizare conținut modal coș");

        // Obține coșul din localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log("Coș încărcat din localStorage:", cart);
        console.log("Număr de articole în coș:", cart.length);

        const cartContent = document.getElementById("cartContent");
        if (!cartContent) {
            console.error("Elementul cartContent nu există în DOM");
            return;
        }

        cartContent.innerHTML = "";

        if (cart.length === 0) {
            cartContent.innerHTML = "<p>Coșul este gol.</p>";
        } else {
            cart.forEach((book, index) => {
                console.log("Adăugare articol în modal:", book.titlu);

                // Asigură-te că prețul este un număr
                const pret = parseFloat(book.pret) || 0;
                const quantity = book.quantity || 1;
                const subtotal = pret * quantity;

                const cartItem = document.createElement("div");
                cartItem.className = "cart-item";
                cartItem.innerHTML = `
                    <div class="cart-item-details">
                        <h4>${book.titlu}</h4>
                        <p>Autor: ${book.autor}</p>
                        <p>Preț: ${pret.toFixed(2)} RON</p>
                        <div class="quantity-controls">
                            <button class="decrease-quantity" data-index="${index}">-</button>
                            <span class="item-quantity">${quantity}</span>
                            <button class="increase-quantity" data-index="${index}">+</button>
                        </div>
                    </div>
                    <div class="cart-item-subtotal">
                        <p>${subtotal.toFixed(2)} RON</p>
                        <button class="remove-from-cart" data-index="${index}">Elimină</button>
                    </div>
                `;
                cartContent.appendChild(cartItem);
            });

            // Setăm controalele pentru manipularea coșului
            setupCartControls();
        }

        // Actualizăm totalul
        updateCartTotal();
    }

    // 6. Funcție pentru calcularea și afișarea totalului
    function updateCartTotal() {
        const totalElement = document.getElementById("cartTotal");
        if (totalElement) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const total = cart.reduce((sum, item) => {
                // Asigură-te că prețul este un număr
                const pret = parseFloat(item.pret) || 0;
                return sum + (pret * (item.quantity || 1));
            }, 0);
            totalElement.textContent = total.toFixed(2);
        }
    }

    // 7. Funcție pentru setarea controalelor din coș
    function setupCartControls() {
        // Butoane pentru creșterea cantității
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                updateCartItemQuantity(index, 1);
            });
        });

        // Butoane pentru scăderea cantității
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                updateCartItemQuantity(index, -1);
            });
        });

        // Butoane pentru eliminarea din coș
        document.querySelectorAll(".remove-from-cart").forEach(button => {
            button.addEventListener("click", function() {
                const index = parseInt(this.getAttribute("data-index"));
                removeFromCart(index);
            });
        });
    }

    // 8. Funcție pentru actualizarea cantității unui produs
    function updateCartItemQuantity(index, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart[index]) {
            cart[index].quantity = (cart[index].quantity || 1) + change;

            // Asigurare că nu scade sub 1
            if (cart[index].quantity < 1) {
                cart[index].quantity = 1;
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartModalContent();
            updateCartCounter();
        }
    }

    // 9. Funcție pentru a elimina un produs din coș
    function removeFromCart(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart[index]) {
            const removedBook = cart[index];
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartModalContent();
            updateCartCounter();
            logUserAction(`A eliminat din coș: ${removedBook.titlu}`);
        }
    }

    // 12. Verifică dacă există handler-ul de finalizare a comenzii
    const checkoutButton = document.getElementById("checkoutButton");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", function() {
            // Verifică dacă există produse în coș
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert("Coșul este gol. Adaugă produse înainte de a finaliza comanda.");
                return;
            }

            // Dacă există o funcție de finalizare a comenzii în alt script, o apelează
            if (typeof showCheckoutModal === 'function') {
                showCheckoutModal();
            } else {
                // Dacă nu există, implementează o funcționalitate de bază
                cartModal.style.display = "none";

                // Verifică dacă există modalul de checkout
                const checkoutModal = document.getElementById("checkoutModal");
                if (checkoutModal) {
                    // Populează sumarul comenzii
                    populateOrderSummary();
                    checkoutModal.style.display = "block";
                }
            }
        });
    }

    // 13. Funcție pentru popularea sumarului comenzii
    function populateOrderSummary() {
        const orderSummary = document.getElementById("orderSummary");
        const orderTotal = document.getElementById("orderTotal");

        if (!orderSummary || !orderTotal) {
            console.error("Elementele pentru sumarul comenzii nu au fost găsite!");
            return;
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;

        orderSummary.innerHTML = "";

        cart.forEach(item => {
            const pret = parseFloat(item.pret) || 0;
            const quantity = item.quantity || 1;
            const subtotal = pret * quantity;
            total += subtotal;

            const orderItem = document.createElement("div");
            orderItem.className = "order-item";
            orderItem.innerHTML = `
                <div class="order-item-details">
                    <h4>${item.titlu}</h4>
                    <p>Autor: ${item.autor}</p>
                    <p>Cantitate: ${quantity}</p>
                    <p>Preț: ${pret.toFixed(2)} RON</p>
                </div>
                <div class="order-item-subtotal">
                    <p>${subtotal.toFixed(2)} RON</p>
                </div>
            `;
            orderSummary.appendChild(orderItem);
        });

        orderTotal.textContent = total.toFixed(2);
    }

    // Inițializează contorul coșului la încărcarea paginii
    updateCartCounter();

    // Verifică dacă există cărți în localStorage și dacă da, adaugă clasele și event listeners necesare
    const books = document.querySelectorAll('.book');
    books.forEach((book, index) => {
        // Adaugă clasa pentru stilizare
        book.classList.add('clickable');

        // Adaugă butonul "Adaugă în coș" dacă nu există deja
        if (!book.querySelector('.add-to-cart')) {
            const addButton = document.createElement('button');
            addButton.className = 'add-to-cart';
            addButton.textContent = 'Adaugă în coș';
            addButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Oprește propagarea evenimentului pentru a nu deschide modalul cărții

                // Extrage detaliile cărții
                const title = book.querySelector('h3').textContent;
                const authorText = book.querySelector('p:nth-child(2)').textContent;
                const author = authorText.replace('Autor: ', '');
                const priceText = book.querySelector('p:nth-child(3)').textContent;
                const price = parseFloat(priceText.replace('Preț: ', '').replace(' RON', '')) || 0;

                // Adaugă în coș
                window.addToCart({
                    titlu: title,
                    autor: author,
                    pret: price
                });
            });
            book.appendChild(addButton);
        }
    });

    console.log("Script de reparare coș încărcat complet");
});
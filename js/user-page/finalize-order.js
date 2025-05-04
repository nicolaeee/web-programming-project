// Gestionarea finalizării comenzii
document.addEventListener('DOMContentLoaded', function() {
    // Elemente DOM
    const checkoutButton = document.getElementById('checkoutButton');
    const checkoutModal = document.getElementById('checkoutModal');
    const orderSummary = document.getElementById('orderSummary');
    const orderTotal = document.getElementById('orderTotal');
    const closeCheckoutModal = document.querySelector('.close-modal-checkout');
    const checkoutForm = document.getElementById('checkoutForm');
    const placeOrderButton = document.getElementById('placeOrderButton');
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    const closeConfirmationModal = document.querySelector('.close-modal-confirmation');
    const orderNumber = document.getElementById('orderNumber');
    const downloadPdf = document.getElementById('downloadPdf');
    const downloadXls = document.getElementById('downloadXls');
    const downloadPdfConfirmation = document.getElementById('downloadPdfConfirmation');
    const downloadXlsConfirmation = document.getElementById('downloadXlsConfirmation');
    const backToShop = document.getElementById('backToShop');
    const cartTotal = document.getElementById('cartTotal');

    // Deschiderea modalului de checkout
    checkoutButton.addEventListener('click', function() {
        // Verificăm dacă coșul are produse
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Coșul tău este gol. Adaugă produse înainte de a finaliza comanda.');
            return;
        }

        displayOrderSummary();
        checkoutModal.style.display = 'block';

        // Adăugăm acțiunea în istoric
        addToHistory('A început procesul de finalizare a comenzii');

        // Închidere modal coș
        document.getElementById('cartModal').style.display = 'none';
    });

    // Închiderea modalului de checkout
    closeCheckoutModal.addEventListener('click', function() {
        checkoutModal.style.display = 'none';
    });

    // Închiderea modalului de confirmare
    closeConfirmationModal.addEventListener('click', function() {
        orderConfirmationModal.style.display = 'none';
    });

    // Trimiterea formularului de checkout
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Procesarea comenzii
        processOrder();

        // Afișare modal confirmare
        showOrderConfirmation();

        // Ascundere modal checkout
        checkoutModal.style.display = 'none';
    });

    // Butonul înapoi la cumpărături
    backToShop.addEventListener('click', function() {
        orderConfirmationModal.style.display = 'none';
        // Golire coș după finalizarea comenzii
        localStorage.removeItem('cart');
        updateCartCount();
    });

    // Download PDF din ambele modele
    downloadPdf.addEventListener('click', function() {
        generatePDF();
    });

    downloadPdfConfirmation.addEventListener('click', function() {
        generatePDF();
    });

    // Download XLS din ambele modele
    downloadXls.addEventListener('click', function() {
        generateXLS();
    });

    downloadXlsConfirmation.addEventListener('click', function() {
        generateXLS();
    });

    // Funcția de afișare a sumarului comenzii
    function displayOrderSummary() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;

        // Creare tabel pentru sumarul comenzii
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Carte</th>
                        <th>Autor</th>
                        <th>Preț</th>
                        <th>Cantitate</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
        `;

        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            tableHTML += `
                <tr>
                    <td>${item.title}</td>
                    <td>${item.author}</td>
                    <td>${item.price} RON</td>
                    <td>${item.quantity}</td>
                    <td>${subtotal} RON</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        orderSummary.innerHTML = tableHTML;
        orderTotal.textContent = total;

        // Actualizare și în coș
        cartTotal.textContent = total;
    }

    // Procesarea comenzii
    function processOrder() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const orderDate = new Date();

        // Obținerea datelor din formular
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            paymentMethod: document.getElementById('paymentMethod').value
        };

        // Calculul totalului
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });

        // Crearea obiectului comandă
        const order = {
            id: generateOrderId(),
            date: orderDate.toISOString(),
            items: cart,
            total: total,
            customer: formData,
            status: 'În procesare'
        };

        // Salvarea comenzii în localStorage pentru a putea fi accesată de pagina admin
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Adăugare în istoric
        addToHistory(`A plasat comanda #${order.id} în valoare de ${total} RON`);

        return order;
    }

    // Afișare confirmare comandă
    function showOrderConfirmation() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const latestOrder = orders[orders.length - 1];

        // Afișare număr comandă
        orderNumber.textContent = latestOrder.id;

        // Afișare modal confirmare
        orderConfirmationModal.style.display = 'block';

        // Afișare opțiuni descărcare
        document.querySelector('.download-options').style.display = 'block';
    }

    // Generare ID comandă
    function generateOrderId() {
        return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Generare PDF
    function generatePDF() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const latestOrder = orders[orders.length - 1];

        // În mod normal aici am folosi o bibliotecă precum jsPDF
        // Dar pentru simplitate, simulăm descărcarea
        alert('Generarea PDF-ului este simulată. În aplicația reală, ar trebui folosită o bibliotecă precum jsPDF pentru generarea și descărcarea PDF-ului.');

        // Adaugă în istoric
        addToHistory(`A descărcat factura în format PDF pentru comanda #${latestOrder.id}`);
    }

    // Generare XLS
    function generateXLS() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const latestOrder = orders[orders.length - 1];

        // Similar, în mod normal am folosi o bibliotecă precum SheetJS
        // Dar pentru simplitate, simulăm descărcarea
        alert('Generarea XLS-ului este simulată. În aplicația reală, ar trebui folosită o bibliotecă precum SheetJS pentru generarea și descărcarea XLS-ului.');

        // Adaugă în istoric
        addToHistory(`A descărcat factura în format XLS pentru comanda #${latestOrder.id}`);
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
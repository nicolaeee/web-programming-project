// Funcționalitate pentru pdf-xls.js
document.addEventListener('DOMContentLoaded', function() {
    // Referințe la butoanele de descărcare după finalizarea comenzii
    const downloadPdfBtn = document.getElementById('downloadPdf');
    const downloadXlsBtn = document.getElementById('downloadXls');
    const downloadPdfConfirmationBtn = document.getElementById('downloadPdfConfirmation');
    const downloadXlsConfirmationBtn = document.getElementById('downloadXlsConfirmation');
    const checkoutButton = document.getElementById('checkoutButton');
    const placeOrderButton = document.getElementById('placeOrderButton');

    // Repară calculul sumei totale din coș
    function calculateCartTotal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;

        cart.forEach(item => {
            // Asigură-te că prețul și cantitatea sunt numere
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            total += price * quantity;
        });

        return total;
    }

    // Actualizează afișarea sumei totale
    function updateCartTotalDisplay() {
        const cartTotalElement = document.getElementById('cartTotal');
        if (cartTotalElement) {
            cartTotalElement.textContent = calculateCartTotal();
        }
    }

    // Funcția pentru a genera PDF
    function generatePDF() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            alert('Coșul tău este gol!');
            return;
        }

        // Creează un element temporar pentru conținutul PDF-ului
        const element = document.createElement('div');
        element.innerHTML = `
            <h2>Comanda dumneavoastră</h2>
            <p>Data: ${new Date().toLocaleDateString()}</p>
            <table style="width:100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border:1px solid #000; padding: 8px;">Titlu</th>
                        <th style="border:1px solid #000; padding: 8px;">Autor</th>
                        <th style="border:1px solid #000; padding: 8px;">Cantitate</th>
                        <th style="border:1px solid #000; padding: 8px;">Preț unitar</th>
                        <th style="border:1px solid #000; padding: 8px;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${cart.map(item => `
                        <tr>
                            <td style="border:1px solid #000; padding: 8px;">${item.title}</td>
                            <td style="border:1px solid #000; padding: 8px;">${item.author}</td>
                            <td style="border:1px solid #000; padding: 8px;">${item.quantity}</td>
                            <td style="border:1px solid #000; padding: 8px;">${item.price} RON</td>
                            <td style="border:1px solid #000; padding: 8px;">${(item.price * item.quantity).toFixed(2)} RON</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="border:1px solid #000; padding: 8px; text-align: right;"><strong>Total:</strong></td>
                        <td style="border:1px solid #000; padding: 8px;"><strong>${calculateCartTotal().toFixed(2)} RON</strong></td>
                    </tr>
                </tfoot>
            </table>
        `;

        // Folosim window.print() pentru o soluție simplă
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(`
            <html>
                <head>
                    <title>Comandă - Librărie</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #000; padding: 8px; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    ${element.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();

        // Delay necesar pentru a permite browserului să încarce conținutul
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }

    // Funcția pentru a genera XLS (va crea un CSV pe care browserul îl va descărca)
    function generateXLS() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            alert('Coșul tău este gol!');
            return;
        }

        // Creează header-ul CSV
        let csv = 'Titlu,Autor,Cantitate,Pret Unitar,Subtotal\n';

        // Adaugă fiecare item din coș
        cart.forEach(item => {
            const title = item.title.replace(/,/g, ' '); // Înlocuiește virgulele pentru a evita probleme cu CSV
            const author = item.author.replace(/,/g, ' ');
            const quantity = item.quantity;
            const price = item.price;
            const subtotal = price * quantity;

            csv += `"${title}","${author}",${quantity},${price},${subtotal.toFixed(2)}\n`;
        });

        // Adaugă totalul
        csv += `"TOTAL",,,,${calculateCartTotal().toFixed(2)}\n`;

        // Creează un blob și descarcă fișierul
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'comanda_librarie.csv');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Adaugă handlers pentru butoanele de descărcare
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', generatePDF);
    }

    if (downloadXlsBtn) {
        downloadXlsBtn.addEventListener('click', generateXLS);
    }

    if (downloadPdfConfirmationBtn) {
        downloadPdfConfirmationBtn.addEventListener('click', generatePDF);
    }

    if (downloadXlsConfirmationBtn) {
        downloadXlsConfirmationBtn.addEventListener('click', generateXLS);
    }

    // Handler pentru butonul de finalizare comandă - arată opțiunile de descărcare
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            // Afișează modalul de checkout
            const checkoutModal = document.getElementById('checkoutModal');
            if (checkoutModal) {
                checkoutModal.style.display = 'block';

                // Actualizează totalul comenzii
                const orderTotal = document.getElementById('orderTotal');
                if (orderTotal) {
                    orderTotal.textContent = calculateCartTotal().toFixed(2);
                }

                // Populează sumarul comenzii
                const orderSummary = document.getElementById('orderSummary');
                if (orderSummary) {
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];

                    if (cart.length === 0) {
                        orderSummary.innerHTML = '<p>Nu există produse în coș.</p>';
                    } else {
                        let summaryHTML = '<div class="order-items">';

                        cart.forEach(item => {
                            const subtotal = item.price * item.quantity;
                            summaryHTML += `
                                <div class="order-item">
                                    <div class="order-item-details">
                                        <h4>${item.title}</h4>
                                        <p>Autor: ${item.author}</p>
                                        <p>Preț: ${item.price} RON x ${item.quantity} = ${subtotal.toFixed(2)} RON</p>
                                    </div>
                                </div>
                            `;
                        });

                        summaryHTML += '</div>';
                        orderSummary.innerHTML = summaryHTML;
                    }
                }
            }

            // Adaugă în istoric
            if (typeof addToHistory === 'function') {
                addToHistory('A inițiat finalizarea comenzii');
            }
        });
    }

    // Handler pentru butonul de plasare comandă
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', function(e) {
            e.preventDefault();
            const form = document.getElementById('checkoutForm');

            if (form.checkValidity()) {
                // Ascunde modalul de checkout
                const checkoutModal = document.getElementById('checkoutModal');
                if (checkoutModal) {
                    checkoutModal.style.display = 'none';
                }

                // Generează un ID de comandă aleator
                const orderId = 'ORD-' + Math.floor(Math.random() * 100000);

                // Afișează modalul de confirmare
                const confirmationModal = document.getElementById('orderConfirmationModal');
                const orderNumberElement = document.getElementById('orderNumber');

                if (confirmationModal && orderNumberElement) {
                    orderNumberElement.textContent = orderId;
                    confirmationModal.style.display = 'block';
                }

                // Afișează opțiunile de descărcare
                const downloadOptions = document.querySelector('.download-options');
                if (downloadOptions) {
                    downloadOptions.style.display = 'block';
                }

                // Adaugă în istoric
                if (typeof addToHistory === 'function') {
                    addToHistory('A plasat comanda cu ID-ul ' + orderId);
                }
            } else {
                alert('Vă rugăm să completați toate câmpurile obligatorii.');
            }
        });
    }

    // Închiderea modalului de confirmare
    const closeConfirmation = document.querySelector('.close-modal-confirmation');
    if (closeConfirmation) {
        closeConfirmation.addEventListener('click', function() {
            const modal = document.getElementById('orderConfirmationModal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Butonul "Înapoi la cumpărături"
    const backToShopBtn = document.getElementById('backToShop');
    if (backToShopBtn) {
        backToShopBtn.addEventListener('click', function() {
            // Închide modalul de confirmare
            const modal = document.getElementById('orderConfirmationModal');
            if (modal) {
                modal.style.display = 'none';
            }

            // Golește coșul după comandă
            localStorage.setItem('cart', JSON.stringify([]));

            // Adaugă în istoric
            if (typeof addToHistory === 'function') {
                addToHistory('S-a întors la cumpărături după plasarea comenzii');
            }
        });
    }

    // Asigură-te că totalul din coș este calculat corect la încărcarea paginii
    updateCartTotalDisplay();
});
window.onload = async () => {
    const container = document.getElementById("ordersContainer");

    try {
        const response = await fetch("php/get-orders.php");
        const orders = await response.json();

        if (orders.length === 0) {
            container.innerHTML = "<p>Nu există comenzi.</p>";
            return;
        }

        orders.forEach(order => {
            const div = document.createElement("div");
            div.classList.add("order");

            const time = document.createElement("h3");
            time.textContent = `Comandă din: ${order.timestamp}`;
            div.appendChild(time);

            order.cart.forEach(book => {
                const p = document.createElement("p");
                p.textContent = `${book.titlu} - ${book.autor} (${book.pret} RON)`;
                div.appendChild(p);
            });

            container.appendChild(div);
        });
    } catch (err) {
        console.error("Eroare la preluarea comenzilor:", err);
    }
};

// Variabilă pentru a stoca acțiunile utilizatorului temporar
let userActions = [];

// Funcția pentru a înregistra o acțiune în istoricul utilizatorului
function logUserAction(action) {
    // Adaugă acțiunea în array-ul local
    userActions.push({
        action: action,
        timestamp: new Date()
    });

    // Trimite acțiunea la server pentru a fi salvată în baza de date
    saveActionToDatabase(action);

    // Actualizează lista de istoric dacă modalul este deschis
    if (document.getElementById('historyModal').style.display === 'block') {
        displayUserHistory();
    }
}

// Funcția pentru a salva acțiunea în baza de date
function saveActionToDatabase(action) {
    // Folosim fetch API pentru a trimite acțiunea la server
    fetch('php/save-user-history.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: action
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Acțiune salvată cu succes:', data);
    })
    .catch(error => {
        console.error('Eroare la salvarea acțiunii:', error);
    });
}

// Funcția pentru a afișa istoricul utilizatorului
function displayUserHistory() {
    // Obținem istoricul de la server
    fetch('php/get-user-history.php')
    .then(response => response.json())
    .then(data => {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = ''; // Curăță lista existentă

        // Adaugă fiecare acțiune în listă
        data.forEach(item => {
            const listItem = document.createElement('li');
            // Format: "Acțiune - Data și ora"
            const timestamp = new Date(item.timestamp);
            const formattedDate = `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`;
            listItem.textContent = `${item.action} - ${formattedDate}`;
            historyList.appendChild(listItem);
        });

        // Dacă nu există acțiuni
        if (data.length === 0) {
            const listItem = document.createElement('li');
            listItem.textContent = 'Nu există acțiuni în istoric.';
            historyList.appendChild(listItem);
        }
    })
    .catch(error => {
        console.error('Eroare la obținerea istoricului:', error);
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '<li>Eroare la încărcarea istoricului.</li>';
    });
}

// Adaugă event listener pentru butonul de istoric
document.addEventListener('DOMContentLoaded', function() {
    const historyButton = document.getElementById('openHistory');
    const historyModal = document.getElementById('historyModal');
    const closeButton = historyModal.querySelector('.close');

    // Deschide modalul când se apasă pe butonul de istoric
    historyButton.addEventListener('click', function(event) {
        event.preventDefault();
        historyModal.style.display = 'block';
        displayUserHistory(); // Încarcă istoricul când se deschide modalul
        logUserAction('A deschis istoricul');
    });

    // Închide modalul când se apasă pe X
    closeButton.addEventListener('click', function() {
        historyModal.style.display = 'none';
    });

    // Închide modalul când se apasă în afara lui
    window.addEventListener('click', function(event) {
        if (event.target === historyModal) {
            historyModal.style.display = 'none';
        }
    });

    // Înregistrează acțiunile principale ale utilizatorului
    // Adăugare carte în coș
    document.addEventListener('bookAddedToCart', function(e) {
        logUserAction(`A adăugat cartea "${e.detail.title}" în coș`);
    });

    // Finalizare comandă
    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            logUserAction('A finalizat o comandă');
        });
    }

    // Filtrare după gen
    const filterByGenreButton = document.getElementById('filterByGenre');
    if (filterByGenreButton) {
        filterByGenreButton.addEventListener('click', function() {
            const selectedGenre = document.getElementById('genreSelect').value;
            logUserAction(`A filtrat cărțile după genul: ${selectedGenre}`);
        });
    }

    // Filtrare după preț
    const filterByPriceButton = document.getElementById('filterByPrice');
    if (filterByPriceButton) {
        filterByPriceButton.addEventListener('click', function() {
            const minPrice = document.getElementById('minPrice').value;
            const maxPrice = document.getElementById('maxPrice').value;
            logUserAction(`A filtrat cărțile după preț între ${minPrice} și ${maxPrice} RON`);
        });
    }

    // Căutare cărți
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                logUserAction(`A căutat: "${this.value.trim()}"`);
            }
        });
    }
});
// Script pentru gestionarea istoricului utilizatorului
// Acest script se ocupă de salvarea și afișarea acțiunilor utilizatorului

document.addEventListener("DOMContentLoaded", function() {
    console.log("Script istoric utilizator încărcat");

    // Funcția pentru salvarea acțiunilor în baza de date
    window.addToHistory = function(action) {
        if (!action || typeof action !== 'string') {
            console.error("Acțiune invalidă pentru istoric:", action);
            return;
        }

        // Pregătește datele pentru trimitere
        const data = {
            action: action
        };

        // Efectuează cererea AJAX către backend
        fetch('php/save-user-history.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare de rețea sau server: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Acțiune salvată cu succes:', data);
        })
        .catch(error => {
            console.error('Eroare la salvarea acțiunii:', error);
        });
    };

    // Conectare cu funcția de logging existentă în cart-integration.js
    // Verificăm dacă funcția logUserAction este deja definită
    if (typeof window.logUserAction !== 'function') {
        window.logUserAction = function(action) {
            console.log("Acțiune utilizator:", action);
            // Salvează în istoric
            window.addToHistory(action);
        };
    } else {
        // Suprascriem funcția existentă pentru a adăuga și funcționalitatea de salvare
        const originalLogFunction = window.logUserAction;
        window.logUserAction = function(action) {
            // Apelăm funcția originală
            originalLogFunction(action);
            // Adăugăm și salvarea în istoric
            window.addToHistory(action);
        };
    }

    // Funcția pentru încărcarea istoricului utilizatorului
    function loadUserHistory() {
        // Obține referința la lista unde vom afișa istoricul
        const historyList = document.getElementById('historyList');

        if (!historyList) {
            console.error("Elementul historyList nu a fost găsit în DOM");
            return;
        }

        // Golește lista existentă
        historyList.innerHTML = '';

        // Adaugă un indicator de încărcare
        historyList.innerHTML = '<li>Se încarcă istoricul...</li>';

        // Efectuează cererea AJAX către backend
        fetch('php/get-user-history.php', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            // Verifică dacă răspunsul este ok (status 200-299)
            if (!response.ok) {
                throw new Error('Eroare de rețea sau server: ' + response.status);
            }

            // Verifică content type pentru a detecta răspunsurile HTML neașteptate
            const contentType = response.headers.get('content-type');
            if (contentType && !contentType.includes('application/json')) {
                throw new Error(`Răspuns neașteptat de la server: ${contentType}`);
            }

            return response.json().catch(error => {
                console.error("Eroare la parsarea JSON:", error);
                throw new Error("Răspunsul serverului nu este în format JSON valid");
            });
        })
        .then(data => {
            console.log("Date istoric primite:", data);

            // Golește lista de încărcare
            historyList.innerHTML = '';

            // Verifică dacă avem date
            if (!data || data.length === 0) {
                historyList.innerHTML = '<li>Nu există acțiuni în istoric.</li>';
                return;
            }

            // Parcurge datele și le adaugă în listă
            data.forEach(item => {
                const li = document.createElement('li');

                // Formatăm data pentru afișare dacă există timestamp
                let displayText = item.action || 'Acțiune necunoscută';

                if (item.timestamp) {
                    // Încercăm să formatăm data
                    try {
                        const date = new Date(item.timestamp);
                        if (!isNaN(date.getTime())) {
                            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                            displayText += ` - ${formattedDate}`;
                        } else {
                            displayText += ` - ${item.timestamp}`;
                        }
                    } catch (e) {
                        // În caz de eroare, afișăm timestamp-ul așa cum este
                        displayText += ` - ${item.timestamp}`;
                    }
                }

                li.textContent = displayText;
                historyList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Eroare la încărcarea istoricului:', error);
            historyList.innerHTML = '<li>Eroare la încărcarea istoricului. Încearcă din nou mai târziu.</li>';

            // Adaugă un buton de reîncercare
            const retryBtn = document.createElement('button');
            retryBtn.textContent = 'Reîncearcă';
            retryBtn.className = 'retry-button';
            retryBtn.addEventListener('click', function() {
                loadUserHistory();
            });

            const retryLi = document.createElement('li');
            retryLi.appendChild(retryBtn);
            historyList.appendChild(retryLi);
        });
    }

    // Event listener pentru deschiderea modalului de istoric
    const openHistoryButton = document.getElementById('openHistory');
    if (openHistoryButton) {
        openHistoryButton.addEventListener('click', function(e) {
            e.preventDefault();

            // Deschide modalul
            const historyModal = document.getElementById('historyModal');
            if (historyModal) {
                historyModal.style.display = 'block';

                // Salvează acțiunea și încarcă istoricul
                logUserAction('A deschis istoricul');
                loadUserHistory();
            } else {
                console.error("Modalul de istoric nu a fost găsit în DOM");
            }
        });
    } else {
        console.warn("Butonul de deschidere a istoricului nu a fost găsit în DOM");
    }

    // Event listener pentru închiderea modalului când se apasă pe X
    const closeHistoryButton = document.querySelector('#historyModal .close');
    if (closeHistoryButton) {
        closeHistoryButton.addEventListener('click', function() {
            const historyModal = document.getElementById('historyModal');
            if (historyModal) {
                historyModal.style.display = 'none';
            }
        });
    }

    // Event listener pentru închiderea modalului când se apasă în afara lui
    window.addEventListener('click', function(event) {
        const historyModal = document.getElementById('historyModal');
        if (historyModal && event.target == historyModal) {
            historyModal.style.display = 'none';
        }
    });

    // Înregistrarea automată a evenimentelor importante din aplicație
    function setupEventListeners() {
        // Înregistrează deschiderea modalului de gen
        const openGenreModalButton = document.getElementById('openGenreModal');
        if (openGenreModalButton) {
            openGenreModalButton.addEventListener('click', function() {
                logUserAction('A deschis modalul de filtrare după gen');
            });
        }

        // Înregistrează deschiderea modalului de preț
        const openPriceModalButton = document.getElementById('openPriceModal');
        if (openPriceModalButton) {
            openPriceModalButton.addEventListener('click', function() {
                logUserAction('A deschis modalul de filtrare după preț');
            });
        }

        // Înregistrează deschiderea modalului de filtrare avansată
        const openAdvancedFilterModalButton = document.getElementById('openAdvancedFilterModal');
        if (openAdvancedFilterModalButton) {
            openAdvancedFilterModalButton.addEventListener('click', function() {
                logUserAction('A deschis modalul de filtrare avansată');
            });
        }

        // Înregistrează filtrarea după gen
        const filterByGenreButton = document.getElementById('filterByGenre');
        if (filterByGenreButton) {
            filterByGenreButton.addEventListener('click', function() {
                const genreSelect = document.getElementById('genreSelect');
                if (genreSelect) {
                    const gen = genreSelect.value;
                    logUserAction(`A filtrat cărțile după genul: ${gen}`);
                }
            });
        }

        // Înregistrează filtrarea după preț
        const filterByPriceButton = document.getElementById('filterByPrice');
        if (filterByPriceButton) {
            filterByPriceButton.addEventListener('click', function() {
                const minPriceInput = document.getElementById('minPrice');
                const maxPriceInput = document.getElementById('maxPrice');

                const min = minPriceInput && minPriceInput.value ? minPriceInput.value : 'minim';
                const max = maxPriceInput && maxPriceInput.value ? maxPriceInput.value : 'maxim';

                logUserAction(`A filtrat cărțile după preț între ${min} și ${max} RON`);
            });
        }

        // Înregistrează acțiunea de căutare
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    logUserAction(`A căutat: "${this.value}"`);
                }
            });
        }

        // Înregistrează filtrarea avansată
        const applyAdvancedFilterButton = document.getElementById('applyAdvancedFilter');
        if (applyAdvancedFilterButton) {
            applyAdvancedFilterButton.addEventListener('click', function() {
                logUserAction('A aplicat filtre avansate');
            });
        }

        // Înregistrează finalizarea comenzii
        const placeOrderButton = document.getElementById('placeOrderButton');
        if (placeOrderButton) {
            placeOrderButton.addEventListener('click', function() {
                logUserAction('A finalizat o comandă');
            });
        }
    }

    // Rulăm setupEventListeners pentru a înregistra toate evenimentele
    setupEventListeners();

    // Înregistrăm acțiunea de accesare a paginii
    try {
        logUserAction('A accesat pagina cu cărți');
    } catch (error) {
        console.warn("Nu s-a putut înregistra acțiunea de accesare a paginii:", error);
    }

    console.log("Script istoric utilizator încărcat complet");
});
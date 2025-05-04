// Variabilă pentru stocarea cărților din baza de date
let books = [];

// Funcția de inițializare care va rula când documentul este încărcat
document.addEventListener('DOMContentLoaded', function() {
    // Încarcă datele despre cărți din baza de date
    loadBooksFromDatabase();

    // Inițializează funcționalitatea de filtrare avansată
    setupAdvancedFiltering();

    // Inițializează funcționalitatea de filtrare după gen
    setupGenreFiltering();

    // Inițializează funcționalitatea de filtrare după preț
    setupPriceFiltering();

    // Înregistrează această acțiune în istoricul utilizatorului
    if (typeof logUserAction === 'function') {
        logUserAction('A accesat pagina cu cărți');
    }
});

// Funcție pentru a încărca date despre cărți din baza de date
function loadBooksFromDatabase() {
    // Folosim AJAX pentru a comunica cu serverul și a obține datele din MySQL
    fetch('get_books.php')
        .then(response => response.json())
        .then(data => {
            books = data;
            console.log('Cărți încărcate din baza de date:', books);
        })
        .catch(error => {
            console.error('Eroare la încărcarea cărților:', error);
        });
}

// Funcția pentru a configura funcționalitatea de filtrare avansată
function setupAdvancedFiltering() {
    // Referințe la elementele DOM
    const openAdvancedFilterBtn = document.getElementById('openAdvancedFilterModal');
    const advancedFilterModal = document.getElementById('advancedFilterModal');
    const closeAdvancedFilterBtn = document.getElementById('closeAdvancedFilterModal');
    const applyFilterBtn = document.getElementById('applyAdvancedFilter');
    const resetFilterBtn = document.getElementById('resetAdvancedFilter');
    const filteredBooksContainer = document.getElementById('filteredBooksContainer');

    // Deschide modalul de filtrare avansată
    if (openAdvancedFilterBtn) {
        openAdvancedFilterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            advancedFilterModal.style.display = 'block';

            if (typeof logUserAction === 'function') {
                logUserAction('A deschis modalul de filtrare avansată');
            }
        });
    }

    // Închide modalul când se face click pe X
    if (closeAdvancedFilterBtn) {
        closeAdvancedFilterBtn.addEventListener('click', function() {
            advancedFilterModal.style.display = 'none';
        });
    }

    // Închide modalul când se face click în afara lui
    window.addEventListener('click', function(event) {
        if (event.target === advancedFilterModal) {
            advancedFilterModal.style.display = 'none';
        }
    });

    // Aplică filtrele când se apasă butonul
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            applyAdvancedFilters();
            advancedFilterModal.style.display = 'none';

            if (typeof logUserAction === 'function') {
                logUserAction('A aplicat filtre avansate');
            }
        });
    }

    // Resetează filtrele când se apasă butonul
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function() {
            resetAdvancedFilters();

            if (typeof logUserAction === 'function') {
                logUserAction('A resetat filtrele avansate');
            }
        });
    }

    // Adaugă butonul de închidere pentru rezultate
    if (filteredBooksContainer) {
        const closeButton = filteredBooksContainer.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                closeFilteredBooks();
            });
        }
    }
}

// Funcția pentru a aplica filtrele avansate
function applyAdvancedFilters() {
    // Obține valorile filtrelor
    const stockFilter = document.querySelector('input[name="stock"]:checked').value;
    const priceSortFilter = document.querySelector('input[name="priceSort"]:checked').value;
    const minPrice = document.getElementById('advMinPrice').value;
    const maxPrice = document.getElementById('advMaxPrice').value;
    const genreFilter = document.getElementById('advGenreSelect').value;
    const authorFilter = document.getElementById('authorFilter').value.trim().toLowerCase();
    const titleFilter = document.getElementById('titleFilter').value.trim().toLowerCase();

    // Filtrarea cărților
    let filteredBooks = [...books]; // Copiază toate cărțile

    // Filtrare după stoc
    if (stockFilter === 'in_stock') {
        filteredBooks = filteredBooks.filter(book => book.stoc > 0);
    } else if (stockFilter === 'out_of_stock') {
        filteredBooks = filteredBooks.filter(book => book.stoc === 0);
    }

    // Filtrare după preț minim
    if (minPrice) {
        filteredBooks = filteredBooks.filter(book => book.pret >= parseInt(minPrice));
    }

    // Filtrare după preț maxim
    if (maxPrice) {
        filteredBooks = filteredBooks.filter(book => book.pret <= parseInt(maxPrice));
    }

    // Filtrare după gen
    if (genreFilter) {
        filteredBooks = filteredBooks.filter(book => book.gen === genreFilter);
    }

    // Filtrare după autor
    if (authorFilter) {
        filteredBooks = filteredBooks.filter(book => book.autor.toLowerCase().includes(authorFilter));
    }

    // Filtrare după titlu
    if (titleFilter) {
        filteredBooks = filteredBooks.filter(book => book.titlu.toLowerCase().includes(titleFilter));
    }

    // Sortare după preț
    if (priceSortFilter === 'asc') {
        filteredBooks.sort((a, b) => a.pret - b.pret);
    } else if (priceSortFilter === 'desc') {
        filteredBooks.sort((a, b) => b.pret - a.pret);
    }

    // Afișează cărțile filtrate
    displayFilteredBooks(filteredBooks);
}

// Funcția pentru a reseta filtrele
function resetAdvancedFilters() {
    // Resetează toate input-urile
    document.querySelector('input[name="stock"][value="all"]').checked = true;
    document.querySelector('input[name="priceSort"][value="none"]').checked = true;
    document.getElementById('advMinPrice').value = '';
    document.getElementById('advMaxPrice').value = '';
    document.getElementById('advGenreSelect').value = '';
    document.getElementById('authorFilter').value = '';
    document.getElementById('titleFilter').value = '';
}

// Funcția pentru a afișa cărțile filtrate
function displayFilteredBooks(filteredBooks) {
    const container = document.getElementById('filteredBooksContainer');
    const content = document.getElementById('filteredBooksContent');

    if (!container || !content) return;

    // Construiește rezumatul filtrelor aplicate
    let filterSummary = [];

    const stockFilter = document.querySelector('input[name="stock"]:checked').value;
    if (stockFilter === 'in_stock') filterSummary.push('În stoc');
    if (stockFilter === 'out_of_stock') filterSummary.push('Indisponibile');

    const minPrice = document.getElementById('advMinPrice').value;
    const maxPrice = document.getElementById('advMaxPrice').value;
    if (minPrice || maxPrice) {
        let priceText = 'Preț: ';
        if (minPrice) priceText += `min ${minPrice} RON`;
        if (minPrice && maxPrice) priceText += ' - ';
        if (maxPrice) priceText += `max ${maxPrice} RON`;
        filterSummary.push(priceText);
    }

    const genreFilter = document.getElementById('advGenreSelect').value;
    if (genreFilter) filterSummary.push(`Gen: ${genreFilter}`);

    const authorFilter = document.getElementById('authorFilter').value.trim();
    if (authorFilter) filterSummary.push(`Autor: ${authorFilter}`);

    const titleFilter = document.getElementById('titleFilter').value.trim();
    if (titleFilter) filterSummary.push(`Titlu: ${titleFilter}`);

    const priceSortFilter = document.querySelector('input[name="priceSort"]:checked').value;
    if (priceSortFilter === 'asc') filterSummary.push('Sortare: Preț crescător');
    if (priceSortFilter === 'desc') filterSummary.push('Sortare: Preț descrescător');

    // Generează HTML pentru filtrele aplicate și cărțile găsite
    let html = '';

    // Adaugă informații despre filtrele aplicate
    if (filterSummary.length > 0) {
        html += '<div class="filter-info">';
        html += '<strong>Filtre aplicate:</strong> ' + filterSummary.join(' | ');
        html += '</div>';
    }

    if (filteredBooks.length === 0) {
        html += '<div class="no-results">';
        html += '<h3>Nu s-au găsit cărți care să corespundă filtrelor.</h3>';
        html += '<p>Încearcă să aplici filtre mai puțin restrictive.</p>';
        html += '</div>';
    } else {
        html += `<h2>S-au găsit ${filteredBooks.length} cărți</h2>`;
        html += '<div class="filtered-books-grid">';

        filteredBooks.forEach(book => {
            html += `<div class="filtered-book-item">
                <h3>${book.titlu}</h3>
                <p><strong>Autor:</strong> ${book.autor}</p>
                <p><strong>Preț:</strong> ${book.pret} RON</p>
                <p><strong>Gen:</strong> ${book.gen}</p>
                <p><strong>Stoc:</strong> ${book.stoc > 0 ? `${book.stoc} bucăți` : '<span style="color:red">Indisponibil</span>'}</p>
                <button class="add-to-cart-btn" data-id="${book.id}">Adaugă în coș</button>
            </div>`;
        });

        html += '</div>';
    }

    // Actualizează conținutul și afișează containerul
    content.innerHTML = html;
    container.style.display = 'block';

    // Adaugă event listeners pentru butoanele de adăugare în coș
    const addToCartButtons = content.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookId = this.getAttribute('data-id');
            const book = filteredBooks.find(b => b.id == bookId);

            if (book) {
                // Verifică dacă există o funcție pentru adăugare în coș
                if (typeof addToCart === 'function') {
                    addToCart(book);
                } else {
                    alert(`Cartea "${book.titlu}" a fost adăugată în coș.`);
                }

                // Înregistrează acțiunea
                if (typeof logUserAction === 'function') {
                    logUserAction(`A adăugat cartea "${book.titlu}" în coș din rezultatele filtrării`);
                }
            }
        });
    });
}

// Funcția pentru a închide containerul cu cărțile filtrate
function closeFilteredBooks() {
    const container = document.getElementById('filteredBooksContainer');
    if (container) {
        container.style.display = 'none';
    }
}

// Funcția pentru a configura filtrarea după gen
function setupGenreFiltering() {
    const openGenreModalBtn = document.getElementById('openGenreModal');
    const genreModal = document.getElementById('genreModal');
    const closeGenreModalBtn = document.getElementById('closeGenreModal');
    const filterByGenreBtn = document.getElementById('filterByGenre');

    // Deschide modalul de filtrare după gen
    if (openGenreModalBtn) {
        openGenreModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            genreModal.style.display = 'block';

            if (typeof logUserAction === 'function') {
                logUserAction('A deschis modalul de filtrare după gen');
            }
        });
    }

    // Închide modalul când se face click pe X
    if (closeGenreModalBtn) {
        closeGenreModalBtn.addEventListener('click', function() {
            genreModal.style.display = 'none';
        });
    }

    // Închide modalul când se face click în afara lui
    window.addEventListener('click', function(event) {
        if (event.target === genreModal) {
            genreModal.style.display = 'none';
        }
    });

    // Aplică filtrul după gen când se apasă butonul
    if (filterByGenreBtn) {
        filterByGenreBtn.addEventListener('click', function() {
            const selectedGenre = document.getElementById('genreSelect').value;
            filterBooksByGenre(selectedGenre);
            genreModal.style.display = 'none';

            if (typeof logUserAction === 'function') {
                logUserAction(`A filtrat cărțile după genul: ${selectedGenre}`);
            }
        });
    }
}

// Funcția pentru a filtra cărțile după gen
function filterBooksByGenre(genre) {
    if (!genre) return;

    const filteredBooks = books.filter(book => book.gen === genre);
    displayFilteredBooks(filteredBooks);
}

// Funcția pentru a configura filtrarea după preț
function setupPriceFiltering() {
    const openPriceModalBtn = document.getElementById('openPriceModal');
    const priceModal = document.getElementById('priceModal');
    const closePriceModalBtn = document.getElementById('closePriceModal');
    const filterByPriceBtn = document.getElementById('filterByPrice');

    // Deschide modalul de filtrare după preț
    if (openPriceModalBtn) {
        openPriceModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            priceModal.style.display = 'block';

            if (typeof logUserAction === 'function') {
                logUserAction('A deschis modalul de filtrare după preț');
            }
        });
    }

    // Închide modalul când se face click pe X
    if (closePriceModalBtn) {
        closePriceModalBtn.addEventListener('click', function() {
            priceModal.style.display = 'none';
        });
    }

    // Închide modalul când se face click în afara lui
    window.addEventListener('click', function(event) {
        if (event.target === priceModal) {
            priceModal.style.display = 'none';
        }
    });

    // Aplică filtrul după preț când se apasă butonul
    if (filterByPriceBtn) {
        filterByPriceBtn.addEventListener('click', function() {
            const minPrice = document.getElementById('minPrice').value;
            const maxPrice = document.getElementById('maxPrice').value;
            filterBooksByPrice(minPrice, maxPrice);
            priceModal.style.display = 'none';

            if (typeof logUserAction === 'function') {
                logUserAction(`A filtrat cărțile după preț: min=${minPrice || 'neconfigurat'}, max=${maxPrice || 'neconfigurat'}`);
            }
        });
    }
}

// Funcția pentru a filtra cărțile după preț
function filterBooksByPrice(minPrice, maxPrice) {
    let filteredBooks = [...books];

    if (minPrice) {
        filteredBooks = filteredBooks.filter(book => book.pret >= parseInt(minPrice));
    }

    if (maxPrice) {
        filteredBooks = filteredBooks.filter(book => book.pret <= parseInt(maxPrice));
    }

    displayFilteredBooks(filteredBooks);
}
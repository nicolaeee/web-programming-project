<?php
// Conectare la baza de date
$conn = new mysqli("127.0.0.1", "username", "password", "librarie");
if ($conn->connect_error) {
    die(json_encode(['error' => 'Conexiune eșuată: ' . $conn->connect_error]));
}

// Setează charset-ul pentru caractere românești
$conn->set_charset("utf8");

// Preia parametrii de filtrare
$stockFilter = isset($_GET['stock']) ? $_GET['stock'] : 'all';
$minPrice = isset($_GET['minPrice']) ? (int)$_GET['minPrice'] : null;
$maxPrice = isset($_GET['maxPrice']) ? (int)$_GET['maxPrice'] : null;
$genre = isset($_GET['genre']) ? $_GET['genre'] : '';
$author = isset($_GET['author']) ? $_GET['author'] : '';
$title = isset($_GET['title']) ? $_GET['title'] : '';
$priceSort = isset($_GET['priceSort']) ? $_GET['priceSort'] : 'none';

// Construiește interogarea SQL
$query = "SELECT * FROM carti WHERE 1=1";

// Adaugă condițiile de filtrare
if ($stockFilter == 'in_stock') {
    $query .= " AND stoc > 0";
} else if ($stockFilter == 'out_of_stock') {
    $query .= " AND stoc = 0";
}

if ($minPrice !== null) {
    $query .= " AND pret >= $minPrice";
}

if ($maxPrice !== null) {
    $query .= " AND pret <= $maxPrice";
}

if (!empty($genre)) {
    $query .= " AND gen = '" . $conn->real_escape_string($genre) . "'";
}

if (!empty($author)) {
    $query .= " AND autor LIKE '%" . $conn->real_escape_string($author) . "%'";
}

if (!empty($title)) {
    $query .= " AND titlu LIKE '%" . $conn->real_escape_string($title) . "%'";
}

// Adaugă ordinea de sortare
if ($priceSort == 'asc') {
    $query .= " ORDER BY pret ASC";
} else if ($priceSort == 'desc') {
    $query .= " ORDER BY pret DESC";
}

// Execută interogarea
$result = $conn->query($query);

$books = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $books[] = $row;
    }
}

// Închide conexiunea
$conn->close();

// Returnează rezultatele în format JSON
header('Content-Type: application/json');
echo json_encode($books);
?>
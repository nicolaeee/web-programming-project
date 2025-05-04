<?php
// Conectare la baza de date
$conn = new mysqli("127.0.0.1", "username", "password", "librarie");
if ($conn->connect_error) {
    die(json_encode(['error' => 'Conexiune eșuată: ' . $conn->connect_error]));
}

// Setează charset-ul pentru caractere românești
$conn->set_charset("utf8");

// Preia ID-ul cărții
$bookId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($bookId <= 0) {
    die(json_encode(['error' => 'ID carte invalid']));
}

// Obține detaliile cărții
$query = "SELECT * FROM carti WHERE id = $bookId";
$result = $conn->query($query);

if ($result->num_rows == 1) {
    $book = $result->fetch_assoc();

    // Închide conexiunea
    $conn->close();

    // Returnează rezultatele în format JSON
    header('Content-Type: application/json');
    echo json_encode($book);
} else {
    // Închide conexiunea
    $conn->close();

    // Returnează eroare
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Cartea nu a fost găsită']);
}
?>
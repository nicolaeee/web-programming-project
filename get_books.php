<?php
// Parametri de conectare la baza de date
$servername = "localhost";
$username = "root"; // Schimbați dacă aveți alt utilizator
$password = ""; // Completați parola dacă aveți una
$dbname = "librarie";

// Creează conexiunea
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifică conexiunea
if ($conn->connect_error) {
    die("Conexiunea a eșuat: " . $conn->connect_error);
}

// Setează caracterele UTF-8
$conn->set_charset("utf8");

// Interogare pentru a obține toate cărțile
$sql = "SELECT id, titlu, autor, pret, gen, stoc, an FROM carti";
$result = $conn->query($sql);

$books = array();

if ($result->num_rows > 0) {
    // Obține datele fiecărei cărți
    while($row = $result->fetch_assoc()) {
        $books[] = $row;
    }
}

// Închide conexiunea
$conn->close();

// Setează header-ul pentru JSON
header('Content-Type: application/json');

// Returnează rezultatul ca JSON
echo json_encode($books);
?>
<?php
// Setări pentru a trimite date JSON
header('Content-Type: application/json');

// Permitere acces CORS dacă e necesar
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Conectare la baza de date
$servername = "127.0.0.1"; // IP-ul serverului din captură
$username = "root"; // Utilizator implicit
$password = ""; // Parola
$dbname = "librarie"; // Numele bazei de date din captură

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // Setează modul de eroare PDO la excepție
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Execută interogarea SQL pentru a obține istoricul
    // Ordonăm după timestamp descrescător pentru a avea cele mai recente acțiuni primele
    $stmt = $conn->prepare("SELECT id, action, timestamp FROM user_history ORDER BY timestamp DESC");
    $stmt->execute();

    // Configurează rezultatul ca array asociativ
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Returnează datele ca JSON
    echo json_encode($result);
} catch(PDOException $e) {
    // Returnează eroarea ca JSON valid
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Eroare la conectare: ' . $e->getMessage()
    ]);
}

// Închide conexiunea
$conn = null;
?>
<?php
// Setări pentru a primi și trimite date JSON
header('Content-Type: application/json');

// Permitere acces CORS dacă e necesar
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Verifică dacă cererea este de tip POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obține conținutul JSON din cerere
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Verifică dacă există acțiunea
    if (isset($data['action'])) {
        // Conectare la baza de date
        $servername = "127.0.0.1"; // IP-ul serverului din captură
        $username = "root"; // Utilizator implicit (de înlocuit cu utilizatorul real)
        $password = ""; // Parola (de înlocuit cu parola reală)
        $dbname = "librarie"; // Numele bazei de date din captură

        try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            // Setează modul de eroare PDO la excepție
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Pregătește și execută interogarea SQL pentru inserare
            // Folosim prepared statements pentru siguranță
            $stmt = $conn->prepare("INSERT INTO user_history (action) VALUES (:action)");
            $stmt->bindParam(':action', $data['action']);
            $stmt->execute();

            // Returnează un mesaj de succes
            echo json_encode([
                'status' => 'success',
                'message' => 'Acțiune salvată cu succes'
            ]);
        } catch(PDOException $e) {
            // Returnează eroarea
            echo json_encode([
                'status' => 'error',
                'message' => 'Eroare la conectare: ' . $e->getMessage()
            ]);
        }

        // Închide conexiunea
        $conn = null;
    } else {
        // Returnează eroare dacă acțiunea lipsește
        echo json_encode([
            'status' => 'error',
            'message' => 'Acțiunea lipsește'
        ]);
    }
} else {
    // Returnează eroare pentru metode care nu sunt POST
    echo json_encode([
        'status' => 'error',
        'message' => 'Metoda HTTP nepermisă'
    ]);
}
?>
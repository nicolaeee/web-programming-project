// Conectare la baza de date
$servername = "127.0.0.1"; // IP-ul serverului din captură
$username = "root"; // Utilizator implicit
$password = ""; // Parola
$dbname = "librarie"; // Numele bazei de date din captură

// Obține datele trimise prin POST
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

// Verifică dacă avem date valide
if (!isset($input['action']) || empty($input['action'])) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Câmpul "action" este obligatoriu'
    ]);
    exit;
}

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // Setează modul de eroare PDO la excepție
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Pregătește și execută interogarea SQL pentru a salva acțiunea
    $stmt = $conn->prepare("INSERT INTO user_history (action) VALUES (:action)");
    $stmt->bindParam(':action', $input['action']);
    $stmt->execute();

    // Obține ID-ul ultimei inserări
    $lastId = $conn->lastInsertId();

    // Returnează răspunsul de succes
    echo json_encode([
        'status' => 'success',
        'message' => 'Acțiune salvată cu succes',
        'id' => $lastId
    ]);
} catch(PDOException $e) {
    // Returnează eroarea ca JSON valid
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Eroare la salvarea acțiunii: ' . $e->getMessage()
    ]);
}

// Închide conexiunea
$conn = null;
?>
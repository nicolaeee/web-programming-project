<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "librarie";

// Conectare la baza de date
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Conexiune eșuată: " . $conn->connect_error);
}

// Preluăm keyword din URL (GET)
$keyword = $_GET['keyword'] ?? '';

// Căutare în titlu sau autor
$sql = "SELECT * FROM carti WHERE titlu LIKE ? OR autor LIKE ?";
$stmt = $conn->prepare($sql);
$like = "%" . $keyword . "%";
$stmt->bind_param("ss", $like, $like);
$stmt->execute();

$result = $stmt->get_result();

$books = [];
while ($row = $result->fetch_assoc()) {
    $books[] = $row;
}

// Returnăm rezultatul ca JSON
header('Content-Type: application/json');
echo json_encode($books);

$conn->close();
?>

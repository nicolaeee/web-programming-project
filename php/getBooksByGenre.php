<?php
header('Content-Type: application/json');

$gen = $_GET['gen'] ?? '';
$conn = new mysqli("localhost", "root", "", "librarie");

if ($conn->connect_error) {
    die(json_encode(['error' => 'Eroare la conectare DB']));
}

$stmt = $conn->prepare("SELECT * FROM carti WHERE gen = ?");
$stmt->bind_param("s", $gen);
$stmt->execute();

$result = $stmt->get_result();
$books = [];

while ($row = $result->fetch_assoc()) {
    $books[] = $row;
}

echo json_encode($books);

$stmt->close();
$conn->close();
?>

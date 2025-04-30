<?php
// php/save-order.php
$data = json_decode(file_get_contents('php://input'), true);
$filePath = '../data/comenzi.json';

if (!file_exists($filePath)) {
    file_put_contents($filePath, '[]');
}

$existingOrders = json_decode(file_get_contents($filePath), true);
$existingOrders[] = $data;

file_put_contents($filePath, json_encode($existingOrders, JSON_PRETTY_PRINT));

echo json_encode(["success" => true]);
?>

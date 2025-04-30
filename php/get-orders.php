<?php
// php/get-orders.php
header('Content-Type: application/json');
$filePath = '../data/comenzi.json';

if (file_exists($filePath)) {
    echo file_get_contents($filePath);
} else {
    echo json_encode([]);
}
?>

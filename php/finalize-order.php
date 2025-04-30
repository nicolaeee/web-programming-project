<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jsonData = file_get_contents('php://input');
    $cart = json_decode($jsonData, true);

    if (!$cart) {
        http_response_code(400);
        echo "Date invalide";
        exit;
    }

    // Salvăm în comenzi.json
    $file = '../data/comenzi.json';
    $existing = [];

    if (file_exists($file)) {
        $existing = json_decode(file_get_contents($file), true);
    }

    $existing[] = [
        'timestamp' => date('Y-m-d H:i:s'),
        'cart' => $cart
    ];

    file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT));
    echo "Comanda salvată";
}
?>

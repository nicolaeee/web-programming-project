<?php
$file = '../data/comenzi.json';
if (file_exists($file)) {
    $json = file_get_contents($file);
    echo $json;
} else {
    echo "[]";
}
?>

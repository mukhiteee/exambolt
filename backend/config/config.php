<?php

$host = "localhost";
$db_name = "exambolt";
$username = "root";
$password = ""; // keep empty for XAMPP local

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db_name;charset=utf8mb4",
        $username,
        $password
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    die("DB Error: " . $e->getMessage());
}

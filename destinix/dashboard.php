<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");


$servername = "localhost";
$username = "root";  // Usa tu propio nombre de usuario
$password = "";  // Usa tu propia contraseña
$dbname = "destinix";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $response = [];
    
    $stmt = $pdo->prepare("SELECT * FROM seguridad");
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response['status'] = 'success';
    $response['data'] = $data;
    
    echo json_encode($response);
} catch (PDOException $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
    echo json_encode($response);
}
?>

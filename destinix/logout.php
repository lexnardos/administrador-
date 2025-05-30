<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

session_start();


$_SESSION = array();

// Destruir la sesión
session_destroy();

// Devolver respuesta JSON
echo json_encode(["success" => true, "message" => "Sesión cerrada correctamente."]);
?>

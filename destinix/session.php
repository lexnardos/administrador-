<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
session_start();

if (isset($_SESSION['id_persona'])) {
    echo json_encode([
        'loggedIn' => true,
        'id_persona' => $_SESSION['id_persona'],
        'rol_idRol' => $_SESSION['rol_idRol'] ?? null  // <- Aquí enviamos el rol también
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>

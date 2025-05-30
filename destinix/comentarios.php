<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");

$mysqli = new mysqli("localhost", "root", "", "destinix");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]);
    exit();
}

// GET: obtener comentarios por id_hoteles
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['id_hoteles'])) {
        echo json_encode(["success" => false, "message" => "Falta el parámetro id_hoteles."]);
        exit();
    }

    $id_hoteles = intval($_GET['id_hoteles']);

    $stmt = $mysqli->prepare("
        SELECT contenido, id_calificacion 
        FROM comentarios 
        WHERE id_hoteles = ?
    ");
    $stmt->bind_param("i", $id_hoteles);
    $stmt->execute();
    $result = $stmt->get_result();

    $comentarios = [];
    while ($row = $result->fetch_assoc()) {
        $comentarios[] = $row;
    }

    echo json_encode(["success" => true, "data" => $comentarios]);
    $stmt->close();
    $mysqli->close();
    exit();
}

// POST: agregar nuevo comentario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        echo json_encode(["success" => false, "message" => "No se recibieron datos válidos."]);
        exit();
    }

    $contenido = $input['contenido'] ?? '';
    $id_calificacion = $input['id_calificacion'] ?? null;
    $persona_id_persona = $_SESSION['id_persona'] ?? null;
    $id_hoteles = $input['id_hoteles'] ?? null;

    if (!$contenido || !$id_calificacion || !$persona_id_persona || !$id_hoteles) {
        echo json_encode(["success" => false, "message" => "Faltan campos obligatorios o no has iniciado sesión."]);
        exit();
    }

    $stmt = $mysqli->prepare(
        "INSERT INTO comentarios (contenido, id_calificacion, persona_id_persona, id_hoteles) 
         VALUES (?, ?, ?, ?)"
    );
    $stmt->bind_param("siii", $contenido, $id_calificacion, $persona_id_persona, $id_hoteles);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Comentario guardado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar el comentario."]);
    }

    $stmt->close();
    $mysqli->close();
    exit();
}

echo json_encode(["success" => false, "message" => "Método HTTP no soportado."]);

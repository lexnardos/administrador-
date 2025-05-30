<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");

$mysqli = new mysqli("localhost", "root", "", "destinix");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]);
    exit();
}

// Manejo de preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// GET: Obtener todos los comentarios o por id_hoteles (opcional)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id_hoteles'])) {
        $id_hoteles = intval($_GET['id_hoteles']);
        $stmt = $mysqli->prepare("SELECT * FROM comentarios WHERE id_hoteles = ?");
        $stmt->bind_param("i", $id_hoteles);
    } else {
        $stmt = $mysqli->prepare("SELECT * FROM comentarios");
    }

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

// POST: Agregar nuevo comentario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    $contenido = $input['contenido'] ?? '';
    $id_calificacion = $input['id_calificacion'] ?? null;
    $persona_id_persona = $input['persona_id_persona'] ?? null;
    $id_hoteles = $input['id_hoteles'] ?? null;

    if (!$contenido || !$id_calificacion || !$persona_id_persona || !$id_hoteles) {
        echo json_encode(["success" => false, "message" => "Faltan campos obligatorios."]);
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

// PUT: Editar comentario
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents("php://input"), true);

    $id_comentario = $input['id_comentario'] ?? null;
    $contenido = $input['contenido'] ?? null;

    if (!$id_comentario || !$contenido) {
        echo json_encode(["success" => false, "message" => "Faltan datos para actualizar el comentario."]);
        exit();
    }

    $stmt = $mysqli->prepare("UPDATE comentarios SET contenido = ? WHERE id_comentario = ?");
    $stmt->bind_param("si", $contenido, $id_comentario);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Comentario actualizado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar el comentario."]);
    }

    $stmt->close();
    $mysqli->close();
    exit();
}

// DELETE: Eliminar comentario
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $input);

    $id_comentario = $input['id_comentario'] ?? null;

    if (!$id_comentario) {
        echo json_encode(["success" => false, "message" => "Falta el parámetro id_comentario."]);
        exit();
    }

    $stmt = $mysqli->prepare("DELETE FROM comentarios WHERE id_comentario = ?");
    $stmt->bind_param("i", $id_comentario);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Comentario eliminado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar el comentario."]);
    }

    $stmt->close();
    $mysqli->close();
    exit();
}

// Método no permitido
http_response_code(405);
echo json_encode(["success" => false, "message" => "Método HTTP no soportado."]);
?>

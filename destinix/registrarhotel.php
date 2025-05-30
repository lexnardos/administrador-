<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Conexión
$conexion = new mysqli("localhost", "root", "", "destinix");
if ($conexion->connect_error) {
    echo json_encode(["error" => "Conexión fallida: " . $conexion->connect_error]);
    exit;
}

// Verifica sesión
if (!isset($_SESSION['id_persona'])) {
    echo json_encode(["error" => "Sesión no válida"]);
    exit;
}

// Obtener empresa del anunciante
$id_persona = $_SESSION['id_persona'];
$empresaQuery = $conexion->query("SELECT id_empresa FROM empresa WHERE persona_id_persona = '$id_persona'");
$empresa = $empresaQuery->fetch_assoc();

if (!$empresa) {
    echo json_encode(["error" => "Empresa no encontrada para esta persona"]);
    exit;
}

$id_empresa = $empresa['id_empresa'];

// Obtener datos del formulario
$titulo = $_POST['titulo_hotel'] ?? '';
$descripcion = $_POST['descripcion_hotel'] ?? '';
$imgFileName = null;

// Validación de imagen
if (!isset($_FILES['img']) || $_FILES['img']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["error" => "Error al subir imagen"]);
    exit;
}

$uploadDir = __DIR__ . '/imagenes/'; // asegúrate que esta ruta existe
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true); // crea carpeta si no existe
}

$imgFileName = uniqid() . '_' . basename($_FILES['img']['name']);
$uploadPath = $uploadDir . $imgFileName;

if (!move_uploaded_file($_FILES['img']['tmp_name'], $uploadPath)) {
    echo json_encode(["error" => "No se pudo mover el archivo al destino"]);
    exit;
}

// Insertar hotel
$sql = "INSERT INTO hoteles (titulo_hotel, img, descripcion_hotel, estado_id_estado, empresa_id_empresa)
        VALUES (?, ?, ?, 0, ?)";

$stmt = $conexion->prepare($sql);
if (!$stmt) {
    echo json_encode(["error" => "Fallo en prepare: " . $conexion->error]);
    exit;
}

$stmt->bind_param("sssi", $titulo, $imgFileName, $descripcion, $id_empresa);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Error al registrar el hotel: " . $stmt->error]);
}
?>

<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'destinix';
$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

require_once 'ReservaModel.php';
$model = new ReservaModel($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $model->getReservas();
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        break;

    case 'POST':
        $fecha_reserva = $_POST['fecha_reserva'] ?? null;
        $fecha_visita = $_POST['fecha_visita'] ?? null;
        $cantidad_personas = $_POST['cantidad_personas'] ?? null;
        $restaurante_id = $_POST['restaurante_id'] ?? null;
        $sitio_id = $_POST['sitio_id'] ?? null;
        $hotel_id = $_POST['hotel_id'] ?? null;
        $estado_id = $_POST['estado_id'] ?? null;
        $empresa_id = $_POST['empresa_id'] ?? null;
        $id_itinerario = $_POST['id_itinerario'] ?? null;

        if ($fecha_reserva && $fecha_visita && $cantidad_personas !== null && $restaurante_id && $sitio_id && $hotel_id && $estado_id && $empresa_id && $id_itinerario) {
            $result = $model->insertReserva($fecha_reserva, $fecha_visita, $cantidad_personas, $restaurante_id, $sitio_id, $hotel_id, $estado_id, $empresa_id, $id_itinerario);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "Datos incompletos"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);

        $id = $data['id_reserva'] ?? null;
        $fecha_reserva = $data['fecha_reserva'] ?? null;
        $fecha_visita = $data['fecha_visita'] ?? null;
        $cantidad_personas = $data['cantidad_personas'] ?? null;
        $restaurante_id = $data['restaurante_id'] ?? null;
        $sitio_id = $data['sitio_id'] ?? null;
        $hotel_id = $data['hotel_id'] ?? null;
        $estado_id = $data['estado_id'] ?? null;
        $empresa_id = $data['empresa_id'] ?? null;
        $id_itinerario = $data['id_itinerario'] ?? null;

        if ($id && $fecha_reserva && $fecha_visita && $cantidad_personas !== null && $restaurante_id && $sitio_id && $hotel_id && $estado_id && $empresa_id && $id_itinerario) {
            $result = $model->updateReserva($id, $fecha_reserva, $fecha_visita, $cantidad_personas, $restaurante_id, $sitio_id, $hotel_id, $estado_id, $empresa_id, $id_itinerario);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "Datos incompletos"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($id !== null) {
            $result = $model->deleteReserva($id);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "ID no proporcionado"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}

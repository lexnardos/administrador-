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

require_once 'CalificacionModel.php';
$model = new CalificacionModel($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $model->getCalificaciones();
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        break;

    case 'POST':
        $puntuacion = $_POST['puntuacion'] ?? null;

        if ($puntuacion !== null) {
            $result = $model->insertCalificacion($puntuacion);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "Puntuación no proporcionada"]);
        }
        break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id_calificacion'] ?? null;
            $puntuacion = $data['puntuacion'] ?? null;
        
            if ($id && $puntuacion !== null) {
                $result = $model->updateCalificacion($id, $puntuacion);
                echo json_encode(["success" => $result]);
            } else {
                echo json_encode(["error" => "Datos incompletos"]);
            }
            break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($id !== null) {
            $result = $model->deleteCalificacion($id);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "ID no proporcionado"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}

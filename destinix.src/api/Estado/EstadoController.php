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
    http_response_code(500);
    echo json_encode(["error" => "Conexión fallida: " . $conn->connect_error]);
    exit();
}

require_once 'EstadoModel.php';
$model = new EstadoModel($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $model->getEstados();
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        break;

    case 'POST':
        $desc_estado = trim($_POST['desc_estado'] ?? '');

        if (!empty($desc_estado)) {
            $result = $model->insertEstado($desc_estado);
            echo json_encode(["success" => $result]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Descripción no proporcionada o vacía"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id_estado'] ?? null;
        $desc_estado = trim($data['desc_estado'] ?? '');

        if ($id && !empty($desc_estado)) {
            $result = $model->updateEstado($id, $desc_estado);
            echo json_encode(["success" => $result]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Datos incompletos o inválidos"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($id !== null) {
            $result = $model->deleteEstado($id);
            echo json_encode(["success" => $result]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "ID no proporcionado"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}

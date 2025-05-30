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

require_once 'RolModel.php';
$model = new RolModel($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $model->getRoles();
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        break;

    case 'POST':
        $tipo_rol = $_POST['Tipo_Rol'] ?? null;

        if ($tipo_rol !== null) {
            $result = $model->insertRol($tipo_rol);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "Tipo de rol no proporcionado"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['idRol'] ?? null;
        $tipo_rol = $data['Tipo_Rol'] ?? null;

        if ($id && $tipo_rol !== null) {
            $result = $model->updateRol($id, $tipo_rol);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "Datos incompletos"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($id !== null) {
            $result = $model->deleteRol($id);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "ID no proporcionado"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}
 
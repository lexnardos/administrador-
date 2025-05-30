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

require_once 'SeguridadModel.php';
$model = new SeguridadModel($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $model->getSeguridad();
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        break;

    case 'POST':
        $email_usu = $_POST['email_usu'] ?? null;
        $contra_usu = $_POST['contra_usu'] ?? null;

        if ($email_usu && $contra_usu !== null) {
            $result = $model->insertSeguridad($email_usu, $contra_usu);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "Email o contraseña no proporcionados"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id_seguridad'] ?? null;
        $email_usu = $data['email_usu'] ?? null;
        $contra_usu = $data['contra_usu'] ?? null;

        if ($id && $email_usu && $contra_usu !== null) {
            $result = $model->updateSeguridad($id, $email_usu, $contra_usu);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "Datos incompletos"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($id !== null) {
            $result = $model->deleteSeguridad($id);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "ID no proporcionado"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}

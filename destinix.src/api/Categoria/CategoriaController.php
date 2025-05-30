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

require_once 'CategoriaModel.php';
$model = new CategoriaModel($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $model->getCategorias();
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        break;

    case 'POST':
        $nombre = $_POST['nombre_cate'] ?? null;
        $descripcion = $_POST['desc_cate'] ?? null;

        if (isset($_GET['editar']) && $_GET['editar'] == 1) {
            $id = $_POST['id_categoria'] ?? null;

            if ($id && $nombre && $descripcion) {
                $result = $model->updateCategoria($id, $nombre, $descripcion);
                echo json_encode(["success" => $result, "mensaje" => "Categoría actualizada"]);
            } else {
                echo json_encode(["error" => "Datos incompletos para actualizar"]);
            }
        } else {
            if ($nombre && $descripcion) {
                $result = $model->insertCategoria($nombre, $descripcion);
                echo json_encode(["success" => $result, "mensaje" => "Categoría creada"]);
            } else {
                echo json_encode(["error" => "Datos incompletos para crear"]);
            }
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id_categoria'] ?? null;
        $nombre = $data['nombre_cate'] ?? null;
        $descripcion = $data['desc_cate'] ?? null;

        if ($id && $nombre && $descripcion) {
            $result = $model->updateCategoria($id, $nombre, $descripcion);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "Datos incompletos"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($id !== null) {
            $result = $model->deleteCategoria($id);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "ID no proporcionado"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}

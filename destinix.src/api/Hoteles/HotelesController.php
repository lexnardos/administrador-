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


require_once 'HotelesModel.php';
$model = new HotelesModel($conn);


$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $model->getHoteles();
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        break;

    case 'POST':
        $idHotel = $_POST['id_hoteles'] ?? null;
        $titulo = $_POST['titulo_hotel'] ?? '';
        $descripcion = $_POST['descripcion_hotel'] ?? '';
        $estadoId = $_POST['estado_id_estado'] ?? null;
        $empresaId = $_POST['empresa_id_empresa'] ?? null;
        $img = '';

        if (isset($_FILES['img'])) {
            $imagen = basename($_FILES['img']['name']);
            $ruta_temporal = $_FILES['img']['tmp_name'];
            $ruta_destino = '../uploads/' . $imagen;

            if (move_uploaded_file($ruta_temporal, $ruta_destino)) {
                $img = $imagen;
            }
        }

        if ($idHotel) {
   
            $result = $model->updateHotel($idHotel, $titulo, $img, $descripcion, $estadoId, $empresaId);
            echo json_encode(["success" => $result, "action" => "update"]);
        } else {
     
            $result = $model->insertHotel($titulo, $img, $descripcion, $estadoId, $empresaId);
            echo json_encode(["success" => $result, "action" => "insert"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($id !== null) {
            $result = $model->deleteHotel($id);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "ID no proporcionado"]);
        }
        break;

    default:
        echo json_encode(["error" => "Método no permitido"]);
}
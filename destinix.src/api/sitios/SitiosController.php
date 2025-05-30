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


require_once 'sitiosModel.php';
$model = new SitiosModel($conn);


$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        $result = $model->getSitios();
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        break;

    case 'POST':
        $idSitio = $_POST['id_sitio'] ?? null;
        $nombre = $_POST['nombre_sitio'] ?? '';
        $ubicacion = $_POST['ubicacion_sitio'] ?? '';
        $desc = $_POST['desc_sitio'] ?? '';
        $personaId = $_POST['persona_id_persona'] ?? null;
        $estadoId = $_POST['estado_id_estado'] ?? null;
        $img = '';

   
        if (isset($_FILES['img_sitio'])) {
            $imagen = basename($_FILES['img_sitio']['name']);
            $ruta_temporal = $_FILES['img_sitio']['tmp_name'];
            $ruta_destino = '../uploads/' . $imagen;

            if (move_uploaded_file($ruta_temporal, $ruta_destino)) {
                $img = $imagen;
            }
        }

        if ($idSitio) {
            $result = $model->updateSitio($idSitio, $nombre, $img, $ubicacion, $desc, $personaId, $estadoId);
            echo json_encode(["success" => $result, "action" => "update"]);
        } else {
            $result = $model->insertSitio($nombre, $img, $ubicacion, $desc, $personaId, $estadoId);
            echo json_encode(["success" => $result, "action" => "insert"]);
        }
        break;

    case 'PUT':
 
        $data = json_decode(file_get_contents("php://input"), true);

        if ($data) {
            $idSitio = $data['id_sitio'] ?? null;
            $nombre = $data['nombre_sitio'] ?? '';
            $img = $data['img_sitio'] ?? '';
            $ubicacion = $data['ubicacion_sitio'] ?? '';
            $desc = $data['desc_sitio'] ?? '';
            $personaId = $data['persona_id_persona'] ?? null;
            $estadoId = $data['estado_id_estado'] ?? null;

            if ($idSitio) {
                $result = $model->updateSitio($idSitio, $nombre, $img, $ubicacion, $desc, $personaId, $estadoId);
                echo json_encode(["success" => $result, "action" => "put-update"]);
            } else {
                echo json_encode(["error" => "ID del sitio no proporcionado"]);
            }
        } else {
            echo json_encode(["error" => "Datos JSON inválidos"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($id !== null) {
            $result = $model->deleteSitio($id);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "ID no proporcionado"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}

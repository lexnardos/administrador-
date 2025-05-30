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

require_once 'PersonaModel.php';
$model = new PersonaModel($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $model->getPersonas();
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        break;

    case 'POST':
        $nombre_usu = $_POST['nombre_usu'] ?? null;
        $apellido_usu = $_POST['apellido_usu'] ?? null;
        $tipo_documento = $_POST['tipo_documento'] ?? null;
        $documento = $_POST['documento'] ?? null;
        $email_usu = $_POST['email_usu'] ?? null;
        $telefono_usu = $_POST['telefono_usu'] ?? null;
        $genero = $_POST['genero'] ?? null;
        $localidad = $_POST['localidad'] ?? null;
        $fecha_nacimiento = $_POST['fecha_nacimiento'] ?? null;
        $contraseña = $_POST['contraseña'] ?? null;
        $id_estado = $_POST['id_estado'] ?? null;
        $token = $_POST['token'] ?? null;
        $id_seguridad = $_POST['id_seguridad'] ?? null;
        $rol_idRol = $_POST['rol_idRol'] ?? null;
        $foto_perfil = $_POST['foto_perfil'] ?? null;

        if ($nombre_usu && $apellido_usu && $tipo_documento && $documento && $email_usu && $telefono_usu && $genero && $localidad && $fecha_nacimiento && $contraseña && $id_estado !== null && $token && $id_seguridad !== null && $rol_idRol && $foto_perfil) {
            $result = $model->insertPersona($nombre_usu, $apellido_usu, $tipo_documento, $documento, $email_usu, $telefono_usu, $genero, $localidad, $fecha_nacimiento, $contraseña, $id_estado, $token, $id_seguridad, $rol_idRol, $foto_perfil);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "Datos incompletos"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);

        $id = $data['id_persona'] ?? null;
        $nombre_usu = $data['nombre_usu'] ?? null;
        $apellido_usu = $data['apellido_usu'] ?? null;
        $tipo_documento = $data['tipo_documento'] ?? null;
        $documento = $data['documento'] ?? null;
        $email_usu = $data['email_usu'] ?? null;
        $telefono_usu = $data['telefono_usu'] ?? null;
        $genero = $data['genero'] ?? null;
        $localidad = $data['localidad'] ?? null;
        $fecha_nacimiento = $data['fecha_nacimiento'] ?? null;
        $contraseña = $data['contraseña'] ?? null;
        $id_estado = $data['id_estado'] ?? null;
        $token = $data['token'] ?? null;
        $id_seguridad = $data['id_seguridad'] ?? null;
        $rol_idRol = $data['rol_idRol'] ?? null;
        $foto_perfil = $data['foto_perfil'] ?? null;

        if ($id && $nombre_usu && $apellido_usu && $tipo_documento && $documento && $email_usu && $telefono_usu && $genero && $localidad && $fecha_nacimiento && $contraseña && $id_estado !== null && $token && $id_seguridad !== null && $rol_idRol && $foto_perfil) {
            $result = $model->updatePersona($id, $nombre_usu, $apellido_usu, $tipo_documento, $documento, $email_usu, $telefono_usu, $genero, $localidad, $fecha_nacimiento, $contraseña, $id_estado, $token, $id_seguridad, $rol_idRol, $foto_perfil);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "Datos incompletos"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($id !== null) {
            $result = $model->deletePersona($id);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "ID no proporcionado"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}

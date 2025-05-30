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

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM seguridad";
        $result = $conn->query($sql);

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    case 'POST':
        // Recibir datos JSON o form-data
        $input = json_decode(file_get_contents("php://input"), true);

        $email_usu = $input['email_usu'] ?? $_POST['email_usu'] ?? null;
        $contra_usu = $input['contra_usu'] ?? $_POST['contra_usu'] ?? null;

        if ($email_usu && $contra_usu) {
            $stmt = $conn->prepare("INSERT INTO seguridad (email_usu, contra_usu) VALUES (?, ?)");
            $stmt->bind_param("ss", $email_usu, $contra_usu);
            $exec = $stmt->execute();

            echo json_encode(["success" => $exec]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Faltan email o contraseña"]);
        }
        break;

    case 'PUT':
        $input = json_decode(file_get_contents("php://input"), true);

        $id = $input['id_seguridad'] ?? null;
        $email_usu = $input['email_usu'] ?? null;
        $contra_usu = $input['contra_usu'] ?? null;

        if ($id && $email_usu && $contra_usu) {
            $stmt = $conn->prepare("UPDATE seguridad SET email_usu = ?, contra_usu = ? WHERE id_seguridad = ?");
            $stmt->bind_param("ssi", $email_usu, $contra_usu, $id);
            $exec = $stmt->execute();

            echo json_encode(["success" => $exec]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Datos incompletos para actualizar"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($id) {
            $stmt = $conn->prepare("DELETE FROM seguridad WHERE id_seguridad = ?");
            $stmt->bind_param("i", $id);
            $exec = $stmt->execute();

            echo json_encode(["success" => $exec]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Falta el ID para eliminar"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}
$conn->close();

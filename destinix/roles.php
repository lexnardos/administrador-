<?php
// Headers para CORS y JSON
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Responder a preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexión a la base de datos
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'destinix';
$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

// Clase del modelo Rol
class RolModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getRoles() {
        $sql = "SELECT * FROM rol";
        return $this->conn->query($sql);
    }

    public function insertRol($tipo_rol) {
        $stmt = $this->conn->prepare("INSERT INTO rol (Tipo_Rol) VALUES (?)");
        $stmt->bind_param("s", $tipo_rol);
        return $stmt->execute();
    }

    public function updateRol($id, $tipo_rol) {
        $stmt = $this->conn->prepare("UPDATE rol SET Tipo_Rol = ? WHERE idRol = ?");
        $stmt->bind_param("si", $tipo_rol, $id);
        return $stmt->execute();
    }

    public function deleteRol($id) {
        $stmt = $this->conn->prepare("DELETE FROM rol WHERE idRol = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}

// Instanciar modelo
$model = new RolModel($conn);

// Manejo de métodos HTTP
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
            http_response_code(400);
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
            http_response_code(400);
            echo json_encode(["error" => "Datos incompletos"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if ($id !== null) {
            $result = $model->deleteRol($id);
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

$conn->close();
?>

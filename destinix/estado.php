<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Responder a preflight
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
    http_response_code(500);
    echo json_encode(["error" => "Conexión fallida: " . $conn->connect_error]);
    exit();
}

// Clase del modelo Estado
class EstadoModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getEstados() {
        $sql = "SELECT * FROM estado ORDER BY id_estado ASC";
        return $this->conn->query($sql);
    }

    public function insertEstado($desc_estado) {
        $stmt = $this->conn->prepare("INSERT INTO estado (desc_estado) VALUES (?)");
        $stmt->bind_param("s", $desc_estado);
        return $stmt->execute();
    }

    public function updateEstado($id, $desc_estado) {
        $stmt = $this->conn->prepare("UPDATE estado SET desc_estado = ? WHERE id_estado = ?");
        $stmt->bind_param("si", $desc_estado, $id);
        return $stmt->execute();
    }

    public function deleteEstado($id) {
        $stmt = $this->conn->prepare("DELETE FROM estado WHERE id_estado = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}

// Instanciar modelo
$model = new EstadoModel($conn);

// Manejo de métodos HTTP
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
    $data = json_decode(file_get_contents("php://input"), true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(["error" => "JSON inválido o vacío"]);
        exit();
    }

    $desc_estado = trim($data['desc_estado'] ?? '');

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

$conn->close();
?>

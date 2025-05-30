<?php
// Cabeceras necesarias
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexión
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'destinix';
$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

// Modelo
class CategoriaModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getCategorias() {
        $sql = "SELECT * FROM categoria";
        return $this->conn->query($sql);
    }

    public function insertCategoria($nombre, $descripcion) {
        $stmt = $this->conn->prepare("INSERT INTO categoria (nombre_cate, desc_cate) VALUES (?, ?)");
        $stmt->bind_param("ss", $nombre, $descripcion);
        return $stmt->execute();
    }

    public function updateCategoria($id, $nombre, $descripcion) {
        $stmt = $this->conn->prepare("UPDATE categoria SET nombre_cate = ?, desc_cate = ? WHERE id_categoria = ?");
        $stmt->bind_param("ssi", $nombre, $descripcion, $id);
        return $stmt->execute();
    }

    public function deleteCategoria($id) {
        $stmt = $this->conn->prepare("DELETE FROM categoria WHERE id_categoria = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function getSimpleCategorias() {
        $sql = "SELECT id_categoria, nombre_cate FROM categoria";
        return $this->conn->query($sql);
    }
}

// Controlador
$model = new CategoriaModel($conn);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['simple']) && $_GET['simple'] == 1) {
            $result = $model->getSimpleCategorias();
        } else {
            $result = $model->getCategorias();
        }

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        break;

    case 'POST':
    // Intentamos obtener datos desde JSON si $_POST viene vacío
    $nombre = $_POST['nombre_cate'] ?? null;
    $descripcion = $_POST['desc_cate'] ?? null;

    if (!$nombre || !$descripcion) {
        // Probamos con JSON en caso de que $_POST esté vacío
        $data = json_decode(file_get_contents("php://input"), true);
        $nombre = $data['nombre_cate'] ?? null;
        $descripcion = $data['desc_cate'] ?? null;
    }

    if (isset($_GET['editar']) && $_GET['editar'] == 1) {
        $id = $_POST['id_categoria'] ?? ($data['id_categoria'] ?? null);

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
            echo json_encode(["error" => "Datos incompletos para crear", "debug" => [
                "nombre" => $nombre,
                "descripcion" => $descripcion
            ]]);
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
?>

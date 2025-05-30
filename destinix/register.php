<?php
ob_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "destinix";

$conn = mysqli_connect($servername, $username, $password, $dbname);
if (!$conn) {
    ob_end_clean();
    die(json_encode(["success" => false, "message" => "Connection failed: " . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);

$nombre = mysqli_real_escape_string($conn, $data['nombre'] ?? '');
$apellidos = mysqli_real_escape_string($conn, $data['apellidos'] ?? '');
$telefono = mysqli_real_escape_string($conn, $data['telefono'] ?? '');
$email = mysqli_real_escape_string($conn, $data['email'] ?? '');
$documento = mysqli_real_escape_string($conn, $data['documento'] ?? '');
$localidad = mysqli_real_escape_string($conn, $data['localidad'] ?? '');
$genero = mysqli_real_escape_string($conn, $data['genero'] ?? '');
$fecha = mysqli_real_escape_string($conn, $data['fecha'] ?? '');
$contraseña = mysqli_real_escape_string($conn, $data['contraseña'] ?? '');

if (
    empty($nombre) || empty($apellidos) || empty($telefono) || empty($email) ||
    empty($documento) || empty($localidad) || empty($genero) || empty($fecha) || empty($contraseña)
) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
    exit();
}

if (strlen($documento) !== 10 || !ctype_digit($documento)) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Documento de identidad inválido"]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Correo electrónico no válido"]);
    exit();
}

if (
    !preg_match('/[A-Z]/', $contraseña) ||
    !preg_match('/[a-z]/', $contraseña) ||
    !preg_match('/[0-9]/', $contraseña) ||
    !preg_match('/[\W_]/', $contraseña) ||
    strlen($contraseña) < 8
) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales."]);
    exit();
}

$fecha_nacimiento = DateTime::createFromFormat('Y-m-d', $fecha);
$hoy = new DateTime();
$edad = $hoy->diff($fecha_nacimiento)->y;

if ($edad < 18) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Debes tener al menos 18 años para registrarte"]);
    exit();
}

$hash = password_hash($contraseña, PASSWORD_BCRYPT);

try {
    $stmt = $conn->prepare("SELECT telefono_usu FROM persona WHERE telefono_usu = ?");
    $stmt->bind_param("s", $telefono);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        ob_end_clean();
        echo json_encode(["success" => false, "message" => "El teléfono ya está registrado"]);
        $stmt->close();
        exit();
    }
    $stmt->close();

    $stmt = $conn->prepare("SELECT documento FROM persona WHERE documento = ?");
    $stmt->bind_param("s", $documento);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        ob_end_clean();
        echo json_encode(["success" => false, "message" => "El documento ya está registrado"]);
        $stmt->close();
        exit();
    }
    $stmt->close();

    // Insertar en seguridad
    $stmt = $conn->prepare("INSERT INTO seguridad (email_usu, contra_usu) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $hash);
    if (!$stmt->execute()) {
        throw new Exception("Error al insertar en seguridad: " . $stmt->error);
    }
    $id_seguridad = $stmt->insert_id;
    $stmt->close();

    // Insertar en persona
    $rol_idRol = 1; // Rol predefinido para nuevos usuarios

    $stmt = $conn->prepare("INSERT INTO persona (
        nombre_usu, apellido_usu, tipo_documento, documento, email_usu, telefono_usu, genero, localidad, fecha_nacimiento, contraseña, id_seguridad, rol_idRol
    ) VALUES (?, ?, 'CC', ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param("ssssssssssi", $nombre, $apellidos, $documento, $email, $telefono, $genero, $localidad, $fecha, $hash, $id_seguridad, $rol_idRol);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Usuario registrado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al registrar usuario en persona: " . $stmt->error]);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}

$conn->close();
?>

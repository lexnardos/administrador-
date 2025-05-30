<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit(0);
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "destinix";

$conn = mysqli_connect($servername, $username, $password, $dbname);
if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión con la base de datos.']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos en la solicitud.']);
    exit;
}

$email = mysqli_real_escape_string($conn, $data['email']);
$contraseña = $data['password'];

$sql = "SELECT 
            p.id_persona, 
            s.contra_usu, 
            p.rol_idRol, 
            p.nombre_usu, 
            p.apellido_usu 
        FROM persona p 
        INNER JOIN seguridad s ON p.email_usu = s.email_usu 
        WHERE s.email_usu = ?";

$stmt = mysqli_prepare($conn, $sql);
if ($stmt) {
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        $hash_almacenado = $row['contra_usu'];

        if (password_verify($contraseña, $hash_almacenado)) {
            $_SESSION['id_persona'] = $row['id_persona'];
            $_SESSION['rol_idRol'] = $row['rol_idRol'];

            echo json_encode([
                'success' => true,
                'message' => 'Inicio de sesión exitoso.',
                'id_persona' => $row['id_persona'],
                'rol_idRol' => $row['rol_idRol'],
                'nombre' => $row['nombre_usu'],
                'apellido' => $row['apellido_usu']
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
    }

    mysqli_stmt_close($stmt);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al preparar la consulta.']);
}

mysqli_close($conn);

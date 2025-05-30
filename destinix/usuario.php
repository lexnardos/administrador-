<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

$conexion = new mysqli("localhost", "root", "", "destinix");

if ($conexion->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conexion->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];

if (isset($_SESSION['id_persona'])) {
    $id_persona = $_SESSION['id_persona'];

    if ($method === "GET") {
        $query = "SELECT * FROM persona WHERE id_persona = '$id_persona'";
        $resultado = $conexion->query($query);
        $data = [];

        if ($resultado->num_rows > 0) {
            $data = $resultado->fetch_assoc();

            if (!empty($data["foto_perfil"])) {
                $data["foto_perfil"] = "http://localhost/destinix/imagenes/" . $data["foto_perfil"];
            }
        }

        echo json_encode($data);
    } elseif ($method === "POST") {
        $nombre = $_POST['nombre_usu'] ?? '';
        $apellido = $_POST['apellido_usu'] ?? '';
        $email = $_POST['email_usu'] ?? '';
        $localidad = $_POST['localidad'] ?? '';
        $numero = $_POST['telefono_usu'] ?? ''; // ➕ Nuevo campo

        $foto_perfil = null;

        if (isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/imagenes/';
            $fileName = uniqid() . '_' . basename($_FILES['foto_perfil']['name']);
            $uploadFile = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['foto_perfil']['tmp_name'], $uploadFile)) {
                $foto_perfil = $fileName;
            } else {
                echo json_encode(["error" => "Error subiendo la imagen."]);
                exit;
            }
        }

        if ($foto_perfil) {
            $query = "UPDATE persona SET nombre_usu='$nombre', apellido_usu='$apellido', email_usu='$email', localidad='$localidad', telefono_usu='$numero', foto_perfil='$foto_perfil' WHERE id_persona='$id_persona'";
        } else {
            $query = "UPDATE persona SET nombre_usu='$nombre', apellido_usu='$apellido', email_usu='$email', localidad='$localidad', telefono_usu='$numero' WHERE id_persona='$id_persona'";
        }

        if ($conexion->query($query) === TRUE) {
            echo json_encode(["success" => true, "foto_perfil" => $foto_perfil ? "http://localhost/destinix/imagenes/$fileName" : null]);
        } else {
            echo json_encode(["error" => "Error actualizando datos: " . $conexion->error]);
        }
    }
} else {
    echo json_encode(["error" => "Sesión no válida o ID de usuario no encontrado."]);
}

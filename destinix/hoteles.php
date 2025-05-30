<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

$conexion = new mysqli("localhost", "root", "", "destinix");

if ($conexion->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conexion->connect_error]));
}

$method = $_SERVER["REQUEST_METHOD"];
$inputData = json_decode(file_get_contents("php://input"), true);

// 📌 GET - Listar hoteles
if ($method === "GET") {
    $query = "SELECT * FROM hoteles";
    $resultado = $conexion->query($query);
    $data = [];

    while ($row = $resultado->fetch_assoc()) {
        $row["img"] = "http://localhost/destinix/imagenes/" . $row["img"];
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}

// 📌 POST - Crear hotel con imagen
if ($method === "POST") {
    if (!isset($_FILES["img"])) {
        echo json_encode(["error" => "No se recibió ninguna imagen"]);
        exit;
    }

    $uploadDir = "../imagenes/";
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileTmpPath = $_FILES["img"]["tmp_name"];
    $fileName = basename($_FILES["img"]["name"]);
    $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowedTypes = ["jpg", "jpeg", "png", "gif"];

    if (!in_array($fileType, $allowedTypes)) {
        echo json_encode(["error" => "Formato de imagen no permitido"]);
        exit;
    }

    $newFileName = uniqid() . "." . $fileType;
    $destPath = $uploadDir . $newFileName;

    if (!move_uploaded_file($fileTmpPath, $destPath)) {
        echo json_encode(["error" => "Error al guardar la imagen"]);
        exit;
    }

    $titulo = $_POST["titulo_hotel"];
    $descripcion = $_POST["descripcion_hotel"];
    $estado = $_POST["estado_id_estado"];
    $empresa = $_POST["empresa_id_empresa"];

    $query = "INSERT INTO hoteles (titulo_hotel, img, descripcion_hotel, estado_id_estado, empresa_id_empresa)
              VALUES ('$titulo', '$newFileName', '$descripcion', '$estado', '$empresa')";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["success" => true, "mensaje" => "Hotel agregado"]);
    } else {
        echo json_encode(["error" => "Error al guardar: " . $conexion->error]);
    }
    exit;
}

// 📌 PUT - Actualizar hotel
if ($method === "PUT") {
    if (!$inputData || !isset($inputData["id_hoteles"])) {
        echo json_encode(["error" => "Datos incompletos para actualizar."]);
        exit;
    }

    $id = $inputData["id_hoteles"];
    $titulo = $inputData["titulo_hotel"];
    $descripcion = $inputData["descripcion_hotel"];
    $estado = $inputData["estado_id_estado"];
    $empresa = $inputData["empresa_id_empresa"];

    $query = "UPDATE hoteles SET 
                titulo_hotel='$titulo', 
                descripcion_hotel='$descripcion', 
                estado_id_estado='$estado', 
                empresa_id_empresa='$empresa'
              WHERE id_hoteles=$id";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["success" => true, "mensaje" => "Hotel actualizado"]);
    } else {
        echo json_encode(["error" => "Error al actualizar: " . $conexion->error]);
    }
    exit;
}

// 📌 DELETE - Eliminar hotel
if ($method === "DELETE") {
    if (!$inputData || !isset($inputData["id_hoteles"])) {
        echo json_encode(["error" => "ID no proporcionado para eliminar."]);
        exit;
    }

    $id = $inputData["id_hoteles"];
    $query = "DELETE FROM hoteles WHERE id_hoteles=$id";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["success" => true, "mensaje" => "Hotel eliminado"]);
    } else {
        echo json_encode(["error" => "Error al eliminar: " . $conexion->error]);
    }
    exit;
}

$conexion->close();

<?php
header("Access-Control-Allow-Origin:  http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


$conexion = new mysqli("localhost", "root", "", "destinix");

if ($conexion->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conexion->connect_error]));
}

$method = $_SERVER["REQUEST_METHOD"];

// 🔄 Convertir datos en crudo a JSON cuando sea PUT o DELETE
$inputData = json_decode(file_get_contents("php://input"), true);

// 📌 1. GET - Listar todos los restaurantes
if ($method === "GET") {
    $query = "SELECT * FROM restaurantes";
    $resultado = $conexion->query($query);
    $data = [];

    if ($resultado->num_rows > 0) {
        while ($row = $resultado->fetch_assoc()) {
            $row["img"] = "http://localhost/destinix/imagenes/" . $row["img"];
            $data[] = $row;
        }
    }

    echo json_encode($data);
    exit;
}

// 📌 2. POST - Crear restaurante con imagen
if ($method === "POST") {
    if (!isset($_FILES["img"])) {
        die(json_encode(["error" => "No se recibió ninguna imagen"]));
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
        die(json_encode(["error" => "Formato de imagen no permitido (jpg, jpeg, png, gif)"]));
    }

    $newFileName = uniqid() . "." . $fileType;
    $destPath = $uploadDir . $newFileName;

    if (!move_uploaded_file($fileTmpPath, $destPath)) {
        die(json_encode(["error" => "Error al guardar la imagen"]));
    }

    $titulo = $_POST["titulo_restaurante"];
    $desc = $_POST["desc_restaurantes"];
    $estado = $_POST["estado_id_estado"];
    $empresa = $_POST["empresa_id_empresa"];
    $calificacion = isset($_POST["calificacion_id_calificacion"]) ? $_POST["calificacion_id_calificacion"] : "NULL";

    $query = "INSERT INTO restaurantes (titulo_restaurante, img, desc_restaurantes, estado_id_estado, empresa_id_empresa, calificacion_id_calificacion) 
              VALUES ('$titulo', '$newFileName', '$desc', '$estado', '$empresa', $calificacion)";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Restaurante agregado con éxito", "img" => $newFileName]);
    } else {
        echo json_encode(["error" => "Error al guardar en la base de datos: " . $conexion->error]);
    }
    exit;
}

// 📌 3. PUT - Actualizar restaurante (sin imagen, solo datos)
if ($method === "PUT") {
    if (!$inputData || !isset($inputData["id_restaurante"])) {
        echo json_encode(["error" => "Datos incompletos para actualizar."]);
        exit;
    }

    $id = $inputData["id_restaurante"];
    $titulo = $inputData["titulo_restaurante"];
    $desc = $inputData["desc_restaurantes"];
    $estado = $inputData["estado_id_estado"];
    $empresa = $inputData["empresa_id_empresa"];
    $calificacion = $inputData["calificacion_id_calificacion"];

    $query = "UPDATE restaurantes SET 
                titulo_restaurante='$titulo', 
                desc_restaurantes='$desc', 
                estado_id_estado='$estado', 
                empresa_id_empresa='$empresa', 
                calificacion_id_calificacion=$calificacion
              WHERE id_restaurante=$id";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Restaurante actualizado exitosamente."]);
    } else {
        echo json_encode(["error" => "Error al actualizar: " . $conexion->error]);
    }
    exit;
}

// 📌 4. DELETE - Eliminar restaurante por ID
if ($method === "DELETE") {
    if (!$inputData || !isset($inputData["id_restaurante"])) {
        echo json_encode(["error" => "ID no proporcionado para eliminar."]);
        exit;
    }

    $id = $inputData["id_restaurante"];
    $query = "DELETE FROM restaurantes WHERE id_restaurante=$id";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Restaurante eliminado exitosamente."]);
    } else {
        echo json_encode(["error" => "Error al eliminar: " . $conexion->error]);
    }
    exit;
}

$conexion->close();
?>

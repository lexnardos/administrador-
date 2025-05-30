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

// 📌 1. GET - Obtener todos los sitios turísticos
if ($method === "GET") {
    $query = "SELECT * FROM sitio_turistico";
    $resultado = $conexion->query($query);
    $data = [];

    if ($resultado->num_rows > 0) {
        while ($row = $resultado->fetch_assoc()) {
            $row["img_sitio"] = "http://localhost/destinix/imagenes/" . $row["img_sitio"];
            $data[] = $row;
        }
    }

    echo json_encode($data);
    exit;
}

// 📌 2. POST - Crear nuevo sitio turístico con imagen
if ($method === "POST") {
    if (!isset($_FILES["img_sitio"])) {
        die(json_encode(["error" => "No se recibió ninguna imagen"]));
    }

    $uploadDir = "../imagenes/";
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileTmpPath = $_FILES["img_sitio"]["tmp_name"];
    $fileName = basename($_FILES["img_sitio"]["name"]);
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

    $nombre = $_POST["nombre_sitio"];
    $ubicacion = $_POST["ubicacion_sitio"];
    $descripcion = $_POST["desc_sitio"];
    $persona = $_POST["persona_id_persona"];
    $estado = $_POST["estado_id_estado"];
    $calificacion = isset($_POST["calificacion_id_calificacion"]) ? $_POST["calificacion_id_calificacion"] : "NULL";

    $query = "INSERT INTO sitio_turistico (nombre_sitio, img_sitio, ubicacion_sitio, desc_sitio, persona_id_persona, estado_id_estado, calificacion_id_calificacion)
              VALUES ('$nombre', '$newFileName', '$ubicacion', '$descripcion', '$persona', '$estado', $calificacion)";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Sitio turístico agregado con éxito", "img" => $newFileName]);
    } else {
        echo json_encode(["error" => "Error al guardar en la base de datos: " . $conexion->error]);
    }
    exit;
}

// 📌 3. PUT - Actualizar sitio turístico (sin imagen)
if ($method === "PUT") {
    if (!$inputData || !isset($inputData["id_sitio"])) {
        echo json_encode(["error" => "Datos incompletos para actualizar."]);
        exit;
    }

    $id = $inputData["id_sitio"];
    $nombre = $inputData["nombre_sitio"];
    $ubicacion = $inputData["ubicacion_sitio"];
    $descripcion = $inputData["desc_sitio"];
    $persona = $inputData["persona_id_persona"];
    $estado = $inputData["estado_id_estado"];
    $calificacion = $inputData["calificacion_id_calificacion"];

    $query = "UPDATE sitio_turistico SET 
                nombre_sitio='$nombre', 
                ubicacion_sitio='$ubicacion', 
                desc_sitio='$descripcion', 
                persona_id_persona='$persona', 
                estado_id_estado='$estado', 
                calificacion_id_calificacion=$calificacion
              WHERE id_sitio=$id";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Sitio turístico actualizado exitosamente."]);
    } else {
        echo json_encode(["error" => "Error al actualizar: " . $conexion->error]);
    }
    exit;
}

// 📌 4. DELETE - Eliminar sitio turístico por ID
if ($method === "DELETE") {
    if (!$inputData || !isset($inputData["id_sitio"])) {
        echo json_encode(["error" => "ID no proporcionado para eliminar."]);
        exit;
    }

    $id = $inputData["id_sitio"];
    $query = "DELETE FROM sitio_turistico WHERE id_sitio=$id";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Sitio turístico eliminado exitosamente."]);
    } else {
        echo json_encode(["error" => "Error al eliminar: " . $conexion->error]);
    }
    exit;
}

$conexion->close();
?>

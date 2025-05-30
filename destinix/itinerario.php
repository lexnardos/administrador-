<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$mysqli = new mysqli("localhost", "root", "", "destinix");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos."]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Función para simplificar respuesta
function sendResponse($code, $data) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// Obtener sitios turísticos, hoteles o restaurantes (acceso libre)
if ($method === 'GET' && isset($_GET["tipo"])) {
    $tipo = $_GET["tipo"];
    $query = "";

    if ($tipo === "hotel") {
        $query = "SELECT id_hoteles AS id, titulo_hotel AS nombre FROM hoteles";
    } elseif ($tipo === "restaurante") {
        $query = "SELECT id_restaurante AS id, titulo_restaurante AS nombre FROM restaurantes";
    } elseif ($tipo === "sitio_turistico") {
        $query = "SELECT id_sitio AS id, nombre_sitio AS nombre FROM sitio_turistico";
    } else {
        sendResponse(400, ["error" => "Tipo de evento no válido"]);
    }

    $result = $mysqli->query($query);
    $sitios = [];
    while ($row = $result->fetch_assoc()) {
        $sitios[] = $row;
    }
    sendResponse(200, $sitios);
}



// CRUD Itinerario
switch ($method) {
    case 'GET':
        $fecha = $_GET['fecha'] ?? null;
        $persona_id = $_GET['persona_id'] ?? null;

        $query = "SELECT i.*, 
                        COALESCE(h.titulo_hotel, r.titulo_restaurante, s.nombre_sitio) AS nombre_actividad,
                        COALESCE(h.img, r.img, s.img_sitio) AS imagen_actividad,
                        CASE 
                            WHEN i.id_hoteles IS NOT NULL THEN 'hotel'
                            WHEN i.id_restaurante IS NOT NULL THEN 'restaurante'
                            WHEN i.id_sitio IS NOT NULL THEN 'sitio_turistico'
                            ELSE 'otro'
                        END AS tipo_actividad
                  FROM itinerario i
                  LEFT JOIN hoteles h ON i.id_hoteles = h.id_hoteles
                  LEFT JOIN restaurantes r ON i.id_restaurante = r.id_restaurante
                  LEFT JOIN sitio_turistico s ON i.id_sitio = s.id_sitio
                  WHERE 1=1";

        if ($fecha) {
            $query .= " AND i.fecha_itinerario = '" . $mysqli->real_escape_string($fecha) . "'";
        }

        if ($persona_id) {
            $query .= " AND i.persona_id_persona = " . intval($persona_id);
        }

        $query .= " ORDER BY i.fecha_itinerario, i.hora_inicio";

        $result = $mysqli->query($query);
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        sendResponse(200, $data);
        break;

    case 'POST':
        if (!isset($_SESSION['id_persona'])) {
            sendResponse(403, ["error" => "No hay sesión activa"]);
        }

        if (!$input) {
            sendResponse(400, ["error" => "No se recibieron datos"]);
        }

        $persona_id = $_SESSION['id_persona'];
        $tipoEvento = $input["tipoEvento"] ?? null;
        $sitioSeleccionado = intval($input["sitioSeleccionado"] ?? 0);

        $id_sitio = ($tipoEvento === "sitio_turistico") ? $sitioSeleccionado : null;
        $id_hoteles = ($tipoEvento === "hotel") ? $sitioSeleccionado : null;
        $id_restaurante = ($tipoEvento === "restaurante") ? $sitioSeleccionado : null;

        $fecha = $input["fecha"];
        $hora_inicio = strlen($input['horaInicio']) === 5 ? $input['horaInicio'] . ':00' : $input['horaInicio'];
        $hora_fin = strlen($input['horaFin']) === 5 ? $input['horaFin'] . ':00' : $input['horaFin'];
        $descripcion = $input["nombre"];
        $estado = 0;

        $stmt = $mysqli->prepare("INSERT INTO itinerario (persona_id_persona, id_sitio, id_hoteles, id_restaurante, fecha_itinerario, hora_inicio, hora_fin, descripcion, estado_id_estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iiiissssi", $persona_id, $id_sitio, $id_hoteles, $id_restaurante, $fecha, $hora_inicio, $hora_fin, $descripcion, $estado);

        if ($stmt->execute()) {
            sendResponse(201, ["success" => "Evento agregado correctamente", "id" => $stmt->insert_id]);
        } else {
            sendResponse(500, ["error" => "Error al insertar: " . $stmt->error]);
        }
        break;

        case 'PUT':
            if (!isset($input['id_itinerario'])) {
                sendResponse(400, ["success" => false, "error" => "ID del itinerario no proporcionado."]);
            }
            
            $id = $input['id_itinerario'];
            $nombre = $mysqli->real_escape_string($input['nombre']);
            $horaInicio = $mysqli->real_escape_string($input['horaInicio']);
            $horaFin = $mysqli->real_escape_string($input['horaFin']);
            $sitioSeleccionado = $mysqli->real_escape_string($input['sitioSeleccionado']);
            $fecha = $mysqli->real_escape_string($input['fecha']);
            
            // Dependiendo del tipo de evento, actualiza el campo correspondiente
            $updateQuery = "UPDATE itinerario SET 
                descripcion = '$nombre',
                fecha_itinerario = '$fecha',
                hora_inicio = '$horaInicio',
                hora_fin = '$horaFin',
                id_sitio = NULL,
                id_restaurante = NULL,
                id_hoteles = NULL"; // Eliminar tipo_actividad
            
            if ($input['tipoEvento'] === "hotel") {
                $updateQuery .= ", id_hoteles = '$sitioSeleccionado'";
            } elseif ($input['tipoEvento'] === "restaurante") {
                $updateQuery .= ", id_restaurante = '$sitioSeleccionado'";
            } elseif ($input['tipoEvento'] === "sitio_turistico") {
                $updateQuery .= ", id_sitio = '$sitioSeleccionado'";
            }
            
            $updateQuery .= " WHERE id_itinerario = $id";
            
            if ($mysqli->query($updateQuery)) {
                sendResponse(200, ["success" => true]);
            } else {
                sendResponse(500, ["success" => false, "error" => $mysqli->error]);
            }
            break;
        

        case 'DELETE':
            if (empty($_GET['id'])) {
                sendResponse(400, ["error" => "Falta el id_itinerario para eliminar"]);
            }
        
            $id = intval($_GET['id']);
            $stmt = $mysqli->prepare("DELETE FROM itinerario WHERE id_itinerario = ?");
            $stmt->bind_param('i', $id);
        
            if ($stmt->execute()) {
                sendResponse(200, ["success" => "Evento eliminado correctamente"]);
            } else {
                sendResponse(500, ["error" => "Error al eliminar: " . $stmt->error]);
            }
            break;

    default:
        sendResponse(405, ["error" => "Método no permitido"]);
}
?>
